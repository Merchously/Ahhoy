"use client";

import { useState } from "react";
import { Star, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface ReviewFormProps {
  bookingId: string;
  onSuccess: (review: Record<string, unknown>) => void;
}

function StarRating({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  size?: "sm" | "md";
}) {
  const [hover, setHover] = useState(0);
  const iconSize = size === "sm" ? "h-5 w-5" : "h-7 w-7";

  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onClick={() => onChange(star)}
          className="focus:outline-none transition-transform hover:scale-110"
        >
          <Star
            className={`${iconSize} transition-colors ${
              star <= (hover || value)
                ? "fill-navy text-navy"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

const CATEGORIES = [
  { key: "ratingSafety", label: "Safety" },
  { key: "ratingAccuracy", label: "Accuracy" },
  { key: "ratingCheckin", label: "Check-in" },
  { key: "ratingCommunication", label: "Communication" },
  { key: "ratingCleanliness", label: "Cleanliness" },
  { key: "ratingValue", label: "Value" },
] as const;

export function ReviewForm({ bookingId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);

  function setCategoryRating(key: string, value: number) {
    setCategoryRatings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select an overall rating");
      return;
    }

    setSubmitting(true);

    try {
      const body: Record<string, unknown> = {
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      };

      // Only include category ratings that were set
      for (const cat of CATEGORIES) {
        if (categoryRatings[cat.key]) {
          body[cat.key] = categoryRatings[cat.key];
        }
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to submit review");
        setSubmitting(false);
        return;
      }

      toast.success("Review submitted!");
      onSuccess(data);
    } catch {
      toast.error("Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Overall Rating */}
      <div>
        <label className="text-sm font-medium text-navy block mb-2">
          Overall Rating
        </label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Category Ratings (collapsible) */}
      <div>
        <button
          type="button"
          onClick={() => setShowCategories(!showCategories)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-navy transition-colors"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${showCategories ? "rotate-180" : ""}`}
          />
          Rate categories (optional)
        </button>

        {showCategories && (
          <div className="mt-3 space-y-3 pl-1">
            {CATEGORIES.map((cat) => (
              <div key={cat.key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-32">{cat.label}</span>
                <StarRating
                  value={categoryRatings[cat.key] || 0}
                  onChange={(v) => setCategoryRating(cat.key, v)}
                  size="sm"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comment */}
      <div>
        <label className="text-sm font-medium text-navy block mb-2">
          Your Review (optional)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          maxLength={2000}
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">
          {comment.length}/2000
        </p>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={rating === 0 || submitting}
        className="bg-ocean hover:bg-ocean-dark text-white rounded-xl"
      >
        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Review
      </Button>
    </div>
  );
}
