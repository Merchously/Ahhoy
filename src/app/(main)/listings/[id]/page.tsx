"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { ListingImage } from "@/components/shared/ListingImage";
import { AvailabilityCalendar } from "@/components/listings/AvailabilityCalendar";
import { TimePicker } from "@/components/listings/TimePicker";
import { CaptainSection } from "@/components/listings/CaptainSection";
import { ReviewSection } from "@/components/reviews/ReviewSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Share2,
  Zap,
  Anchor,
  ChevronRight,
  Minus,
  Plus,
  Flag,
  Grid3x3,
  ChevronLeft,
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
  latitude: number;
  longitude: number;
  pricePerPerson: number | null;
  flatPrice: number | null;
  pricePerNight: number | null;
  pricingType: string;
  currency: string;
  isMultiDay: boolean;
  minGuests: number;
  maxGuests: number;
  durationMinutes: number;
  boatName: string | null;
  boatType: string | null;
  boatLength: number | null;
  boatYear: number | null;
  boatManufacturer: string | null;
  boatCapacity: number | null;
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
  availability: {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
  blockedDates: { id: string; date: string; reason: string | null }[];
  bookedDates: string[];
  host: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    languages: string[];
    isSuperCaptain: boolean;
    _count: {
      listings: number;
      reviewsReceived: number;
    };
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
  categoryAverages: {
    safety: number | null;
    accuracy: number | null;
    checkin: number | null;
    communication: number | null;
    cleanliness: number | null;
    value: number | null;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingEndDate, setBookingEndDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

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

  function handleDateRangeSelect(range: { from: Date | undefined; to: Date | undefined }) {
    setBookingDate(range.from);
    setBookingEndDate(range.to);
  }

  async function handleBook() {
    if (!session) {
      router.push("/login");
      return;
    }

    if (!bookingDate) {
      toast.error("Please select a date");
      return;
    }
    if (!startTime || !endTime) {
      toast.error("Please select start and end times");
      return;
    }
    if (listing!.isMultiDay && !bookingEndDate) {
      toast.error("Please select a check-out date");
      return;
    }

    setBookingLoading(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: listing!.id,
          date: format(bookingDate!, "yyyy-MM-dd"),
          endDate: bookingEndDate ? format(bookingEndDate, "yyyy-MM-dd") : undefined,
          startTime,
          endTime,
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

  async function handleShare() {
    const url = window.location.href;
    const title = listing?.title || "Water Experience on Ahhoy";
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled share
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="aspect-[2/1] w-full rounded-2xl mb-8" />
        <Skeleton className="h-8 w-2/3 mb-4 rounded-lg" />
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">
          <div className="space-y-4">
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
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

  // Calculate nights for multi-day bookings
  const nights =
    listing.isMultiDay && bookingDate && bookingEndDate
      ? Math.ceil(
          (bookingEndDate.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  let subtotal: number;
  if (listing.isMultiDay && nights > 0) {
    const nightlyTotal = (listing.pricePerNight || 0) * nights;
    subtotal =
      listing.pricingType === "PER_PERSON"
        ? nightlyTotal * guestCount
        : nightlyTotal;
  } else {
    subtotal =
      listing.pricingType === "PER_PERSON"
        ? (price || 0) * guestCount
        : price || 0;
  }

  const serviceFee = subtotal * 0.15;
  const total = subtotal + serviceFee;

  // Duration formatting
  const durationText =
    listing.durationMinutes >= 60
      ? `${Math.floor(listing.durationMinutes / 60)}h${listing.durationMinutes % 60 ? ` ${listing.durationMinutes % 60}m` : ""}`
      : `${listing.durationMinutes}m`;

  const hasLocation = listing.latitude && listing.longitude;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* ====== PHOTO GALLERY ====== */}
      {listing.photos.length > 0 ? (
        <div className="relative grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2 rounded-2xl overflow-hidden mb-8 h-[280px] md:h-[420px]">
          {/* Main large photo */}
          <div
            className="relative md:col-span-2 md:row-span-2 cursor-pointer"
            onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
          >
            <ListingImage
              src={listing.photos[0].url}
              alt={listing.photos[0].altText || listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          {/* 4 smaller photos */}
          {listing.photos.slice(1, 5).map((photo, i) => (
            <div
              key={photo.id}
              className="relative hidden md:block cursor-pointer"
              onClick={() => { setGalleryIndex(i + 1); setGalleryOpen(true); }}
            >
              <ListingImage
                src={photo.url}
                alt={photo.altText || listing.title}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
          {/* Show all photos button */}
          {listing.photos.length > 5 && (
            <button
              onClick={() => { setGalleryIndex(0); setGalleryOpen(true); }}
              className="absolute bottom-4 right-4 bg-white text-navy text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
            >
              <Grid3x3 className="h-4 w-4" />
              Show all photos
            </button>
          )}
        </div>
      ) : (
        <div className="aspect-[3/1] bg-gray-100 flex items-center justify-center rounded-2xl mb-8">
          <Ship className="h-16 w-16 text-gray-300" />
        </div>
      )}

      {/* Photo Gallery Modal */}
      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Photo gallery</DialogTitle>
          <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-4 border-b">
            <span className="text-sm text-gray-500">
              {galleryIndex + 1} / {listing.photos.length}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={galleryIndex <= 0}
                onClick={() => setGalleryIndex(galleryIndex - 1)}
                className="rounded-full h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={galleryIndex >= listing.photos.length - 1}
                onClick={() => setGalleryIndex(galleryIndex + 1)}
                className="rounded-full h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <ListingImage
                src={listing.photos[galleryIndex]?.url || ""}
                alt={listing.photos[galleryIndex]?.altText || listing.title}
                fill
                className="object-contain bg-gray-50"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ====== MAIN CONTENT GRID ====== */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16">
        {/* ====== LEFT COLUMN ====== */}
        <div>
          {/* Title & Meta */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-2xl md:text-3xl font-semibold text-navy">
              {listing.title}
            </h1>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-navy underline underline-offset-2 shrink-0 mt-1"
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {/* Rating + Location row */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            {listing.averageRating && (
              <>
                <Star className="h-4 w-4 fill-navy text-navy" />
                <span className="font-medium text-navy">
                  {listing.averageRating.toFixed(1)}
                </span>
                <span>·</span>
                <button
                  onClick={() => document.getElementById("reviews-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="underline underline-offset-2 hover:text-navy"
                >
                  {listing.reviewCount} review{listing.reviewCount !== 1 && "s"}
                </button>
                <span>·</span>
              </>
            )}
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {listing.locationName}
            </span>
          </div>

          {/* Activity type badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {listing.activityTypes.map((at) => (
              <Badge
                key={at.activityType.slug}
                variant="secondary"
                className="rounded-full bg-ocean/10 text-ocean px-3 py-1"
              >
                {at.activityType.label}
              </Badge>
            ))}
          </div>

          <Separator />

          {/* ====== HIGHLIGHTS ====== */}
          <div className="py-6 space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-navy">{durationText} trip</p>
                <p className="text-sm text-gray-500">
                  {listing.durationMinutes >= 480 ? "Full day on the water" : "Time includes boarding and docking"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-navy">Up to {listing.maxGuests} guests</p>
                <p className="text-sm text-gray-500">
                  {listing.maxGuests >= 10 ? "Great for large groups and events" : "Perfect for small groups and families"}
                </p>
              </div>
            </div>

            {listing.instantBook && (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Zap className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-navy">Instant booking</p>
                  <p className="text-sm text-gray-500">Confirm your spot immediately without waiting</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <Anchor className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-navy">
                  Hosted by {listing.host.firstName}
                </p>
                <p className="text-sm text-gray-500">
                  Captain since {new Date(listing.host.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* ====== DESCRIPTION ====== */}
          <div className="py-8">
            <h2 className="text-xl font-semibold text-navy mb-4">
              About this experience
            </h2>
            <div className="relative">
              <p
                className={`text-gray-600 whitespace-pre-line leading-relaxed ${
                  !showFullDescription ? "line-clamp-4" : ""
                }`}
              >
                {listing.description}
              </p>
              {listing.description.length > 300 && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 flex items-center gap-1 font-semibold text-navy hover:underline underline-offset-2 text-sm"
                >
                  {showFullDescription ? "Show less" : "Show more"}
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${showFullDescription ? "rotate-90" : ""}`}
                  />
                </button>
              )}
            </div>
          </div>

          <Separator />

          {/* ====== THE BOAT ====== */}
          {listing.boatName && (
            <>
              <div className="py-8">
                <h2 className="text-xl font-semibold text-navy mb-5 flex items-center gap-2">
                  <Ship className="h-5 w-5" />
                  About the Boat
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                  {listing.boatName && (
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-navy">{listing.boatName}</p>
                    </div>
                  )}
                  {listing.boatType && (
                    <div>
                      <p className="text-sm text-gray-500">Type</p>
                      <p className="font-medium text-navy">{listing.boatType}</p>
                    </div>
                  )}
                  {listing.boatYear && (
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium text-navy">{listing.boatYear}</p>
                    </div>
                  )}
                  {listing.boatManufacturer && (
                    <div>
                      <p className="text-sm text-gray-500">Manufacturer</p>
                      <p className="font-medium text-navy">{listing.boatManufacturer}</p>
                    </div>
                  )}
                  {listing.boatLength && (
                    <div>
                      <p className="text-sm text-gray-500">Length</p>
                      <p className="font-medium text-navy">{listing.boatLength} ft</p>
                    </div>
                  )}
                  {listing.boatCapacity && (
                    <div>
                      <p className="text-sm text-gray-500">Capacity</p>
                      <p className="font-medium text-navy">{listing.boatCapacity} passengers</p>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* ====== WHAT'S INCLUDED ====== */}
          {(listing.includedItems.length > 0 || listing.notIncludedItems.length > 0) && (
            <div className="py-8">
              <h2 className="text-xl font-semibold text-navy mb-5">
                What&apos;s included
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {listing.includedItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 py-3 border-b border-gray-100"
                  >
                    <Check className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
                {listing.notIncludedItems.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 py-3 border-b border-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-400 shrink-0" />
                    <span className="text-gray-500 line-through">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====== AVAILABILITY CALENDAR ====== */}
          <Separator />
          <div className="py-8">
            <h2 className="text-xl font-semibold text-navy mb-5 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability
            </h2>
            <AvailabilityCalendar
              availability={listing.availability}
              blockedDates={listing.blockedDates}
              bookedDates={listing.bookedDates}
              isMultiDay={listing.isMultiDay}
              selectedDate={listing.isMultiDay ? undefined : bookingDate}
              onDateSelect={listing.isMultiDay ? undefined : setBookingDate}
              selectedRange={listing.isMultiDay ? { from: bookingDate, to: bookingEndDate } : undefined}
              onRangeSelect={listing.isMultiDay ? handleDateRangeSelect : undefined}
              numberOfMonths={1}
            />
          </div>
        </div>

        {/* ====== RIGHT COLUMN: BOOKING WIDGET ====== */}
        <div className="order-first lg:order-last">
          <div className="sticky top-24 rounded-2xl border border-gray-200 shadow-lg p-6 bg-white">
            {/* Price */}
            <div className="flex items-baseline gap-1 mb-6">
              {listing.isMultiDay ? (
                <>
                  <span className="text-2xl font-semibold text-navy">
                    ${listing.pricePerNight?.toFixed(0) || "0"}
                  </span>
                  <span className="text-gray-500">/ night</span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-semibold text-navy">
                    ${price?.toFixed(0) || "0"}
                  </span>
                  <span className="text-gray-500">
                    {listing.pricingType === "PER_PERSON" ? "/ person" : " total"}
                  </span>
                </>
              )}
            </div>

            {/* Date, Time & Guests inputs */}
            <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
              {/* Date(s) */}
              <div className="p-3 border-b border-gray-300">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  {listing.isMultiDay ? "Check-in / Check-out" : "Date"}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-2 mt-1 w-full text-left">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className={`text-sm ${bookingDate ? "text-navy" : "text-gray-400"}`}>
                        {listing.isMultiDay
                          ? bookingDate && bookingEndDate
                            ? `${format(bookingDate, "MMM d")} – ${format(bookingEndDate, "MMM d, yyyy")}`
                            : bookingDate
                              ? `${format(bookingDate, "MMM d")} – Select end date`
                              : "Select dates"
                          : bookingDate
                            ? format(bookingDate, "MMM d, yyyy")
                            : "Select a date"
                        }
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <AvailabilityCalendar
                      availability={listing.availability}
                      blockedDates={listing.blockedDates}
                      bookedDates={listing.bookedDates}
                      isMultiDay={listing.isMultiDay}
                      selectedDate={listing.isMultiDay ? undefined : bookingDate}
                      onDateSelect={listing.isMultiDay ? undefined : setBookingDate}
                      selectedRange={listing.isMultiDay ? { from: bookingDate, to: bookingEndDate } : undefined}
                      onRangeSelect={listing.isMultiDay ? handleDateRangeSelect : undefined}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              <div className="p-3 border-b border-gray-300 grid grid-cols-2 gap-3">
                <TimePicker
                  label={listing.isMultiDay ? "Check-in Time" : "Start Time"}
                  value={startTime}
                  onChange={setStartTime}
                />
                <TimePicker
                  label={listing.isMultiDay ? "Check-out Time" : "End Time"}
                  value={endTime}
                  onChange={setEndTime}
                />
              </div>

              {/* Guests */}
              <div className="p-3">
                <Label htmlFor="guests" className="text-[10px] font-bold uppercase tracking-wider text-gray-600">
                  Guests
                </Label>
                <div className="flex items-center justify-between mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 border-gray-300"
                    disabled={guestCount <= listing.minGuests}
                    onClick={() => setGuestCount(Math.max(listing.minGuests, guestCount - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-navy">
                    {guestCount} guest{guestCount !== 1 && "s"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 rounded-full p-0 border-gray-300"
                    disabled={guestCount >= listing.maxGuests}
                    onClick={() => setGuestCount(Math.min(listing.maxGuests, guestCount + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Book button */}
            <Button
              className="w-full h-12 rounded-xl bg-ocean hover:bg-ocean-dark text-white text-base font-semibold mb-4"
              size="lg"
              onClick={handleBook}
              disabled={bookingLoading}
            >
              {bookingLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {listing.instantBook ? "Book Now" : "Request to Book"}
            </Button>

            <p className="text-xs text-center text-gray-400 mb-4">
              You won&apos;t be charged yet
            </p>

            {/* Price breakdown */}
            <div className="space-y-3 text-sm">
              {listing.isMultiDay && nights > 0 ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600 underline underline-offset-2 decoration-dotted">
                      ${listing.pricePerNight?.toFixed(2)} x {nights} night{nights !== 1 ? "s" : ""}
                    </span>
                    <span className="text-gray-700">
                      ${((listing.pricePerNight || 0) * nights).toFixed(2)}
                    </span>
                  </div>
                  {listing.pricingType === "PER_PERSON" && guestCount > 1 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 underline underline-offset-2 decoration-dotted">
                        x {guestCount} guest{guestCount > 1 ? "s" : ""}
                      </span>
                      <span className="text-gray-700">${subtotal.toFixed(2)}</span>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-600 underline underline-offset-2 decoration-dotted">
                    ${price?.toFixed(2)}{" "}
                    {listing.pricingType === "PER_PERSON"
                      ? `x ${guestCount} guest${guestCount > 1 ? "s" : ""}`
                      : "flat rate"}
                  </span>
                  <span className="text-gray-700">${subtotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 underline underline-offset-2 decoration-dotted">
                  Service fee
                </span>
                <span className="text-gray-700">${serviceFee.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span className="text-navy">Total</span>
                <span className="text-navy">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Cancellation + report */}
            <p className="text-xs text-center text-gray-400 mt-4">
              {listing.cancellationPolicy === "FLEXIBLE"
                ? "Free cancellation up to 24 hours before"
                : listing.cancellationPolicy === "MODERATE"
                  ? "Free cancellation up to 5 days before"
                  : "50% refund up to 7 days before"}
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-4">
              <Flag className="h-3.5 w-3.5 text-gray-400" />
              <button className="text-xs text-gray-400 underline underline-offset-2 hover:text-gray-600">
                Report this listing
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====== FULL-WIDTH SECTIONS (below the 2-col grid) ====== */}

      {/* ====== REVIEWS ====== */}
      {listing.reviews.length > 0 && (
        <>
          <Separator />
          <div className="py-10" id="reviews-section">
            <ReviewSection
              reviews={listing.reviews}
              averageRating={listing.averageRating}
              reviewCount={listing.reviewCount}
              categoryAverages={listing.categoryAverages}
            />
          </div>
        </>
      )}

      {/* ====== LOCATION MAP ====== */}
      {hasLocation && (
        <>
          <Separator />
          <div className="py-10">
            <h2 className="text-xl font-semibold text-navy mb-2">
              Where you&apos;ll be
            </h2>
            <p className="text-gray-500 mb-5">
              {listing.city}, {listing.state}
            </p>
            <div className="relative aspect-[2.5/1] rounded-2xl overflow-hidden bg-gray-100">
              <iframe
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${listing.longitude! - 0.05},${listing.latitude! - 0.03},${listing.longitude! + 0.05},${listing.latitude! + 0.03}&layer=mapnik&marker=${listing.latitude},${listing.longitude}`}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                title={`Map of ${listing.locationName}`}
              />
            </div>
          </div>
        </>
      )}

      {/* ====== MEET YOUR CAPTAIN ====== */}
      <Separator />
      <div className="py-10">
        <h2 className="text-xl font-semibold text-navy mb-5">
          Meet your Captain
        </h2>
        <CaptainSection host={listing.host} />
      </div>

      {/* ====== THINGS TO KNOW ====== */}
      <Separator />
      <div className="py-10">
        <h2 className="text-xl font-semibold text-navy mb-6">
          Things to know
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Requirements */}
          <div>
            <h3 className="font-semibold text-navy mb-3">Requirements</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {listing.requirements.length > 0 ? (
                listing.requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    {req}
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    Must be able to swim
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    Arrive 15 minutes before departure
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    Wear appropriate footwear
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Cancellation policy */}
          <div>
            <h3 className="font-semibold text-navy mb-3">Cancellation policy</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {listing.cancellationPolicy === "FLEXIBLE" ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    Free cancellation up to 24 hours before
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    Full refund if cancelled in time
                  </li>
                </>
              ) : listing.cancellationPolicy === "MODERATE" ? (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    Free cancellation up to 5 days before
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    50% refund within 5 days of trip
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    50% refund up to 7 days before
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-400 mt-0.5">·</span>
                    No refund within 7 days of trip
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Safety */}
          <div>
            <h3 className="font-semibold text-navy mb-3">Safety</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">·</span>
                Life jackets provided for all guests
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">·</span>
                Coast Guard safety equipment on board
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400 mt-0.5">·</span>
                Weather-dependent — may be rescheduled
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
