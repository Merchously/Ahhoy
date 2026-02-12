import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { photos } = await request.json();

  if (!Array.isArray(photos) || photos.length === 0) {
    return NextResponse.json({ error: "No photos provided" }, { status: 400 });
  }

  if (photos.length > 10) {
    return NextResponse.json({ error: "Maximum 10 photos allowed" }, { status: 400 });
  }

  const created = await prisma.listingPhoto.createMany({
    data: photos.map((p: { url: string; order: number; isPrimary: boolean }) => ({
      listingId: id,
      url: p.url,
      order: p.order ?? 0,
      isPrimary: p.isPrimary ?? false,
    })),
  });

  return NextResponse.json({ count: created.count }, { status: 201 });
}

export async function DELETE(
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
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { photoId } = await request.json();

  await prisma.listingPhoto.delete({
    where: { id: photoId, listingId: id },
  });

  return NextResponse.json({ success: true });
}
