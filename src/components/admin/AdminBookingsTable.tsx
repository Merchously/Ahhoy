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
import { ChevronLeft, ChevronRight } from "lucide-react";

type Booking = {
  id: string;
  date: string;
  guestCount: number;
  subtotal: string;
  serviceFee: string;
  status: string;
  createdAt: string;
  listing: { id: string; title: string };
  guest: { id: string; firstName: string; lastName: string; email: string };
};

const STATUSES = [
  "ALL",
  "PENDING",
  "CONFIRMED",
  "PAID",
  "COMPLETED",
  "CANCELLED_GUEST",
  "CANCELLED_HOST",
  "REFUNDED",
  "DISPUTED",
] as const;

const statusBadgeClass: Record<string, string> = {
  PENDING: "bg-yellow-900/50 text-yellow-300 border-yellow-800",
  CONFIRMED: "bg-blue-900/50 text-blue-300 border-blue-800",
  PAID: "bg-green-900/50 text-green-300 border-green-800",
  COMPLETED: "bg-emerald-900/50 text-emerald-300 border-emerald-800",
  CANCELLED_GUEST: "bg-red-900/50 text-red-300 border-red-800",
  CANCELLED_HOST: "bg-red-900/50 text-red-300 border-red-800",
  REFUNDED: "bg-purple-900/50 text-purple-300 border-purple-800",
  DISPUTED: "bg-orange-900/50 text-orange-300 border-orange-800",
};

export function AdminBookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    const res = await fetch(`/api/admin/bookings?${params}`);
    const data = await res.json();
    setBookings(data.bookings);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="space-y-4">
      {/* Status filter */}
      <div className="flex gap-1 flex-wrap">
        {STATUSES.map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={
              statusFilter === s
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "border-gray-700 text-gray-400 hover:bg-gray-800"
            }
          >
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400">Listing</TableHead>
              <TableHead className="text-gray-400">Guest</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400 text-center">Guests</TableHead>
              <TableHead className="text-gray-400 text-right">Total</TableHead>
              <TableHead className="text-gray-400 text-right">Fee</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-gray-800">
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow className="border-gray-800">
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="border-gray-800 hover:bg-gray-900/50">
                  <TableCell className="text-white font-medium max-w-[200px] truncate">
                    {booking.listing.title}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {booking.guest.firstName} {booking.guest.lastName}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {new Date(booking.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-400 text-center">{booking.guestCount}</TableCell>
                  <TableCell className="text-gray-300 text-right">
                    ${Number(booking.subtotal).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-500 text-right">
                    ${Number(booking.serviceFee).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${statusBadgeClass[booking.status] || ""}`}
                    >
                      {booking.status.replace("_", " ")}
                    </Badge>
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
          {total} booking{total !== 1 && "s"} total
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="border-gray-700 text-gray-400 hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-400">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="border-gray-700 text-gray-400 hover:bg-gray-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
