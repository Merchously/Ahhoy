import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Ship, CalendarDays, DollarSign, UserPlus, ClipboardCheck } from "lucide-react";
import { PendingReviewActions } from "@/components/admin/PendingReviewActions";
import Link from "next/link";

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
    adminCount,
    publishedListings,
    totalListings,
    pendingReviewCount,
    totalBookings,
    revenueResult,
    recentUsers,
    pendingListings,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "GUEST" } }),
    prisma.user.count({ where: { role: "HOST" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.listing.count({ where: { status: "PUBLISHED" } }),
    prisma.listing.count(),
    prisma.listing.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.booking.count(),
    prisma.booking.aggregate({ _sum: { serviceFee: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true },
    }),
    prisma.listing.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        locationName: true,
        createdAt: true,
        host: {
          select: { firstName: true, lastName: true },
        },
      },
    }),
  ]);

  const platformRevenue = Number(revenueResult._sum.serviceFee || 0);

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      sub: `${guestCount} guests, ${hostCount} hosts, ${adminCount} admins`,
      color: "bg-ocean/10 text-ocean",
    },
    {
      label: "Pending Review",
      value: pendingReviewCount,
      icon: ClipboardCheck,
      sub: "Listings awaiting approval",
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Published Listings",
      value: publishedListings,
      icon: Ship,
      sub: `${totalListings} total listings`,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Platform Revenue",
      value: `$${platformRevenue.toFixed(2)}`,
      icon: DollarSign,
      sub: `${totalBookings} total bookings`,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const roleBadge: Record<string, string> = {
    GUEST: "bg-blue-50 text-blue-700",
    HOST: "bg-green-50 text-green-700",
    ADMIN: "bg-red-50 text-red-700",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back. Here&apos;s what&apos;s happening on Ahhoy.</p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.label}
              </CardTitle>
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-navy">{stat.value}</div>
              {stat.sub && (
                <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Review Section */}
      {pendingListings.length > 0 && (
        <Card className="rounded-2xl border-gray-200 shadow-sm mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-navy">Pending Review</CardTitle>
              <p className="text-sm text-gray-400 mt-0.5">Listings awaiting your approval</p>
            </div>
            <Link
              href="/admin/listings"
              className="text-sm text-ocean hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingListings.map((listing) => (
                <div key={listing.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{listing.title}</p>
                    <p className="text-xs text-gray-400">
                      by {listing.host.firstName} {listing.host.lastName} &middot; {listing.locationName} &middot; {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <PendingReviewActions listingId={listing.id} />
                    <a
                      href={`/listings/${listing.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-ocean underline"
                    >
                      Preview
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border-gray-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-navy">Recent Users</CardTitle>
            <p className="text-sm text-gray-400 mt-0.5">Latest accounts created</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-ocean/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-ocean" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-ocean-light flex items-center justify-center">
                    <span className="text-sm font-semibold text-ocean">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${roleBadge[user.role] || "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
