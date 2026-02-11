import Link from "next/link";
import {
  Anchor,
  Fish,
  Waves,
  PartyPopper,
  Sunset,
  Glasses,
  Zap,
  Ship,
  Sparkles,
  Search,
  Shield,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const activityTypes = [
  { slug: "fishing", label: "Fishing Trips", icon: Fish, color: "bg-emerald-100 text-emerald-700" },
  { slug: "jet-ski", label: "Jet Ski Adventures", icon: Waves, color: "bg-blue-100 text-blue-700" },
  { slug: "yacht-party", label: "Yacht Parties", icon: PartyPopper, color: "bg-purple-100 text-purple-700" },
  { slug: "sunset-cruise", label: "Sunset Cruises", icon: Sunset, color: "bg-orange-100 text-orange-700" },
  { slug: "snorkeling-diving", label: "Snorkeling & Diving", icon: Glasses, color: "bg-cyan-100 text-cyan-700" },
  { slug: "wakeboarding", label: "Watersports", icon: Zap, color: "bg-yellow-100 text-yellow-700" },
  { slug: "boat-rental", label: "Boat Rentals", icon: Ship, color: "bg-slate-100 text-slate-700" },
  { slug: "custom", label: "Custom Experiences", icon: Sparkles, color: "bg-pink-100 text-pink-700" },
];

const steps = [
  {
    step: "1",
    title: "Discover",
    description: "Browse water experiences by location, activity type, or date. Find the perfect adventure for you.",
  },
  {
    step: "2",
    title: "Book",
    description: "Select your date, choose the number of guests, and book instantly with secure payment.",
  },
  {
    step: "3",
    title: "Experience",
    description: "Meet your host at the dock and enjoy an unforgettable day on the water.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
          <div className="container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Anchor className="h-16 w-16" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Unforgettable Water Experiences
              </h1>
              <p className="text-lg md:text-xl text-blue-100 mb-10">
                Book fishing trips, yacht parties, sunset cruises, and more from
                local boat owners and captains. Your next adventure starts here.
              </p>

              {/* Search Bar */}
              <Link
                href="/search"
                className="inline-flex items-center gap-3 bg-white text-gray-900 rounded-full px-6 py-4 shadow-xl hover:shadow-2xl transition-shadow"
              >
                <Search className="h-5 w-5 text-blue-600" />
                <span className="text-base font-medium">
                  Search for water experiences near you...
                </span>
                <Button size="sm" className="rounded-full ml-2">
                  Explore
                </Button>
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Activity Types */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-4">
            Explore Water Experiences
          </h2>
          <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
            From relaxing sunset cruises to adrenaline-pumping watersports,
            find the perfect experience for any occasion.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activityTypes.map((type) => (
              <Link
                key={type.slug}
                href={`/search?activityType=${type.slug}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center text-center p-6">
                    <div className={`rounded-full p-4 mb-3 ${type.color}`}>
                      <type.icon className="h-8 w-8" />
                    </div>
                    <h3 className="font-semibold text-sm">{type.label}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-center mb-10 max-w-2xl mx-auto">
              Getting on the water has never been easier.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {steps.map((step) => (
                <div key={step.step} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                All transactions are secured through Stripe. Your money is
                protected until your experience is complete.
              </p>
            </div>
            <div className="text-center">
              <Star className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Verified Reviews</h3>
              <p className="text-sm text-muted-foreground">
                Read genuine reviews from guests who have experienced the
                trip before you book.
              </p>
            </div>
            <div className="text-center">
              <Anchor className="h-10 w-10 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Local Experts</h3>
              <p className="text-sm text-muted-foreground">
                Our hosts are experienced boat owners and captains who know
                the best spots on the water.
              </p>
            </div>
          </div>
        </section>

        {/* CTA: Become a Host */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Own a Boat? Start Earning</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Share your boat and expertise with guests looking for amazing
              water experiences. Set your own prices, schedule, and experiences.
            </p>
            <Button asChild size="lg" variant="secondary" className="text-blue-600">
              <Link href="/become-a-host">Become a Host</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
