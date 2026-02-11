import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      {/* Gold accent line */}
      <div className="h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight">Ahhoy</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Discover unforgettable water experiences. From fishing trips to
              yacht parties, your next adventure starts here.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-5 text-white/90">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/search"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Search Experiences
                </Link>
              </li>
              <li>
                <Link
                  href="/search?activityType=fishing"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Fishing Trips
                </Link>
              </li>
              <li>
                <Link
                  href="/search?activityType=yacht-party"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Yacht Parties
                </Link>
              </li>
              <li>
                <Link
                  href="/search?activityType=sunset-cruise"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Sunset Cruises
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="font-semibold mb-5 text-white/90">Hosting</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/become-a-host"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Become a Host
                </Link>
              </li>
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-5 text-white/90">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-white/50 hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <span className="text-sm text-white/50">Terms of Service</span>
              </li>
              <li>
                <span className="text-sm text-white/50">Privacy Policy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          &copy; {new Date().getFullYear()} Ahhoy. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
