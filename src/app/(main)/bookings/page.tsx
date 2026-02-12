"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, MapPin, Star } from "lucide-react";
import Link from "next/link";
import type { BookingWithRelations } from "@/types";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PAID: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-800",
  CANCELLED_GUEST: "bg-red-100 text-red-800",
  CANCELLED_HOST: "bg-red-100 text-red-800",
  REFUNDED: "bg-purple-100 text-purple-800",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const res = await fetch("/api/bookings?role=guest");
      if (res.ok) {
        setBookings(await res.json());
      }
      setLoading(false);
    }
    fetchBookings();
  }, []);

  const upcoming = bookings.filter((b) =>
    ["PENDING", "CONFIRMED", "PAID"].includes(b.status)
  );
  const past = bookings.filter((b) =>
    ["COMPLETED"].includes(b.status)
  );
  const cancelled = bookings.filter((b) =>
    ["CANCELLED_GUEST", "CANCELLED_HOST", "REFUNDED"].includes(b.status)
  );

  function BookingList({ items }: { items: BookingWithRelations[] }) {
    if (items.length === 0) {
      return (
        <p className="text-center py-8 text-muted-foreground">
          No bookings to show
        </p>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((booking) => (
          <Link key={booking.id} href={`/bookings/${booking.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{booking.listing.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {booking.listing.host.firstName}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={statusColors[booking.status] || ""}>
                    {booking.status.replace("_", " ")}
                  </Badge>
                  <p className="text-sm font-medium mt-1">
                    ${Number(booking.totalPrice).toFixed(2)}
                  </p>
                  {booking.review ? (
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <Star className="h-3 w-3 fill-green-600" />
                      Reviewed
                    </p>
                  ) : booking.status === "COMPLETED" ? (
                    <p className="text-xs text-ocean font-medium mt-1">
                      Leave a review &rarr;
                    </p>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full mb-4" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcoming.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({cancelled.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming" className="mt-4">
          <BookingList items={upcoming} />
        </TabsContent>
        <TabsContent value="past" className="mt-4">
          <BookingList items={past} />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <BookingList items={cancelled} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
