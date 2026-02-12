"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ListingImage } from "@/components/shared/ListingImage";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Star,
  CalendarDays,
  Clock,
  Users,
  ArrowLeft,
  Loader2,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface BookingDetail {
  id: string;
  date: string;
  endDate: string | null;
  startTime: string;
  endTime: string;
  guestCount: number;
  pricePerUnit: number;
  pricingType: string;
  subtotal: number;
  serviceFee: number;
  hostPayout: number;
  totalPrice: number;
  currency: string;
  status: string;
  messageToHost: string | null;
  guestId: string;
  listing: {
    id: string;
    title: string;
    hostId: string;
    photos: { id: string; url: string; altText: string | null; isPrimary: boolean }[];
    host: {
      id: string;
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
  guest: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    ratingAccuracy: number | null;
    ratingCommunication: number | null;
    ratingValue: number | null;
    ratingSafety: number | null;
    ratingCheckin: number | null;
    ratingCleanliness: number | null;
  } | null;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED_GUEST: "bg-red-100 text-red-800",
  CANCELLED_HOST: "bg-red-100 text-red-800",
  REFUNDED: "bg-purple-100 text-purple-800",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PAID: "Paid",
  COMPLETED: "Completed",
  CANCELLED_GUEST: "Cancelled by you",
  CANCELLED_HOST: "Cancelled by host",
  REFUNDED: "Refunded",
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [deleteReviewLoading, setDeleteReviewLoading] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      const res = await fetch(`/api/bookings/${params.id}`);
      if (res.ok) {
        setBooking(await res.json());
      }
      setLoading(false);
    }
    fetchBooking();
  }, [params.id]);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancelLoading(true);
    try {
      const res = await fetch(`/api/bookings/${booking!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED_GUEST" }),
      });

      if (res.ok) {
        toast.success("Booking cancelled");
        setBooking((prev) => prev ? { ...prev, status: "CANCELLED_GUEST" } : null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to cancel");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setCancelLoading(false);
  }

  async function handleDeleteReview() {
    if (!booking?.review) return;
    if (!confirm("Are you sure you want to delete your review?")) return;

    setDeleteReviewLoading(true);
    try {
      const res = await fetch(`/api/reviews/${booking.review.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Review deleted");
        setBooking((prev) => prev ? { ...prev, review: null } : null);
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete review");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setDeleteReviewLoading(false);
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Skeleton className="h-6 w-40 mb-6" />
        <Skeleton className="h-48 w-full rounded-2xl mb-6" />
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-navy mb-2">Booking not found</h1>
        <p className="text-gray-500 mb-6">This booking may have been removed.</p>
        <Link href="/bookings" className="text-ocean hover:underline">
          Back to My Bookings
        </Link>
      </div>
    );
  }

  const primaryPhoto = booking.listing.photos.find((p) => p.isPrimary) || booking.listing.photos[0];
  const isGuest = session?.user?.id === booking.guestId;
  const canReview = isGuest && ["COMPLETED", "PAID"].includes(booking.status);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* Back link */}
      <Link
        href="/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-navy mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Bookings
      </Link>

      {/* Header with photo + title */}
      <div className="flex gap-4 mb-6">
        {primaryPhoto && (
          <div className="relative w-28 h-20 rounded-xl overflow-hidden shrink-0">
            <ListingImage
              src={primaryPhoto.url}
              alt={primaryPhoto.altText || booking.listing.title}
              fill
              className="object-cover"
              sizes="112px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Link
            href={`/listings/${booking.listing.id}`}
            className="text-lg font-semibold text-navy hover:underline underline-offset-2 line-clamp-1"
          >
            {booking.listing.title}
          </Link>
          <p className="text-sm text-gray-500 mt-0.5">
            Hosted by {booking.listing.host.firstName} {booking.listing.host.lastName}
          </p>
          <Badge className={`mt-1.5 ${statusColors[booking.status] || ""}`}>
            {statusLabels[booking.status] || booking.status}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Booking details */}
      <div className="py-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Booking Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">{booking.endDate ? "Dates" : "Date"}</p>
              <p className="text-sm font-medium text-navy">
                {booking.endDate ? (
                  <>
                    {new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {" – "}
                    {new Date(booking.endDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                  </>
                ) : (
                  new Date(booking.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">
                {booking.endDate ? "Check-in / Check-out" : "Time"}
              </p>
              <p className="text-sm font-medium text-navy">
                {booking.endDate
                  ? `In: ${booking.startTime} / Out: ${booking.endTime}`
                  : `${booking.startTime} - ${booking.endTime}`
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Guests</p>
              <p className="text-sm font-medium text-navy">
                {booking.guestCount} guest{booking.guestCount !== 1 && "s"}
              </p>
            </div>
          </div>
        </div>

        {booking.messageToHost && (
          <div className="mt-4 p-3 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-500 mb-1">Message to host</p>
            <p className="text-sm text-gray-700">{booking.messageToHost}</p>
          </div>
        )}
      </div>

      <Separator />

      {/* Price breakdown */}
      <div className="py-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Price Breakdown</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">
              ${booking.pricePerUnit.toFixed(2)}{" "}
              {booking.pricingType === "PER_PERSON"
                ? `x ${booking.guestCount} guest${booking.guestCount > 1 ? "s" : ""}`
                : "flat rate"}
            </span>
            <span className="text-gray-700">${booking.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Service fee</span>
            <span className="text-gray-700">${booking.serviceFee.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-base">
            <span className="text-navy">Total</span>
            <span className="text-navy">${booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Review section */}
      <div className="py-6">
        <h2 className="text-lg font-semibold text-navy mb-4">Your Review</h2>

        {canReview && !booking.review && (
          <ReviewForm
            bookingId={booking.id}
            onSuccess={(review) =>
              setBooking((prev) =>
                prev ? { ...prev, review: review as BookingDetail["review"] } : null
              )
            }
          />
        )}

        {canReview && booking.review && (
          <div>
            {/* Display the review */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < booking.review!.rating
                        ? "fill-navy text-navy"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-500 ml-2">
                  {new Date(booking.review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              {booking.review.comment && (
                <p className="text-sm text-gray-700 leading-relaxed">
                  {booking.review.comment}
                </p>
              )}
            </div>

            {/* Delete button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteReview}
              disabled={deleteReviewLoading}
              className="mt-3 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              {deleteReviewLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              Delete Review
            </Button>
          </div>
        )}

        {!canReview && (
          <p className="text-sm text-gray-400">
            Reviews are available after your trip is completed.
          </p>
        )}
      </div>

      {/* Cancel action */}
      {isGuest && booking.status === "PENDING" && (
        <>
          <Separator />
          <div className="py-6">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={cancelLoading}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              {cancelLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Cancel Booking
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
