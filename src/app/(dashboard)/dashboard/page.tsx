import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ship, CalendarDays, DollarSign, Plus } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-navy">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back, {session.user.name?.split(" ")[0] || "Host"}
          </p>
        </div>
        <Button
          asChild
          className="rounded-xl bg-ocean hover:bg-ocean-dark text-white"
        >
          <Link href="/dashboard/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Card className="rounded-2xl shadow-sm border-gray-100 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Listings
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center">
              <Ship className="h-5 w-5 text-ocean" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">0</div>
            <p className="text-xs text-gray-400 mt-1">Published experiences</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-gray-100 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Upcoming Bookings
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <CalendarDays className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">0</div>
            <p className="text-xs text-gray-400 mt-1">Confirmed bookings</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-gray-100 bg-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Earnings
            </CardTitle>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-navy">$0.00</div>
            <p className="text-xs text-gray-400 mt-1">Lifetime earnings</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8 rounded-2xl shadow-sm border-gray-100 bg-white">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
            <Ship className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-lg font-semibold text-navy mb-2">
            No listings yet
          </h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Create your first water experience listing to start receiving
            bookings from guests.
          </p>
          <Button
            asChild
            className="rounded-xl bg-ocean hover:bg-ocean-dark text-white"
          >
            <Link href="/dashboard/listings/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Listing
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
