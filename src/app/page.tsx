import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Shield,
  Star,
  Anchor,
  ArrowRight,
  MapPin,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const activityTypes = [
  { slug: "fishing", label: "Fishing Trips", image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=800&fit=crop" },
  { slug: "jet-ski", label: "Jet Ski Adventures", image: "https://images.unsplash.com/photo-1626447857058-2ba6a8868cb5?w=600&h=800&fit=crop" },
  { slug: "yacht-party", label: "Yacht Parties", image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600&h=800&fit=crop" },
  { slug: "sunset-cruise", label: "Sunset Cruises", image: "https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=600&h=800&fit=crop" },
  { slug: "snorkeling-diving", label: "Snorkeling & Diving", image: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600&h=800&fit=crop" },
  { slug: "wakeboarding", label: "Watersports", image: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=600&h=800&fit=crop" },
  { slug: "boat-rental", label: "Boat Rentals", image: "https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=600&h=800&fit=crop" },
  { slug: "custom", label: "Custom Experiences", image: "https://images.unsplash.com/photo-1476673160081-cf065607f449?w=600&h=800&fit=crop" },
];

const featuredExperiences = [
  {
    title: "Deep Sea Fishing Charter",
    location: "Miami, FL",
    price: 189,
    image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=800&h=600&fit=crop",
    rating: 4.9,
    reviews: 47,
  },
  {
    title: "Sunset Catamaran Cruise",
    location: "Key West, FL",
    price: 95,
    image: "https://images.unsplash.com/photo-1534256958597-7fe685cbd745?w=800&h=600&fit=crop",
    rating: 4.8,
    reviews: 83,
  },
  {
    title: "Private Yacht Experience",
    location: "San Diego, CA",
    price: 450,
    image: "https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop",
    rating: 5.0,
    reviews: 21,
  },
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

const testimonials = [
  {
    name: "Sarah M.",
    location: "Austin, TX",
    rating: 5,
    quote:
      "The sunset cruise was absolutely magical. Our captain knew the best spots and the boat was immaculate. Already planning our next trip!",
  },
  {
    name: "James R.",
    location: "Denver, CO",
    rating: 5,
    quote:
      "Booked a deep sea fishing trip for my dad's birthday. The host was incredibly knowledgeable and we caught more fish than we could carry!",
  },
  {
    name: "Emily & Dan",
    location: "Chicago, IL",
    rating: 5,
    quote:
      "We used Ahhoy for our anniversary and it was the best decision. Private yacht, champagne, stunning views. Highly recommend.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
        />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text */}
              <div>
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

              {/* Image Collage */}
              <div className="hidden md:grid grid-cols-2 gap-4 h-[500px]">
                <div className="relative rounded-3xl overflow-hidden row-span-2">
                  <Image
                    src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=1000&fit=crop"
                    alt="Fishing boat on open water"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    priority
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1559825481-12a05cc00344?w=600&h=400&fit=crop"
                    alt="Turquoise ocean aerial view"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    priority
                  />
                </div>
                <div className="relative rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1500514966906-fe245eea9344?w=600&h=400&fit=crop"
                    alt="Sunset over the ocean"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Activity Types — Image Cards */}
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {activityTypes.map((type) => (
              <Link
                key={type.slug}
                href={`/search?activityType=${type.slug}`}
              >
                <div className="group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300">
                  <Image
                    src={type.image}
                    alt={type.label}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-semibold text-white text-lg">
                      {type.label}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Experiences */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
                Our Top Water Experiences
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Handpicked experiences loved by our guests.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredExperiences.map((exp) => (
                <Link key={exp.title} href="/search">
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-navy text-lg mb-1">
                        {exp.title}
                      </h3>
                      <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
                        <MapPin className="h-3.5 w-3.5" />
                        {exp.location}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-navy font-bold text-lg">
                          ${exp.price}
                          <span className="text-gray-400 font-normal text-sm">
                            {" "}/ person
                          </span>
                        </span>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium text-gray-900">
                            {exp.rating}
                          </span>
                          <span className="text-gray-400">
                            ({exp.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-cream py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="hidden lg:block relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=1000&fit=crop"
                  alt="People enjoying a boat ride"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>

              {/* Steps */}
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
                  How It Works
                </h2>
                <p className="text-gray-500 text-lg mb-12">
                  Getting on the water has never been easier.
                </p>

                <div className="space-y-10">
                  {steps.map((step) => (
                    <div key={step.step} className="flex gap-6">
                      <div className="font-heading text-4xl font-bold text-gold leading-none shrink-0">
                        {step.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-navy mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

        {/* Testimonials */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy mb-4">
                What Our Guests Are Saying
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                Real stories from real adventurers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl p-7 shadow-sm"
                >
                  <Quote className="h-8 w-8 text-gold/40 mb-4" />
                  <p className="text-gray-600 leading-relaxed mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-navy text-sm">
                        {t.name}
                      </p>
                      <p className="text-gray-400 text-xs">{t.location}</p>
                    </div>
                    <StarRating rating={t.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA: Become a Host */}
        <section className="bg-navy text-white py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
                  Own a Boat? Start Earning
                </h2>
                <p className="text-white/60 mb-10 max-w-lg text-lg leading-relaxed">
                  Share your boat and expertise with guests looking for amazing water
                  experiences. Set your own prices, schedule, and experiences.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-gold hover:bg-gold/90 text-navy font-semibold px-8 h-12 text-base"
                >
                  <Link href="/become-a-host">
                    Become a Host
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="hidden lg:block relative aspect-[4/3] rounded-3xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&h=600&fit=crop"
                  alt="Captain steering a yacht"
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
