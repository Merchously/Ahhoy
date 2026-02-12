"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Shield, Star, Ship, Calendar, MessageCircle, ChevronRight, Globe } from "lucide-react";
import { toast } from "sonner";

interface CaptainSectionProps {
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
}

export function CaptainSection({ host }: CaptainSectionProps) {
  const [showFullBio, setShowFullBio] = useState(false);

  const yearsHosting = Math.max(
    1,
    new Date().getFullYear() - new Date(host.createdAt).getFullYear()
  );

  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      {/* Top: avatar + name + badge */}
      <div className="flex items-start gap-4 mb-6">
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src={host.avatarUrl || undefined} />
            <AvatarFallback className="bg-ocean/10 text-ocean font-semibold text-xl">
              {host.firstName[0]}
            </AvatarFallback>
          </Avatar>
          {host.isSuperCaptain && (
            <div className="absolute -bottom-1 -right-1 bg-ocean text-white rounded-full p-1">
              <Shield className="h-3.5 w-3.5" />
            </div>
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-navy">
              {host.firstName} {host.lastName}
            </h3>
            {host.isSuperCaptain && (
              <span className="text-xs font-semibold bg-ocean/10 text-ocean px-2 py-0.5 rounded-full">
                Super Captain
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">
            Captain since {new Date(host.createdAt).getFullYear()}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Star className="h-4 w-4 text-navy" />
            <span className="text-lg font-semibold text-navy">
              {host._count.reviewsReceived}
            </span>
          </div>
          <p className="text-xs text-gray-500">Reviews</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Calendar className="h-4 w-4 text-navy" />
            <span className="text-lg font-semibold text-navy">
              {yearsHosting}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Year{yearsHosting !== 1 && "s"} hosting
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Ship className="h-4 w-4 text-navy" />
            <span className="text-lg font-semibold text-navy">
              {host._count.listings}
            </span>
          </div>
          <p className="text-xs text-gray-500">
            Listing{host._count.listings !== 1 && "s"}
          </p>
        </div>
      </div>

      {/* Bio */}
      {host.bio && (
        <div className="mb-4">
          <p
            className={`text-gray-600 leading-relaxed text-sm ${
              !showFullBio ? "line-clamp-4" : ""
            }`}
          >
            {host.bio}
          </p>
          {host.bio.length > 200 && (
            <button
              onClick={() => setShowFullBio(!showFullBio)}
              className="mt-1.5 flex items-center gap-1 text-sm font-semibold text-navy hover:underline underline-offset-2"
            >
              {showFullBio ? "Show less" : "Show more"}
              <ChevronRight
                className={`h-4 w-4 transition-transform ${showFullBio ? "rotate-90" : ""}`}
              />
            </button>
          )}
        </div>
      )}

      {/* Languages */}
      {host.languages.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Globe className="h-4 w-4 text-gray-400" />
          <span>Languages: {host.languages.join(", ")}</span>
        </div>
      )}

      {/* Contact button */}
      <Button
        variant="outline"
        onClick={() => toast.info("Messaging coming soon!")}
        className="rounded-xl border-navy text-navy hover:bg-navy/5"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Contact Captain
      </Button>
    </div>
  );
}
