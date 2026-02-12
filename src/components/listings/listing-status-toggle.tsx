"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  MoreVertical,
  Send,
  Pause,
  Trash2,
  Loader2,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ListingStatusToggleProps {
  listingId: string;
  currentStatus: string;
}

export function ListingStatusToggle({
  listingId,
  currentStatus,
}: ListingStatusToggleProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }

      toast.success(
        newStatus === "PENDING_REVIEW"
          ? "Submitted for review!"
          : newStatus === "PAUSED"
            ? "Listing paused"
            : "Listing archived"
      );
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-lg" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <MoreVertical className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl">
        <DropdownMenuItem asChild className="rounded-lg">
          <Link href={`/listings/${listingId}`}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-lg">
          <Link href={`/dashboard/listings/${listingId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </DropdownMenuItem>

        {currentStatus === "DRAFT" && (
          <DropdownMenuItem
            className="rounded-lg text-ocean"
            onClick={() => updateStatus("PENDING_REVIEW")}
          >
            <Send className="mr-2 h-4 w-4" />
            Submit for Review
          </DropdownMenuItem>
        )}

        {currentStatus === "PENDING_REVIEW" && (
          <DropdownMenuItem disabled className="rounded-lg text-blue-500">
            <Clock className="mr-2 h-4 w-4" />
            Under Review
          </DropdownMenuItem>
        )}

        {currentStatus === "PUBLISHED" && (
          <DropdownMenuItem
            className="rounded-lg text-amber-600"
            onClick={() => updateStatus("PAUSED")}
          >
            <Pause className="mr-2 h-4 w-4" />
            Pause
          </DropdownMenuItem>
        )}

        {currentStatus === "PAUSED" && (
          <DropdownMenuItem
            className="rounded-lg text-ocean"
            onClick={() => updateStatus("PENDING_REVIEW")}
          >
            <Send className="mr-2 h-4 w-4" />
            Resubmit for Review
          </DropdownMenuItem>
        )}

        {currentStatus !== "ARCHIVED" && currentStatus !== "PENDING_REVIEW" && (
          <DropdownMenuItem
            className="rounded-lg text-red-600"
            onClick={() => updateStatus("ARCHIVED")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
