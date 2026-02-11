"use client";

import Link from "next/link";
import Image from "next/image";
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
      <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          {listing.primaryPhoto ? (
            <Image
              src={listing.primaryPhoto}
              alt={listing.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-300">
              No photo
            </div>
          )}

          {/* Price badge */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3.5 py-2 shadow-lg">
            <span className="font-bold text-lg text-navy">
              ${price?.toFixed(0) || "0"}
            </span>
            <span className="text-sm text-gray-500">
              {listing.pricingType === "PER_PERSON" ? "/person" : " total"}
            </span>
          </div>
        </div>

        <div className="p-5">
          {/* Activity type badges */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {listing.activityTypes.slice(0, 2).map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="text-xs bg-ocean-light text-ocean rounded-full px-2.5"
              >
                {type}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base text-gray-900 line-clamp-1 mb-1.5">
            {listing.title}
          </h3>

          {/* Location */}
          <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <MapPin className="h-3.5 w-3.5" />
            {listing.locationName}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 text-sm text-gray-400">
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
              <span className="flex items-center gap-1 text-gray-600">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {listing.averageRating.toFixed(1)}
                <span className="text-xs text-gray-400">
                  ({listing.reviewCount})
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
