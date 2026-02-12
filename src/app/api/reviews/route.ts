import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod/v4";

const createReviewSchema = z.object({
  bookingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
  ratingAccuracy: z.number().int().min(1).max(5).optional(),
  ratingCommunication: z.number().int().min(1).max(5).optional(),
  ratingValue: z.number().int().min(1).max(5).optional(),
  ratingSafety: z.number().int().min(1).max(5).optional(),
  ratingCheckin: z.number().int().min(1).max(5).optional(),
  ratingCleanliness: z.number().int().min(1).max(5).optional(),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");
  const userId = searchParams.get("userId");

  const where: Record<string, string> = {};
  if (listingId) where.listingId = listingId;
  if (userId) where.authorId = userId;

  const reviews = await prisma.review.findMany({
    where,
    include: {
      author: {
        select: { id: true, firstName: true, lastName: true, avatarUrl: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createReviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const {
    bookingId, rating, comment,
    ratingAccuracy, ratingCommunication, ratingValue,
    ratingSafety, ratingCheckin, ratingCleanliness,
  } = parsed.data;

  // Get booking
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { listing: true, review: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  if (booking.guestId !== session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (booking.status !== "COMPLETED" && booking.status !== "PAID") {
    return NextResponse.json({ error: "Can only review completed bookings" }, { status: 400 });
  }

  if (booking.review) {
    return NextResponse.json({ error: "Review already exists" }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: {
      bookingId,
      listingId: booking.listingId,
      authorId: session.user.id,
      hostId: booking.listing.hostId,
      rating,
      comment,
      ratingAccuracy,
      ratingCommunication,
      ratingValue,
      ratingSafety,
      ratingCheckin,
      ratingCleanliness,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
