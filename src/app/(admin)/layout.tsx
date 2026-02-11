import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50/60">
      <AdminSidebar />
      <div className="flex-1 p-6 md:p-10">{children}</div>
    </div>
  );
}
