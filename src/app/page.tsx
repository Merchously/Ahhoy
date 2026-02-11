import Link from "next/link";
import {
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
  Anchor,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const activityTypes = [
  { slug: "fishing", label: "Fishing Trips", icon: Fish },
  { slug: "jet-ski", label: "Jet Ski Adventures", icon: Waves },
  { slug: "yacht-party", label: "Yacht Parties", icon: PartyPopper },
  { slug: "sunset-cruise", label: "Sunset Cruises", icon: Sunset },
  { slug: "snorkeling-diving", label: "Snorkeling & Diving", icon: Glasses },
  { slug: "wakeboarding", label: "Watersports", icon: Zap },
  { slug: "boat-rental", label: "Boat Rentals", icon: Ship },
  { slug: "custom", label: "Custom Experiences", icon: Sparkles },
];

const steps = [
  {
    step: "01",
    title: "Discover",
    description:
      "Browse water experiences by location, activity type, or date. Find the perfect adventure for you.",
  },
  {
    step: "02",
    title: "Book",
    description:
      "Select your date, choose the number of guests, and book instantly with secure payment.",
  },
  {
    step: "03",
    title: "Experience",
    description:
      "Meet your host at the dock and enjoy an unforgettable day on the water.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-20 md:py-28 lg:py-36">
            <div className="max-w-3xl">
              <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-navy leading-[1.1] mb-6">
                Unforgettable{" "}
                <span className="decoration-gold gold-underline underline">
                  Water Experiences
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl leading-relaxed">
                Book fishing trips, yacht parties, sunset cruises, and more from
                local boat owners and captains. Your next adventure starts here.
              </p>

              {/* Search Bar */}
              <Link
                href="/search"
                className="inline-flex items-center gap-4 bg-white rounded-full pl-6 pr-2 py-2 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <Search className="h-5 w-5 text-gray-400" />
                <span className="text-base text-gray-400 font-medium">
                  Search water experiences near you...
                </span>
                <Button className="rounded-full bg-ocean hover:bg-ocean-dark text-white px-6 h-11">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-cream to-transparent -z-10 hidden lg:block" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
        </section>

        {/* Activity Types */}
        <section className="container mx-auto px-4 py-20">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
              Explore Water Experiences
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              From relaxing sunset cruises to adrenaline-pumping watersports,
              find the perfect experience for any occasion.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {activityTypes.map((type) => (
              <Link
                key={type.slug}
                href={`/search?activityType=${type.slug}`}
              >
                <div className="group bg-white rounded-2xl border border-gray-100 p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-ocean group-hover:text-white transition-colors duration-300">
                    <type.icon className="h-7 w-7 text-ocean group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900">
                    {type.label}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-cream py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
                How It Works
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Getting on the water has never been easier.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gold/30" />

              {steps.map((step) => (
                <div key={step.step} className="text-center relative">
                  <div className="font-heading text-4xl font-bold text-gold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust & Safety */}
        <section className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
                <Shield className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="font-semibold text-lg text-navy mb-2">
                Secure Payments
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                All transactions are secured through Stripe. Your money is
                protected until your experience is complete.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
                <Star className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="font-semibold text-lg text-navy mb-2">
                Verified Reviews
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Read genuine reviews from guests who have experienced the trip
                before you book.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
                <Anchor className="h-8 w-8 text-ocean" />
              </div>
              <h3 className="font-semibold text-lg text-navy mb-2">
                Local Experts
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Our hosts are experienced boat owners and captains who know the
                best spots on the water.
              </p>
            </div>
          </div>
        </section>

        {/* CTA: Become a Host */}
        <section className="bg-navy text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              Own a Boat? Start Earning
            </h2>
            <p className="text-white/60 mb-10 max-w-2xl mx-auto text-lg">
              Share your boat and expertise with guests looking for amazing water
              experiences. Set your own prices, schedule, and experiences.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gold hover:bg-gold/90 text-navy font-semibold px-8 h-12 text-base"
            >
              <Link href="/become-a-host">Become a Host</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
