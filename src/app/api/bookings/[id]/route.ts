import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateBookingSchema } from "@/lib/validations/booking";
import { stripe } from "@/lib/stripe";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      listing: {
        include: {
          photos: true,
          host: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        },
      },
      guest: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true, email: true },
      },
      review: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Only allow guest or host to see booking
  if (booking.guestId !== session.user.id && booking.listing.hostId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return NextResponse.json({
    ...booking,
    pricePerUnit: Number(booking.pricePerUnit),
    subtotal: Number(booking.subtotal),
    serviceFee: Number(booking.serviceFee),
    hostPayout: Number(booking.hostPayout),
    totalPrice: Number(booking.totalPrice),
  });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { listing: { include: { host: true } } },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const body = await request.json();
  const parsed = updateBookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { status, hostNotes, cancellationReason } = parsed.data;

  // Authorization checks
  if (status === "CANCELLED_GUEST" && booking.guestId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (
    (status === "CONFIRMED" || status === "CANCELLED_HOST") &&
    booking.listing.hostId !== session.user.id
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Handle refund for cancellations
  if (
    (status === "CANCELLED_GUEST" || status === "CANCELLED_HOST") &&
    booking.stripePaymentIntentId
  ) {
    try {
      await stripe.refunds.create({
        payment_intent: booking.stripePaymentIntentId,
      });
    } catch (err) {
      console.error("Refund error:", err);
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      status,
      hostNotes,
      cancellationReason,
      cancelledAt:
        status === "CANCELLED_GUEST" || status === "CANCELLED_HOST"
          ? new Date()
          : undefined,
    },
  });

  return NextResponse.json(updated);
}
