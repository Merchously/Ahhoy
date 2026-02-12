import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createBookingSchema } from "@/lib/validations/booking";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FEE_PERCENT } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") || "guest";

  const where =
    role === "host"
      ? { listing: { hostId: session.user.id } }
      : { guestId: session.user.id };

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      listing: {
        include: {
          photos: { where: { isPrimary: true }, take: 1 },
          host: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
      },
      guest: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true, email: true },
      },
      review: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { listingId, date, endDate, startTime, endTime, guestCount, messageToHost } = parsed.data;

    // Get listing with host info
    const listing = await prisma.listing.findUnique({
      where: { id: listingId, status: "PUBLISHED" },
      include: { host: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.hostId === session.user.id) {
      return NextResponse.json({ error: "Cannot book your own listing" }, { status: 400 });
    }

    if (guestCount > listing.maxGuests || guestCount < listing.minGuests) {
      return NextResponse.json({ error: "Guest count out of range" }, { status: 400 });
    }

    // Check host has Stripe onboarding
    if (!listing.host.stripeConnectId || !listing.host.stripeOnboardingComplete) {
      return NextResponse.json({ error: "Host is not set up to receive payments" }, { status: 400 });
    }

    // Check availability
    const startDate = new Date(date);

    if (endDate) {
      // Multi-day: check for overlapping bookings
      const endDateObj = new Date(endDate);
      const overlapping = await prisma.booking.findFirst({
        where: {
          listingId,
          status: { in: ["PENDING", "CONFIRMED", "PAID"] },
          date: { lte: endDateObj },
          OR: [
            { endDate: { gte: startDate } },
            { endDate: null, date: { gte: startDate, lte: endDateObj } },
          ],
        },
      });
      if (overlapping) {
        return NextResponse.json({ error: "These dates overlap with an existing booking" }, { status: 409 });
      }

      // Check blocked dates within range
      const blockedInRange = await prisma.blockedDate.findFirst({
        where: {
          listingId,
          date: { gte: startDate, lte: endDateObj },
        },
      });
      if (blockedInRange) {
        return NextResponse.json({ error: "One or more dates in this range are blocked" }, { status: 409 });
      }
    } else {
      // Single-day check
      const existingBooking = await prisma.booking.findFirst({
        where: {
          listingId,
          date: startDate,
          status: { in: ["PENDING", "CONFIRMED", "PAID"] },
        },
      });
      if (existingBooking) {
        return NextResponse.json({ error: "This date is already booked" }, { status: 409 });
      }
    }

    // Calculate pricing
    let pricePerUnit: number;
    let subtotal: number;

    if (listing.isMultiDay && endDate) {
      const nights = Math.ceil(
        (new Date(endDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      pricePerUnit = Number(listing.pricePerNight);
      const nightlyTotal = pricePerUnit * nights;
      subtotal =
        listing.pricingType === "PER_PERSON"
          ? nightlyTotal * guestCount
          : nightlyTotal;
    } else {
      pricePerUnit =
        listing.pricingType === "PER_PERSON"
          ? Number(listing.pricePerPerson)
          : Number(listing.flatPrice);
      subtotal =
        listing.pricingType === "PER_PERSON"
          ? pricePerUnit * guestCount
          : pricePerUnit;
    }

    const serviceFee = subtotal * (PLATFORM_FEE_PERCENT / 100);
    const totalPrice = subtotal + serviceFee;
    const hostPayout = subtotal;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        guestId: session.user.id,
        listingId,
        date: startDate,
        endDate: endDate ? new Date(endDate) : null,
        startTime,
        endTime,
        guestCount,
        pricePerUnit,
        pricingType: listing.pricingType,
        subtotal,
        serviceFee,
        hostPayout,
        totalPrice,
        currency: listing.currency,
        messageToHost,
        status: "PENDING",
      },
    });

    // Create Stripe Checkout Session
    const stripeDescription = endDate
      ? `${date} to ${endDate} | Check-in: ${startTime}, Check-out: ${endTime} | ${guestCount} guest(s)`
      : `${date} | ${startTime} - ${endTime} | ${guestCount} guest(s)`;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email!,
      line_items: [
        {
          price_data: {
            currency: listing.currency.toLowerCase(),
            product_data: {
              name: listing.title,
              description: stripeDescription,
            },
            unit_amount: Math.round(totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        transfer_data: {
          destination: listing.host.stripeConnectId!,
          amount: Math.round(hostPayout * 100),
        },
        metadata: {
          bookingId: booking.id,
          listingId,
          guestId: session.user.id,
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/${booking.id}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/listings/${listing.id}?cancelled=true`,
      metadata: {
        bookingId: booking.id,
      },
    });

    return NextResponse.json({
      booking,
      checkoutUrl: checkoutSession.url,
    }, { status: 201 });
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
