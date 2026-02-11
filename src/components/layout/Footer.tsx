import Link from "next/link";
import { Anchor } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Anchor className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">Ahhoy</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover unforgettable water experiences. From fishing trips to yacht parties.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-sm text-muted-foreground hover:text-foreground">
                  Search Experiences
                </Link>
              </li>
              <li>
                <Link href="/search?activityType=fishing" className="text-sm text-muted-foreground hover:text-foreground">
                  Fishing Trips
                </Link>
              </li>
              <li>
                <Link href="/search?activityType=yacht-party" className="text-sm text-muted-foreground hover:text-foreground">
                  Yacht Parties
                </Link>
              </li>
              <li>
                <Link href="/search?activityType=sunset-cruise" className="text-sm text-muted-foreground hover:text-foreground">
                  Sunset Cruises
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="font-semibold mb-4">Hosting</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/become-a-host" className="text-sm text-muted-foreground hover:text-foreground">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Ahhoy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
