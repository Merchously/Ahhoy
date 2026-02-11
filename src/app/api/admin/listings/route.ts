import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || undefined;
  const status = searchParams.get("status") || undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

  const where: Prisma.ListingWhereInput = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { locationName: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status && ["DRAFT", "PUBLISHED", "PAUSED", "ARCHIVED"].includes(status)) {
    where.status = status as Prisma.EnumListingStatusFilter["equals"];
  }

  const [listings, total] = await prisma.$transaction([
    prisma.listing.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        locationName: true,
        createdAt: true,
        host: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  return NextResponse.json({
    listings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
