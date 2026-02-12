"use client";

import { useState } from "react";
import {
  Star,
  Shield,
  Sparkles,
  CircleCheck,
  KeyRound,
  MessageSquare,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./ReviewCard";
import { AllReviewsModal } from "./AllReviewsModal";

interface CategoryAverages {
  safety: number | null;
  accuracy: number | null;
  checkin: number | null;
  communication: number | null;
  cleanliness: number | null;
  value: number | null;
}

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

interface ReviewSectionProps {
  reviews: ReviewData[];
  averageRating: number | null;
  reviewCount: number;
  categoryAverages: CategoryAverages;
}

const CATEGORIES = [
  { key: "cleanliness" as const, label: "Cleanliness", icon: Sparkles },
  { key: "accuracy" as const, label: "Accuracy", icon: CircleCheck },
  { key: "checkin" as const, label: "Check-in", icon: KeyRound },
  { key: "communication" as const, label: "Communication", icon: MessageSquare },
  { key: "safety" as const, label: "Safety", icon: Shield },
  { key: "value" as const, label: "Value", icon: Tag },
];

export function ReviewSection({
  reviews,
  averageRating,
  reviewCount,
  categoryAverages,
}: ReviewSectionProps) {
  const [showAllModal, setShowAllModal] = useState(false);

  const displayedReviews = reviews.slice(0, 6);

  // Compute star distribution for overall rating breakdown
  const ratingCounts = [0, 0, 0, 0, 0]; // index 0 = 1-star, index 4 = 5-star
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) ratingCounts[r.rating - 1]++;
  });
  const maxCount = Math.max(...ratingCounts, 1);

  // Determine if this is a top-rated listing (avg >= 4.7 with 3+ reviews)
  const isGuestFavourite = averageRating != null && averageRating >= 4.7 && reviewCount >= 3;

  return (
    <>
      {/* ====== Hero Rating ====== */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex items-center gap-3 mb-2">
          {isGuestFavourite && (
            <span className="text-3xl" aria-hidden>🏆</span>
          )}
          <span className="text-6xl font-bold text-navy tracking-tight">
            {averageRating?.toFixed(2)}
          </span>
          {isGuestFavourite && (
            <span className="text-3xl" aria-hidden>🏆</span>
          )}
        </div>
        {isGuestFavourite ? (
          <>
            <p className="text-lg font-semibold text-navy mb-1">
              Guest favourite
            </p>
            <p className="text-sm text-gray-500 max-w-xs">
              This experience is in the top-rated based on ratings, reviews, and reliability
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">
            {reviewCount} review{reviewCount !== 1 && "s"}
          </p>
        )}
      </div>

      {/* ====== Category Columns ====== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-0 border border-gray-200 rounded-xl overflow-hidden mb-10">
        {/* Overall Rating column with bar chart */}
        <div className="p-4 border-b sm:border-b-0 sm:border-r border-gray-200 col-span-2 sm:col-span-1">
          <p className="text-xs font-medium text-gray-600 mb-2">Overall rating</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-500 w-2 text-right">{star}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-navy rounded-full"
                    style={{
                      width: `${(ratingCounts[star - 1] / maxCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category columns */}
        {CATEGORIES.map((cat) => {
          const val = categoryAverages[cat.key];
          const Icon = cat.icon;
          return (
            <div
              key={cat.key}
              className="p-4 border-b sm:border-b-0 sm:border-r border-gray-200 last:border-r-0 flex flex-col justify-between"
            >
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">{cat.label}</p>
                <p className="text-lg font-semibold text-navy">
                  {val != null ? val.toFixed(1) : "--"}
                </p>
              </div>
              <Icon className="h-5 w-5 text-gray-400 mt-2" />
            </div>
          );
        })}
      </div>

      {/* ====== Review Cards Grid ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {displayedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Show all button */}
      {reviews.length > 6 && (
        <Button
          variant="outline"
          onClick={() => setShowAllModal(true)}
          className="mt-8 rounded-xl border-navy text-navy hover:bg-navy/5"
        >
          Show all {reviewCount} reviews
        </Button>
      )}

      {/* All reviews modal */}
      <AllReviewsModal
        open={showAllModal}
        onOpenChange={setShowAllModal}
        reviews={reviews}
        averageRating={averageRating}
        reviewCount={reviewCount}
        categoryAverages={categoryAverages}
      />
    </>
  );
}
