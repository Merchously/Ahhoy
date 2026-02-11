"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Anchor, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserMenu } from "./UserMenu";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Anchor className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-blue-600">Ahhoy</span>
        </Link>

        {/* Center: Compact Search (visible on md+) */}
        <Link
          href="/search"
          className="hidden md:flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="text-sm font-medium">Anywhere</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm font-medium">Any date</span>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm text-muted-foreground">Add guests</span>
          <div className="rounded-full bg-blue-600 p-1.5">
            <Search className="h-3 w-3 text-white" />
          </div>
        </Link>

        {/* Right: Nav items */}
        <div className="flex items-center gap-4">
          {session?.user?.role !== "HOST" && (
            <Link
              href="/become-a-host"
              className="hidden md:block text-sm font-medium hover:underline"
            >
              Become a Host
            </Link>
          )}
          {session?.user?.role === "HOST" && (
            <Link
              href="/dashboard"
              className="hidden md:block text-sm font-medium hover:underline"
            >
              Dashboard
            </Link>
          )}

          {session ? (
            <UserMenu />
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/search"
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  Search Experiences
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  href="/become-a-host"
                  className="text-lg font-medium"
                  onClick={() => setOpen(false)}
                >
                  Become a Host
                </Link>
                {session ? (
                  <>
                    <Link
                      href="/bookings"
                      className="text-lg font-medium"
                      onClick={() => setOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/profile"
                      className="text-lg font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                    {session.user.role === "HOST" && (
                      <Link
                        href="/dashboard"
                        className="text-lg font-medium"
                        onClick={() => setOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-lg font-medium"
                      onClick={() => setOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="text-lg font-medium"
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
