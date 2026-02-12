"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Star, Search } from "lucide-react";
import { RatingCategoryBar } from "./RatingCategoryBar";
import { ReviewCard } from "./ReviewCard";

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

interface AllReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviews: ReviewData[];
  averageRating: number | null;
  reviewCount: number;
  categoryAverages: CategoryAverages;
}

export function AllReviewsModal({
  open,
  onOpenChange,
  reviews,
  averageRating,
  reviewCount,
  categoryAverages,
}: AllReviewsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = useMemo(() => {
    if (!searchTerm.trim()) return reviews;
    const term = searchTerm.toLowerCase();
    return reviews.filter(
      (r) =>
        r.comment?.toLowerCase().includes(term) ||
        r.author.firstName.toLowerCase().includes(term) ||
        r.author.lastName.toLowerCase().includes(term)
    );
  }, [reviews, searchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Star className="h-5 w-5 fill-navy text-navy" />
            {averageRating?.toFixed(1)} · {reviewCount} review
            {reviewCount !== 1 && "s"}
          </DialogTitle>
        </DialogHeader>

        {/* Category ratings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3 py-4 border-b border-gray-100">
          <RatingCategoryBar label="Safety" value={categoryAverages.safety} />
          <RatingCategoryBar label="Accuracy" value={categoryAverages.accuracy} />
          <RatingCategoryBar label="Check-in" value={categoryAverages.checkin} />
          <RatingCategoryBar label="Communication" value={categoryAverages.communication} />
          <RatingCategoryBar label="Cleanliness" value={categoryAverages.cleanliness} />
          <RatingCategoryBar label="Value" value={categoryAverages.value} />
        </div>

        {/* Search */}
        <div className="relative py-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 rounded-full border-gray-200"
          />
        </div>

        {/* Reviews list */}
        <div className="space-y-6 pt-2">
          {filteredReviews.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">
              {searchTerm ? "No reviews match your search" : "No reviews yet"}
            </p>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="pb-6 border-b border-gray-100 last:border-0">
                <ReviewCard review={review} />
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
