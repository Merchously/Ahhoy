import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { order: "asc" } },
      activityTypes: { include: { activityType: true } },
      host: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          bio: true,
          createdAt: true,
          languages: true,
          isSuperCaptain: true,
          _count: {
            select: {
              listings: { where: { status: "PUBLISHED" } },
              reviewsReceived: true,
            },
          },
        },
      },
      reviews: {
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      availability: true,
      blockedDates: true,
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  // Fetch booked dates for availability calendar
  const bookedBookings = await prisma.booking.findMany({
    where: {
      listingId: id,
      status: { in: ["PENDING", "CONFIRMED", "PAID"] },
      date: { gte: new Date() },
    },
    select: { date: true, endDate: true },
  });

  const averageRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : null;

  // Compute per-category rating averages
  const reviews = listing.reviews;
  function avgField(field: keyof typeof reviews[number]): number | null {
    const rated = reviews.filter((r) => r[field] != null);
    if (rated.length === 0) return null;
    return rated.reduce((sum, r) => sum + (r[field] as number), 0) / rated.length;
  }

  const categoryAverages = {
    safety: avgField("ratingSafety"),
    accuracy: avgField("ratingAccuracy"),
    checkin: avgField("ratingCheckin"),
    communication: avgField("ratingCommunication"),
    cleanliness: avgField("ratingCleanliness"),
    value: avgField("ratingValue"),
  };

  // Expand multi-day bookings into individual date strings
  const bookedDates: string[] = [];
  for (const b of bookedBookings) {
    if (b.endDate) {
      const current = new Date(b.date);
      const end = new Date(b.endDate);
      while (current <= end) {
        bookedDates.push(current.toISOString());
        current.setDate(current.getDate() + 1);
      }
    } else {
      bookedDates.push(b.date.toISOString());
    }
  }

  return NextResponse.json({
    ...listing,
    pricePerPerson: listing.pricePerPerson ? Number(listing.pricePerPerson) : null,
    flatPrice: listing.flatPrice ? Number(listing.flatPrice) : null,
    pricePerNight: listing.pricePerNight ? Number(listing.pricePerNight) : null,
    averageRating,
    reviewCount: listing.reviews.length,
    categoryAverages,
    bookedDates,
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

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.hostId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  const body = await request.json();

  // Hosts cannot set PUBLISHED directly — must go through admin approval
  if (body.status) {
    const allowedHostStatuses = ["DRAFT", "PENDING_REVIEW", "PAUSED", "ARCHIVED"];
    if (!allowedHostStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: "Only admins can publish listings. Submit for review instead." },
        { status: 403 }
      );
    }
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: body,
    include: {
      activityTypes: { include: { activityType: true } },
      photos: true,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing || listing.hostId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  await prisma.listing.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  return NextResponse.json({ success: true });
}
