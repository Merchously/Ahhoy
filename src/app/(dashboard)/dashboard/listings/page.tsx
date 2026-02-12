import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ListingStatusToggle } from "@/components/listings/listing-status-toggle";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Listings",
};

const statusStyles: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PENDING_REVIEW: "bg-blue-100 text-blue-700",
  PUBLISHED: "bg-green-100 text-green-700",
  PAUSED: "bg-amber-100 text-amber-700",
  ARCHIVED: "bg-red-100 text-red-700",
};

export default async function ListingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const listings = await prisma.listing.findMany({
    where: {
      hostId: session.user.id,
      status: { not: "ARCHIVED" },
    },
    include: {
      photos: { where: { isPrimary: true }, take: 1 },
      _count: { select: { bookings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-navy">My Listings</h1>
        <Button
          asChild
          className="rounded-xl bg-ocean hover:bg-ocean-dark text-white"
        >
          <Link href="/dashboard/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>

      {listings.length === 0 ? (
        <Card className="rounded-2xl shadow-sm border-gray-100 bg-white">
          <CardContent className="text-center py-16">
            <p className="text-gray-500 mb-4">
              You haven&apos;t created any listings yet.
            </p>
            <Button
              asChild
              className="rounded-xl bg-ocean hover:bg-ocean-dark text-white"
            >
              <Link href="/dashboard/listings/new">
                Create Your First Listing
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="rounded-xl shadow-sm border-gray-100 bg-white hover:shadow-md transition-shadow"
            >
              <CardContent className="flex items-center gap-4 p-5">
                {listing.photos[0]?.url && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={listing.photos[0].url}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h3 className="font-semibold text-gray-900">
                      {listing.title}
                    </h3>
                    <Badge
                      className={`rounded-full text-xs ${statusStyles[listing.status]}`}
                    >
                      {listing.status === "PENDING_REVIEW" ? "Under Review" : listing.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {listing.locationName} &middot; {listing._count.bookings}{" "}
                    booking(s)
                  </p>
                </div>

                <ListingStatusToggle
                  listingId={listing.id}
                  currentStatus={listing.status}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
