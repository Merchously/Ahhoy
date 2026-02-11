import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";

export const metadata = {
  title: "Manage Bookings | Ahhoy Admin",
};

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Bookings</h1>
      <AdminBookingsTable />
    </div>
  );
}
