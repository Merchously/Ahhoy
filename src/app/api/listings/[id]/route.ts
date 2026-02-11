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

  const averageRating =
    listing.reviews.length > 0
      ? listing.reviews.reduce((sum, r) => sum + r.rating, 0) / listing.reviews.length
      : null;

  return NextResponse.json({
    ...listing,
    pricePerPerson: listing.pricePerPerson ? Number(listing.pricePerPerson) : null,
    flatPrice: listing.flatPrice ? Number(listing.flatPrice) : null,
    averageRating,
    reviewCount: listing.reviews.length,
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
