"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ReviewCardProps {
  review: {
    id: string;
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

  return (
    <div>
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
