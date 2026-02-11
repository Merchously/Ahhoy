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
  const status = searchParams.get("status") || undefined;
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

  const where: Prisma.BookingWhereInput = {};

  if (
    status &&
    [
      "PENDING",
      "CONFIRMED",
      "PAID",
      "COMPLETED",
      "CANCELLED_GUEST",
      "CANCELLED_HOST",
      "REFUNDED",
      "DISPUTED",
    ].includes(status)
  ) {
    where.status = status as Prisma.EnumBookingStatusFilter["equals"];
  }

  const [bookings, total] = await prisma.$transaction([
    prisma.booking.findMany({
      where,
      select: {
        id: true,
        date: true,
        guestCount: true,
        subtotal: true,
        serviceFee: true,
        status: true,
        createdAt: true,
        listing: {
          select: { id: true, title: true },
        },
        guest: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({
    bookings,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
