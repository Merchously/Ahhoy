"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star,
  MapPin,
  Clock,
  Users,
  Check,
  X,
  Ship,
  Calendar,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ListingDetail {
  id: string;
  title: string;
  description: string;
  locationName: string;
  city: string;
  state: string;
  pricePerPerson: number | null;
  flatPrice: number | null;
  pricingType: string;
  currency: string;
  minGuests: number;
  maxGuests: number;
  durationMinutes: number;
  boatName: string | null;
  boatType: string | null;
  boatLength: number | null;
  boatYear: number | null;
  boatManufacturer: string | null;
  includedItems: string[];
  notIncludedItems: string[];
  requirements: string[];
  cancellationPolicy: string;
  instantBook: boolean;
  photos: {
    id: string;
    url: string;
    altText: string | null;
    isPrimary: boolean;
  }[];
  activityTypes: { activityType: { label: string; slug: string } }[];
  host: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
  };
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    author: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  }[];
  averageRating: number | null;
  reviewCount: number;
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    async function fetchListing() {
      const res = await fetch(`/api/listings/${params.id}`);
      if (res.ok) {
        setListing(await res.json());
      }
      setLoading(false);
    }
    fetchListing();
  }, [params.id]);

  async function handleBook() {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!bookingDate) {
      toast.error("Please select a date");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing!.id,
          date: bookingDate,
          startTime: "10:00",
          endTime: `${Math.floor(10 + listing!.durationMinutes / 60)}:${String(listing!.durationMinutes % 60).padStart(2, "0")}`,
          guestCount,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to create booking");
        setBookingLoading(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/bookings/${data.booking.id}`);
      }
    } catch {
      toast.error("Something went wrong");
      setBookingLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-2/3 mb-4 rounded-lg" />
        <Skeleton className="aspect-[2/1] w-full rounded-2xl mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <Ship className="h-10 w-10 text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">
          Listing not found
        </h1>
        <p className="text-gray-500">
          This experience may have been removed.
        </p>
      </div>
    );
  }

  const price =
    listing.pricingType === "PER_PERSON"
      ? listing.pricePerPerson
      : listing.flatPrice;
  const subtotal =
    listing.pricingType === "PER_PERSON"
      ? (price || 0) * guestCount
      : price || 0;
  const serviceFee = subtotal * 0.15;
  const total = subtotal + serviceFee;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2">
        {listing.title}
      </h1>
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        {listing.averageRating && (
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {listing.averageRating.toFixed(1)} ({listing.reviewCount} reviews)
          </span>
        )}
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {listing.locationName}
        </span>
      </div>

      {/* Photo gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl overflow-hidden mb-8">
        {listing.photos.length > 0 ? (
          <>
            <div className="relative aspect-[4/3]">
              <Image
                src={listing.photos[0].url}
                alt={listing.photos[0].altText || listing.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {listing.photos.slice(1, 5).map((photo) => (
                <div key={photo.id} className="relative aspect-[4/3]">
                  <Image
                    src={photo.url}
                    alt={photo.altText || listing.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="col-span-2 aspect-[3/1] bg-gray-100 flex items-center justify-center rounded-2xl">
            <Ship className="h-16 w-16 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content + Booking widget */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Details */}
        <div className="md:col-span-2 space-y-8">
          {/* Activity types */}
          <div className="flex flex-wrap gap-2">
            {listing.activityTypes.map((at) => (
              <Badge
                key={at.activityType.slug}
                variant="secondary"
                className="rounded-full bg-ocean-light text-ocean px-3"
              >
                {at.activityType.label}
              </Badge>
            ))}
          </div>

          {/* Host info */}
          <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl">
            <Avatar className="h-14 w-14">
              <AvatarImage src={listing.host.avatarUrl || undefined} />
              <AvatarFallback className="bg-ocean-light text-ocean font-semibold text-lg">
                {listing.host.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-navy">
                Hosted by {listing.host.firstName} {listing.host.lastName}
              </p>
              <p className="text-sm text-gray-500">
                Member since{" "}
                {new Date(listing.host.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          {/* Quick facts */}
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-ocean" />
              </div>
              <span className="text-gray-700">
                {listing.durationMinutes >= 60
                  ? `${Math.floor(listing.durationMinutes / 60)}h${listing.durationMinutes % 60 ? ` ${listing.durationMinutes % 60}m` : ""}`
                  : `${listing.durationMinutes}m`}
              </span>
            </span>
            <span className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-ocean" />
              </div>
              <span className="text-gray-700">
                {listing.minGuests}-{listing.maxGuests} guests
              </span>
            </span>
            {listing.boatType && (
              <span className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center">
                  <Ship className="h-5 w-5 text-ocean" />
                </div>
                <span className="text-gray-700">
                  {listing.boatType}
                  {listing.boatLength && ` (${listing.boatLength}ft)`}
                </span>
              </span>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold text-navy mb-3">
              About this experience
            </h2>
            <p className="text-gray-500 whitespace-pre-line leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Boat details */}
          {listing.boatName && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold text-navy mb-4">
                  The Boat
                </h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {listing.boatName && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Name:</span>
                      <span className="text-gray-700">{listing.boatName}</span>
                    </div>
                  )}
                  {listing.boatType && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-gray-700">{listing.boatType}</span>
                    </div>
                  )}
                  {listing.boatYear && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Year:</span>
                      <span className="text-gray-700">{listing.boatYear}</span>
                    </div>
                  )}
                  {listing.boatManufacturer && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Make:</span>
                      <span className="text-gray-700">
                        {listing.boatManufacturer}
                      </span>
                    </div>
                  )}
                  {listing.boatLength && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">Length:</span>
                      <span className="text-gray-700">
                        {listing.boatLength} ft
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* What's included */}
          {(listing.includedItems.length > 0 ||
            listing.notIncludedItems.length > 0) && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold text-navy mb-4">
                  What&apos;s included
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {listing.includedItems.length > 0 && (
                    <div>
                      {listing.includedItems.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2.5 mb-2.5 text-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {listing.notIncludedItems.length > 0 && (
                    <div>
                      {listing.notIncludedItems.map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-2.5 mb-2.5 text-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <X className="h-3.5 w-3.5 text-red-500" />
                          </div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Reviews */}
          {listing.reviews.length > 0 && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold text-navy mb-5">
                  Reviews ({listing.reviewCount})
                </h2>
                <div className="space-y-4">
                  {listing.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-50 rounded-xl p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={review.author.avatarUrl || undefined}
                          />
                          <AvatarFallback className="bg-ocean-light text-ocean text-sm">
                            {review.author.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {review.author.firstName} {review.author.lastName}
                          </p>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Booking widget */}
        <div>
          <Card className="sticky top-24 rounded-2xl shadow-lg border-gray-100">
            <CardHeader>
              <CardTitle className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-navy">
                  ${price?.toFixed(0) || "0"}
                </span>
                <span className="text-sm font-normal text-gray-500">
                  {listing.pricingType === "PER_PERSON"
                    ? "/ person"
                    : " total"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date" className="text-gray-700">
                  Date
                </Label>
                <div className="relative mt-1.5">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10 h-12 rounded-xl"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guests" className="text-gray-700">
                  Guests
                </Label>
                <Input
                  id="guests"
                  type="number"
                  min={listing.minGuests}
                  max={listing.maxGuests}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="h-12 rounded-xl mt-1.5"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  {listing.minGuests}-{listing.maxGuests} guests allowed
                </p>
              </div>

              <Separator />

              {/* Price breakdown */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    ${price?.toFixed(2)}{" "}
                    {listing.pricingType === "PER_PERSON"
                      ? `x ${guestCount} guest${guestCount > 1 ? "s" : ""}`
                      : "flat rate"}
                  </span>
                  <span className="text-gray-700">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service fee</span>
                  <span className="text-gray-700">
                    ${serviceFee.toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span className="text-navy">Total</span>
                  <span className="text-navy">${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full h-12 rounded-xl bg-ocean hover:bg-ocean-dark text-white text-base font-semibold"
                size="lg"
                onClick={handleBook}
                disabled={bookingLoading}
              >
                {bookingLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {listing.instantBook ? "Book Now" : "Request to Book"}
              </Button>

              <p className="text-xs text-center text-gray-400">
                {listing.cancellationPolicy === "FLEXIBLE"
                  ? "Free cancellation up to 24 hours before"
                  : listing.cancellationPolicy === "MODERATE"
                    ? "Free cancellation up to 5 days before"
                    : "50% refund up to 7 days before"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
