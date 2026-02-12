import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createListingSchema } from "@/lib/validations/listing";
import { Prisma } from "@/generated/prisma";

function getDayOfWeek(dateStr: string) {
  const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  return days[new Date(dateStr).getDay()];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") || undefined;
  const activityType = searchParams.get("activityType")?.split(",").filter(Boolean);
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const lat = searchParams.get("lat") ? Number(searchParams.get("lat")) : undefined;
  const lng = searchParams.get("lng") ? Number(searchParams.get("lng")) : undefined;
  const radius = searchParams.get("radius") ? Number(searchParams.get("radius")) : 25;
  const date = searchParams.get("date") || undefined;
  const guests = searchParams.get("guests") ? Number(searchParams.get("guests")) : undefined;
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit")) || 20));

  const where: Prisma.ListingWhereInput = {
    status: "PUBLISHED",
  };

  // Text search
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { locationName: { contains: q, mode: "insensitive" } },
      { city: { contains: q, mode: "insensitive" } },
    ];
  }

  // Activity type filter
  if (activityType?.length) {
    where.activityTypes = {
      some: {
        activityType: {
          slug: { in: activityType },
        },
      },
    };
  }

  // Price range
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.OR = [
      ...(where.OR ? (where.OR as Prisma.ListingWhereInput[]) : []),
    ];
    const priceFilter: Prisma.DecimalNullableFilter = {};
    if (minPrice !== undefined) priceFilter.gte = minPrice;
    if (maxPrice !== undefined) priceFilter.lte = maxPrice;
    where.pricePerPerson = priceFilter;
  }

  // Guest capacity
  if (guests) {
    where.maxGuests = { gte: guests };
  }

  // Geo bounding box
  if (lat && lng) {
    const radiusInDeg = radius / 69;
    where.latitude = { gte: lat - radiusInDeg, lte: lat + radiusInDeg };
    where.longitude = { gte: lng - radiusInDeg, lte: lng + radiusInDeg };
  }

  // Date availability
  if (date) {
    where.blockedDates = { none: { date: new Date(date) } };
    where.availability = {
      some: { dayOfWeek: getDayOfWeek(date) as Prisma.EnumDayOfWeekFilter["equals"] },
    };
  }

  // Sort
  let orderBy: Prisma.ListingOrderByWithRelationInput;
  switch (sort) {
    case "price_asc":
      orderBy = { pricePerPerson: "asc" };
      break;
    case "price_desc":
      orderBy = { pricePerPerson: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
  }

  const [listings, total] = await prisma.$transaction([
    prisma.listing.findMany({
      where,
      include: {
        photos: { where: { isPrimary: true }, take: 1 },
        activityTypes: { include: { activityType: true } },
        host: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
        reviews: { select: { rating: true } },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  const results = listings.map((l) => ({
    id: l.id,
    title: l.title,
    slug: l.slug,
    locationName: l.locationName,
    pricePerPerson: l.pricePerPerson ? Number(l.pricePerPerson) : null,
    flatPrice: l.flatPrice ? Number(l.flatPrice) : null,
    pricingType: l.pricingType,
    currency: l.currency,
    maxGuests: l.maxGuests,
    durationMinutes: l.durationMinutes,
    primaryPhoto: l.photos[0]?.url || null,
    activityTypes: l.activityTypes.map((at) => at.activityType.label),
    averageRating:
      l.reviews.length > 0
        ? l.reviews.reduce((sum, r) => sum + r.rating, 0) / l.reviews.length
        : null,
    reviewCount: l.reviews.length,
    host: {
      id: l.host.id,
      firstName: l.host.firstName,
      avatarUrl: l.host.avatarUrl,
    },
  }));

  return NextResponse.json({
    results,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "HOST") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = createListingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Generate slug from title
    const baseSlug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Resolve activity type slugs to actual database IDs
    const activityTypes = await prisma.activityType.findMany({
      where: { slug: { in: data.activityTypeIds } },
      select: { id: true },
    });

    const listing = await prisma.listing.create({
      data: {
        hostId: session.user.id,
        title: data.title,
        description: data.description,
        slug,
        pricingType: data.pricingType,
        pricePerPerson: data.pricingType === "PER_PERSON" ? data.pricePerPerson : null,
        flatPrice: data.pricingType === "FLAT_RATE" ? data.flatPrice : null,
        currency: data.currency,
        minGuests: data.minGuests,
        maxGuests: data.maxGuests,
        durationMinutes: data.durationMinutes,
        locationName: data.locationName,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        latitude: data.latitude,
        longitude: data.longitude,
        boatName: data.boatName,
        boatType: data.boatType,
        boatLength: data.boatLength,
        boatCapacity: data.boatCapacity,
        boatYear: data.boatYear,
        boatManufacturer: data.boatManufacturer,
        includedItems: data.includedItems,
        notIncludedItems: data.notIncludedItems,
        requirements: data.requirements,
        cancellationPolicy: data.cancellationPolicy,
        instantBook: data.instantBook,
        activityTypes: {
          create: activityTypes.map((at) => ({
            activityTypeId: at.id,
          })),
        },
        status: "DRAFT",
      },
      include: {
        activityTypes: { include: { activityType: true } },
        photos: true,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
