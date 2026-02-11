import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left: Branding panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] bg-navy relative flex-col justify-between p-12">
        <Link href="/">
          <span className="text-2xl font-bold text-white tracking-tight">
            Ahhoy
          </span>
        </Link>

        <div>
          <h2 className="font-heading text-4xl font-bold text-white leading-tight mb-4">
            Discover unforgettable{" "}
            <span className="text-gold">water experiences</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed">
            Book fishing trips, yacht parties, sunset cruises, and more from
            local boat owners and captains.
          </p>
        </div>

        <p className="text-white/30 text-sm">
          &copy; {new Date().getFullYear()} Ahhoy. All rights reserved.
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gray-50/50">
        {children}
      </div>
    </div>
  );
}
