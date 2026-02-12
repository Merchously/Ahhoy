import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatarUrl: true,
      bio: true,
      role: true,
      city: true,
      state: true,
      country: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const allowedFields = ["firstName", "lastName", "phone", "bio", "city", "state", "country", "avatarUrl"];
  const updates: Record<string, string | null> = {};
  for (const field of allowedFields) {
    if (field in body) {
      updates[field] = body[field] || null;
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: updates,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      phone: true,
      avatarUrl: true,
      bio: true,
      role: true,
      city: true,
      state: true,
      country: true,
    },
  });

  return NextResponse.json(user);
}
