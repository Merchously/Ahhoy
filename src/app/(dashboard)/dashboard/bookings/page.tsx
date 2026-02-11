"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, User, Check, X } from "lucide-react";
import { toast } from "sonner";

interface HostBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  totalPrice: string;
  status: string;
  messageToHost: string | null;
  listing: { title: string };
  guest: { firstName: string; lastName: string; email: string };
}

export default function HostBookingsPage() {
  const [bookings, setBookings] = useState<HostBooking[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchBookings() {
    const res = await fetch("/api/bookings?role=host");
    if (res.ok) setBookings(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    } else {
      toast.error("Failed to update booking");
    }
  }

  const pending = bookings.filter((b) => b.status === "PENDING");
  const confirmed = bookings.filter((b) =>
    ["CONFIRMED", "PAID"].includes(b.status)
  );
  const completed = bookings.filter((b) => b.status === "COMPLETED");

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-navy mb-8">Bookings</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full mb-4 rounded-xl" />
        ))}
      </div>
    );
  }

  function BookingItem({ booking }: { booking: HostBooking }) {
    return (
      <Card className="mb-3 rounded-xl shadow-sm border-gray-100 bg-white hover:shadow-md transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">
                {booking.listing.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1.5">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(booking.date).toLocaleDateString()} |{" "}
                  {booking.startTime} - {booking.endTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {booking.guest.firstName} {booking.guest.lastName} (
                  {booking.guestCount} guests)
                </span>
              </div>
              {booking.messageToHost && (
                <p className="text-sm mt-3 bg-gray-50 p-3 rounded-lg text-gray-500 italic">
                  &quot;{booking.messageToHost}&quot;
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold text-navy">
                ${Number(booking.totalPrice).toFixed(2)}
              </p>
              <Badge
                variant="secondary"
                className="mt-1.5 rounded-full text-xs"
              >
                {booking.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
          {booking.status === "PENDING" && (
            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                className="rounded-lg bg-ocean hover:bg-ocean-dark text-white"
                onClick={() => updateStatus(booking.id, "CONFIRMED")}
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="rounded-lg"
                onClick={() => updateStatus(booking.id, "CANCELLED_HOST")}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Decline
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-8">Bookings</h1>

      <Tabs defaultValue="pending">
        <TabsList className="rounded-lg bg-gray-100 p-1">
          <TabsTrigger value="pending" className="rounded-md">
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="confirmed" className="rounded-md">
            Confirmed ({confirmed.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="rounded-md">
            Completed ({completed.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          {pending.length === 0 ? (
            <p className="text-center py-12 text-gray-400">
              No pending bookings
            </p>
          ) : (
            pending.map((b) => <BookingItem key={b.id} booking={b} />)
          )}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-6">
          {confirmed.length === 0 ? (
            <p className="text-center py-12 text-gray-400">
              No confirmed bookings
            </p>
          ) : (
            confirmed.map((b) => <BookingItem key={b.id} booking={b} />)
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {completed.length === 0 ? (
            <p className="text-center py-12 text-gray-400">
              No completed bookings
            </p>
          ) : (
            completed.map((b) => <BookingItem key={b.id} booking={b} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
