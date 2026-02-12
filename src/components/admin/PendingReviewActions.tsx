"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PendingReviewActions({ listingId }: { listingId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(newStatus: "PUBLISHED" | "DRAFT") {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${listingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        toast.error("Failed to update listing");
        return;
      }

      toast.success(
        newStatus === "PUBLISHED"
          ? "Listing approved and published!"
          : "Listing rejected"
      );
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin text-gray-400" />;
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction("PUBLISHED")}
        className="h-7 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg"
      >
        <CheckCircle2 className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleAction("DRAFT")}
        className="h-7 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
      >
        <XCircle className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
}
