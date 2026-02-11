import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Ship, CalendarDays, DollarSign } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Ahhoy",
};

export default async function AdminOverviewPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const [
    totalUsers,
    guestCount,
    hostCount,
    publishedListings,
    totalBookings,
    revenueResult,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "GUEST" } }),
    prisma.user.count({ where: { role: "HOST" } }),
    prisma.listing.count({ where: { status: "PUBLISHED" } }),
    prisma.booking.count(),
    prisma.booking.aggregate({ _sum: { serviceFee: true } }),
  ]);

  const platformRevenue = Number(revenueResult._sum.serviceFee || 0);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, sub: `${guestCount} guests, ${hostCount} hosts` },
    { label: "Published Listings", value: publishedListings, icon: Ship },
    { label: "Total Bookings", value: totalBookings, icon: CalendarDays },
    { label: "Platform Revenue", value: `$${platformRevenue.toFixed(2)}`, icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-gray-900 border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              {stat.sub && (
                <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
