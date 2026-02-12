"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "./UserMenu";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto flex h-[72px] items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="text-2xl font-bold text-navy tracking-tight">
            Ahhoy
          </span>
        </Link>

        {/* Center: Compact Search (visible on md+) */}
        <Link
          href="/search"
          className="hidden md:flex items-center gap-3 rounded-full border border-gray-200 px-5 py-2.5 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <span className="text-sm font-medium text-gray-900">Anywhere</span>
          <span className="h-4 w-px bg-gray-200" />
          <span className="text-sm font-medium text-gray-900">Any date</span>
          <span className="h-4 w-px bg-gray-200" />
          <span className="text-sm text-gray-400">Add guests</span>
          <div className="rounded-full bg-ocean p-2">
            <Search className="h-3.5 w-3.5 text-white" />
          </div>
        </Link>

        {/* Right: Nav items */}
        <div className="flex items-center gap-3">
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-navy transition-colors"
            >
              Admin
            </Link>
          )}
          {session?.user?.role !== "HOST" && session?.user?.role !== "ADMIN" && (
            <Link
              href="/become-a-host"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-navy transition-colors"
            >
              Become a Host
            </Link>
          )}
          {session?.user?.role === "HOST" && (
            <Link
              href="/dashboard"
              className="hidden md:block text-sm font-medium text-gray-600 hover:text-navy transition-colors"
            >
              Dashboard
            </Link>
          )}

          {session ? (
            <UserMenu />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild className="text-gray-600 hover:text-navy">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild className="rounded-full bg-ocean hover:bg-ocean-dark text-white px-6">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-navy">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-2 mt-8">
                <Link
                  href="/search"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Search Experiences
                </Link>
                <Link
                  href="/how-it-works"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/become-a-host"
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  Become a Host
                </Link>
                <div className="h-px bg-gray-100 my-2" />
                {session ? (
                  <>
                    <Link
                      href="/bookings"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                    {session.user.role === "HOST" && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    {session.user.role === "ADMIN" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium hover:bg-gray-50 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center rounded-full bg-ocean text-white px-6 py-3 text-base font-medium hover:bg-ocean-dark transition-colors mt-2"
                      onClick={() => setOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
