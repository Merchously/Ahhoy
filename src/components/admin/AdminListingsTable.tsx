"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

type Listing = {
  id: string;
  title: string;
  slug: string;
  status: string;
  locationName: string;
  createdAt: string;
  host: { id: string; firstName: string; lastName: string; email: string };
  _count: { bookings: number };
};

const STATUSES = ["ALL", "PENDING_REVIEW", "DRAFT", "PUBLISHED", "PAUSED", "ARCHIVED"] as const;

const statusBadgeClass: Record<string, string> = {
  DRAFT: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PENDING_REVIEW: "bg-blue-50 text-blue-700 border-blue-200",
  PUBLISHED: "bg-green-50 text-green-700 border-green-200",
  PAUSED: "bg-orange-50 text-orange-700 border-orange-200",
  ARCHIVED: "bg-gray-100 text-gray-500 border-gray-200",
};

const statusLabel: Record<string, string> = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  PUBLISHED: "Published",
  PAUSED: "Paused",
  ARCHIVED: "Archived",
};

export function AdminListingsTable() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("q", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    const res = await fetch(`/api/admin/listings?${params}`);
    const data = await res.json();
    setListings(data.listings);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  async function handleStatusChange(listingId: string, newStatus: string) {
    await fetch(`/api/admin/listings/${listingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchListings();
  }

  async function handleApprove(listingId: string) {
    await fetch(`/api/admin/listings/${listingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "PUBLISHED" }),
    });
    toast.success("Listing approved and published");
    fetchListings();
  }

  async function handleReject(listingId: string) {
    await fetch(`/api/admin/listings/${listingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DRAFT" }),
    });
    toast.success("Listing rejected and moved back to draft");
    fetchListings();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchListings();
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-xl focus:border-ocean focus:ring-ocean"
            />
          </div>
          <Button type="submit" variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl">
            Search
          </Button>
        </form>

        <div className="flex gap-1 flex-wrap">
          {STATUSES.map((s) => (
            <Button
              key={s}
              variant={statusFilter === s ? "default" : "outline"}
              size="sm"
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={
                statusFilter === s
                  ? "bg-ocean hover:bg-ocean/90 text-white rounded-full"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full"
              }
            >
              {s === "ALL" ? "All" : statusLabel[s] || s}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-gray-500 font-medium">Title</TableHead>
              <TableHead className="text-gray-500 font-medium">Host</TableHead>
              <TableHead className="text-gray-500 font-medium">Status</TableHead>
              <TableHead className="text-gray-500 font-medium">Location</TableHead>
              <TableHead className="text-gray-500 font-medium text-center">Bookings</TableHead>
              <TableHead className="text-gray-500 font-medium">Created</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-gray-100">
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : listings.length === 0 ? (
              <TableRow className="border-gray-100">
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                  No listings found
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow key={listing.id} className="border-gray-100 hover:bg-gray-50/50">
                  <TableCell className="text-navy font-medium max-w-[200px] truncate">
                    {listing.title}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {listing.host.firstName} {listing.host.lastName}
                  </TableCell>
                  <TableCell>
                    <select
                      value={listing.status}
                      onChange={(e) => handleStatusChange(listing.id, e.target.value)}
                      className="bg-transparent text-xs rounded px-1 py-0.5 border-0 cursor-pointer text-gray-600"
                    >
                      {["DRAFT", "PENDING_REVIEW", "PUBLISHED", "PAUSED", "ARCHIVED"].map((s) => (
                        <option key={s} value={s}>
                          {statusLabel[s] || s}
                        </option>
                      ))}
                    </select>
                    <Badge
                      variant="outline"
                      className={`ml-1 text-[10px] ${statusBadgeClass[listing.status] || ""}`}
                    >
                      {statusLabel[listing.status] || listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500">{listing.locationName}</TableCell>
                  <TableCell className="text-gray-500 text-center">{listing._count.bookings}</TableCell>
                  <TableCell className="text-gray-400 text-sm">
                    {new Date(listing.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {listing.status === "PENDING_REVIEW" && (
                        <>
                          <button
                            onClick={() => handleApprove(listing.id)}
                            className="inline-flex items-center text-green-600 hover:text-green-700 p-1 rounded-lg hover:bg-green-50"
                            title="Approve"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(listing.id)}
                            className="inline-flex items-center text-red-500 hover:text-red-600 p-1 rounded-lg hover:bg-red-50"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <a
                        href={`/listings/${listing.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-400 hover:text-ocean p-1 rounded-lg hover:bg-gray-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {total} listing{total !== 1 && "s"} total
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-500">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="border-gray-200 text-gray-500 hover:bg-gray-50 rounded-xl"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
