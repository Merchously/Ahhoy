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
  photos: { id: string; url: string; altText: string | null; isPrimary: boolean }[];
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
    author: { firstName: string; lastName: string; avatarUrl: string | null };
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
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="aspect-[2/1] w-full rounded-xl mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Listing not found</h1>
        <p className="text-muted-foreground">This experience may have been removed.</p>
      </div>
    );
  }

  const price = listing.pricingType === "PER_PERSON" ? listing.pricePerPerson : listing.flatPrice;
  const subtotal = listing.pricingType === "PER_PERSON" ? (price || 0) * guestCount : price || 0;
  const serviceFee = subtotal * 0.15;
  const total = subtotal + serviceFee;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{listing.title}</h1>
      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
        {listing.averageRating && (
          <span className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            {listing.averageRating.toFixed(1)} ({listing.reviewCount} reviews)
          </span>
        )}
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {listing.locationName}
        </span>
      </div>

      {/* Photo gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden mb-8">
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
            <div className="grid grid-cols-2 gap-2">
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
          <div className="col-span-2 aspect-[3/1] bg-gray-200 flex items-center justify-center rounded-xl">
            <Ship className="h-16 w-16 text-muted-foreground" />
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
              <Badge key={at.activityType.slug} variant="secondary">
                {at.activityType.label}
              </Badge>
            ))}
          </div>

          {/* Host info */}
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={listing.host.avatarUrl || undefined} />
              <AvatarFallback>{listing.host.firstName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">
                Hosted by {listing.host.firstName} {listing.host.lastName}
              </p>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(listing.host.createdAt).getFullYear()}
              </p>
            </div>
          </div>

          {/* Quick facts */}
          <div className="flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              {listing.durationMinutes >= 60
                ? `${Math.floor(listing.durationMinutes / 60)}h${listing.durationMinutes % 60 ? ` ${listing.durationMinutes % 60}m` : ""}`
                : `${listing.durationMinutes}m`}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              {listing.minGuests}-{listing.maxGuests} guests
            </span>
            {listing.boatType && (
              <span className="flex items-center gap-2">
                <Ship className="h-5 w-5 text-blue-600" />
                {listing.boatType}
                {listing.boatLength && ` (${listing.boatLength}ft)`}
              </span>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">About this experience</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Boat details */}
          {listing.boatName && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-3">The Boat</h2>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {listing.boatName && (
                    <div>
                      <span className="text-muted-foreground">Name:</span>{" "}
                      {listing.boatName}
                    </div>
                  )}
                  {listing.boatType && (
                    <div>
                      <span className="text-muted-foreground">Type:</span>{" "}
                      {listing.boatType}
                    </div>
                  )}
                  {listing.boatYear && (
                    <div>
                      <span className="text-muted-foreground">Year:</span>{" "}
                      {listing.boatYear}
                    </div>
                  )}
                  {listing.boatManufacturer && (
                    <div>
                      <span className="text-muted-foreground">Make:</span>{" "}
                      {listing.boatManufacturer}
                    </div>
                  )}
                  {listing.boatLength && (
                    <div>
                      <span className="text-muted-foreground">Length:</span>{" "}
                      {listing.boatLength} ft
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* What's included */}
          {(listing.includedItems.length > 0 || listing.notIncludedItems.length > 0) && (
            <>
              <Separator />
              <div>
                <h2 className="text-xl font-semibold mb-3">What&apos;s included</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {listing.includedItems.length > 0 && (
                    <div>
                      {listing.includedItems.map((item) => (
                        <div key={item} className="flex items-center gap-2 mb-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                  {listing.notIncludedItems.length > 0 && (
                    <div>
                      {listing.notIncludedItems.map((item) => (
                        <div key={item} className="flex items-center gap-2 mb-2 text-sm">
                          <X className="h-4 w-4 text-red-500" />
                          {item}
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
                <h2 className="text-xl font-semibold mb-4">
                  Reviews ({listing.reviewCount})
                </h2>
                <div className="space-y-4">
                  {listing.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={review.author.avatarUrl || undefined} />
                            <AvatarFallback>
                              {review.author.firstName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {review.author.firstName} {review.author.lastName}
                            </p>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground">
                            {review.comment}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Booking widget */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-baseline gap-1">
                <span className="text-2xl">${price?.toFixed(0) || "0"}</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {listing.pricingType === "PER_PERSON" ? "/ person" : " total"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="date"
                    type="date"
                    className="pl-10"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="guests">Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min={listing.minGuests}
                  max={listing.maxGuests}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {listing.minGuests}-{listing.maxGuests} guests allowed
                </p>
              </div>

              <Separator />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>
                    ${price?.toFixed(2)}{" "}
                    {listing.pricingType === "PER_PERSON"
                      ? `x ${guestCount} guest${guestCount > 1 ? "s" : ""}`
                      : "flat rate"}
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleBook}
                disabled={bookingLoading}
              >
                {bookingLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {listing.instantBook ? "Book Now" : "Request to Book"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
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
