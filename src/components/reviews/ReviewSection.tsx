"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RatingCategoryBar } from "./RatingCategoryBar";
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

export function ReviewSection({
  reviews,
  averageRating,
  reviewCount,
  categoryAverages,
}: ReviewSectionProps) {
  const [showAllModal, setShowAllModal] = useState(false);

  const displayedReviews = reviews.slice(0, 6);

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-6 w-6 fill-navy text-navy" />
        <span className="text-2xl font-semibold text-navy">
          {averageRating?.toFixed(1)}
        </span>
        <span className="text-2xl text-navy">·</span>
        <span className="text-2xl font-semibold text-navy">
          {reviewCount} review{reviewCount !== 1 && "s"}
        </span>
      </div>

      {/* Category rating bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 mb-8">
        <RatingCategoryBar label="Safety" value={categoryAverages.safety} />
        <RatingCategoryBar label="Accuracy" value={categoryAverages.accuracy} />
        <RatingCategoryBar label="Check-in" value={categoryAverages.checkin} />
        <RatingCategoryBar label="Communication" value={categoryAverages.communication} />
        <RatingCategoryBar label="Cleanliness" value={categoryAverages.cleanliness} />
        <RatingCategoryBar label="Value" value={categoryAverages.value} />
      </div>

      {/* Review cards grid */}
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
