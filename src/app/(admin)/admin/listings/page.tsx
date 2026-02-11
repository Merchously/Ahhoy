import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminListingsTable } from "@/components/admin/AdminListingsTable";

export const metadata = {
  title: "Manage Listings | Ahhoy Admin",
};

export default async function AdminListingsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Listings</h1>
      <AdminListingsTable />
    </div>
  );
}
