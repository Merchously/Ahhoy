"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    author: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isLong = (review.comment?.length ?? 0) > 200;

  const timeAgo = getTimeAgo(new Date(review.createdAt));

  return (
    <div>
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={review.author.avatarUrl || undefined} />
          <AvatarFallback className="bg-gray-200 text-gray-600 text-sm font-medium">
            {review.author.firstName[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-navy">
            {review.author.firstName} {review.author.lastName}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Star dots + time ago */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < review.rating ? "fill-navy text-navy" : "text-gray-200"
              }`}
            />
          ))}
        </div>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-500">{timeAgo}</span>
      </div>

      {/* Comment */}
      {review.comment && (
        <>
          <p
            className={`text-sm text-gray-600 leading-relaxed ${
              !expanded ? "line-clamp-4" : ""
            }`}
          >
            {review.comment}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 text-sm font-semibold text-navy underline underline-offset-2 hover:text-navy/80"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "1 week ago";
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 60) return "1 month ago";
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? "s" : ""} ago`;
}
