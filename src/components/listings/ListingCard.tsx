"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users } from "lucide-react";
import type { ListingCardData } from "@/types";

export function ListingCard({ listing }: { listing: ListingCardData }) {
  const price =
    listing.pricingType === "PER_PERSON"
      ? listing.pricePerPerson
      : listing.flatPrice;

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-200">
          {listing.primaryPhoto ? (
            <Image
              src={listing.primaryPhoto}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No photo
            </div>
          )}

          {/* Price badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur rounded-lg px-3 py-1.5 shadow">
            <span className="font-bold text-lg">
              ${price?.toFixed(0) || "0"}
            </span>
            <span className="text-sm text-muted-foreground">
              {listing.pricingType === "PER_PERSON" ? "/person" : " total"}
            </span>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Activity type badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {listing.activityTypes.slice(0, 2).map((type) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base line-clamp-1 mb-1">
            {listing.title}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3.5 w-3.5" />
            {listing.locationName}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {listing.durationMinutes >= 60
                ? `${Math.floor(listing.durationMinutes / 60)}h${listing.durationMinutes % 60 ? ` ${listing.durationMinutes % 60}m` : ""}`
                : `${listing.durationMinutes}m`}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Up to {listing.maxGuests}
            </span>
            {listing.averageRating && (
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {listing.averageRating.toFixed(1)}
                <span className="text-xs">({listing.reviewCount})</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
