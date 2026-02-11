"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  _count: { listings: number; bookings: number };
};

const ROLES = ["ALL", "GUEST", "HOST", "ADMIN"] as const;

const roleBadgeClass: Record<string, string> = {
  GUEST: "bg-blue-900/50 text-blue-300 border-blue-800",
  HOST: "bg-green-900/50 text-green-300 border-green-800",
  ADMIN: "bg-red-900/50 text-red-300 border-red-800",
};

export function AdminUsersTable({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("q", search);
    if (roleFilter !== "ALL") params.set("role", roleFilter);

    const res = await fetch(`/api/admin/users?${params}`);
    const data = await res.json();
    setUsers(data.users);
    setTotal(data.total);
    setTotalPages(data.totalPages);
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleRoleChange(userId: string, newRole: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    fetchUsers();
  }

  async function handleDelete(userId: string, name: string) {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    fetchUsers();
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            />
          </div>
          <Button type="submit" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
            Search
          </Button>
        </form>

        <div className="flex gap-1">
          {ROLES.map((r) => (
            <Button
              key={r}
              variant={roleFilter === r ? "default" : "outline"}
              size="sm"
              onClick={() => { setRoleFilter(r); setPage(1); }}
              className={
                roleFilter === r
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "border-gray-700 text-gray-400 hover:bg-gray-800"
              }
            >
              {r === "ALL" ? "All" : r}
            </Button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-transparent">
              <TableHead className="text-gray-400">Name</TableHead>
              <TableHead className="text-gray-400">Email</TableHead>
              <TableHead className="text-gray-400">Role</TableHead>
              <TableHead className="text-gray-400 text-center">Listings</TableHead>
              <TableHead className="text-gray-400 text-center">Bookings</TableHead>
              <TableHead className="text-gray-400">Joined</TableHead>
              <TableHead className="text-gray-400 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-gray-800">
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow className="border-gray-800">
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-gray-800 hover:bg-gray-900/50">
                  <TableCell className="text-white font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell className="text-gray-400">{user.email}</TableCell>
                  <TableCell>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      disabled={user.id === currentUserId}
                      className="bg-transparent text-xs rounded px-1 py-0.5 border-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {["GUEST", "HOST", "ADMIN"].map((r) => (
                        <option key={r} value={r} className="bg-gray-900">
                          {r}
                        </option>
                      ))}
                    </select>
                    <Badge
                      variant="outline"
                      className={`ml-1 text-[10px] ${roleBadgeClass[user.role] || ""}`}
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 text-center">{user._count.listings}</TableCell>
                  <TableCell className="text-gray-400 text-center">{user._count.bookings}</TableCell>
                  <TableCell className="text-gray-500 text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {user.id !== currentUserId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id, `${user.firstName} ${user.lastName}`)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {total} user{total !== 1 && "s"} total
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="border-gray-700 text-gray-400 hover:bg-gray-800"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-400">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="border-gray-700 text-gray-400 hover:bg-gray-800"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
