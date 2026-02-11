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

  useEffect(() => { fetchBookings(); }, []);

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
        <h1 className="text-2xl font-bold mb-6">Bookings</h1>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full mb-4" />
        ))}
      </div>
    );
  }

  function BookingItem({ booking }: { booking: HostBooking }) {
    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold">{booking.listing.title}</h3>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(booking.date).toLocaleDateString()} | {booking.startTime} - {booking.endTime}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {booking.guest.firstName} {booking.guest.lastName} ({booking.guestCount} guests)
                </span>
              </div>
              {booking.messageToHost && (
                <p className="text-sm mt-2 bg-gray-50 p-2 rounded italic">
                  &quot;{booking.messageToHost}&quot;
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold">${Number(booking.totalPrice).toFixed(2)}</p>
              <Badge variant="secondary" className="mt-1">
                {booking.status.replace("_", " ")}
              </Badge>
            </div>
          </div>
          {booking.status === "PENDING" && (
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={() => updateStatus(booking.id, "CONFIRMED")}
              >
                <Check className="mr-1 h-3 w-3" />
                Confirm
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => updateStatus(booking.id, "CANCELLED_HOST")}
              >
                <X className="mr-1 h-3 w-3" />
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
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed ({confirmed.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          {pending.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No pending bookings</p>
          ) : (
            pending.map((b) => <BookingItem key={b.id} booking={b} />)
          )}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-4">
          {confirmed.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No confirmed bookings</p>
          ) : (
            confirmed.map((b) => <BookingItem key={b.id} booking={b} />)
          )}
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          {completed.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No completed bookings</p>
          ) : (
            completed.map((b) => <BookingItem key={b.id} booking={b} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
