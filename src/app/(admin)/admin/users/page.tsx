import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminUsersTable } from "@/components/admin/AdminUsersTable";

export const metadata = {
  title: "Manage Users | Ahhoy Admin",
};

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy mb-6">Users</h1>
      <AdminUsersTable currentUserId={session.user.id} />
    </div>
  );
}
