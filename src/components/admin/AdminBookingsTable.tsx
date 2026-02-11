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
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED_GUEST: "bg-red-50 text-red-700 border-red-200",
  CANCELLED_HOST: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
  DISPUTED: "bg-orange-50 text-orange-700 border-orange-200",
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
                ? "bg-ocean hover:bg-ocean/90 text-white rounded-full"
                : "border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full"
            }
          >
            {s === "ALL" ? "All" : s.replace("_", " ")}
          </Button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="text-gray-500 font-medium">Listing</TableHead>
              <TableHead className="text-gray-500 font-medium">Guest</TableHead>
              <TableHead className="text-gray-500 font-medium">Date</TableHead>
              <TableHead className="text-gray-500 font-medium text-center">Guests</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Total</TableHead>
              <TableHead className="text-gray-500 font-medium text-right">Fee</TableHead>
              <TableHead className="text-gray-500 font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-gray-100">
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow className="border-gray-100">
                <TableCell colSpan={7} className="text-center text-gray-400 py-8">
                  No bookings found
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="border-gray-100 hover:bg-gray-50/50">
                  <TableCell className="text-navy font-medium max-w-[200px] truncate">
                    {booking.listing.title}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {booking.guest.firstName} {booking.guest.lastName}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {new Date(booking.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-gray-500 text-center">{booking.guestCount}</TableCell>
                  <TableCell className="text-navy font-medium text-right">
                    ${Number(booking.subtotal).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-gray-400 text-right">
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
