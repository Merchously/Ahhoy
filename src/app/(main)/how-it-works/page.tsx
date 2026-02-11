import { Search, CreditCard, Anchor, Ship, Star, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
};

export default function HowItWorksPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-cream py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-navy mb-4">
            How Ahhoy Works
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            Whether you&apos;re looking for an unforgettable day on the water or
            want to share your boat with others, Ahhoy makes it simple.
          </p>
        </div>
      </section>

      {/* For Guests */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-10 text-center">
          For Guests
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
              <Search className="h-7 w-7 text-ocean" />
            </div>
            <div className="font-heading text-2xl font-bold text-gold mb-2">
              01
            </div>
            <h3 className="font-semibold text-lg text-navy mb-3">Discover</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Browse water experiences by location, activity type, or date.
              Filter by price, capacity, and more.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
              <CreditCard className="h-7 w-7 text-ocean" />
            </div>
            <div className="font-heading text-2xl font-bold text-gold mb-2">
              02
            </div>
            <h3 className="font-semibold text-lg text-navy mb-3">
              Book & Pay
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Select your date, choose the number of guests, and pay securely
              through Stripe. No hidden fees.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
              <Anchor className="h-7 w-7 text-ocean" />
            </div>
            <div className="font-heading text-2xl font-bold text-gold mb-2">
              03
            </div>
            <h3 className="font-semibold text-lg text-navy mb-3">Enjoy</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Meet your host at the dock and enjoy your water experience. Leave a
              review when you&apos;re done!
            </p>
          </div>
        </div>
        <div className="text-center mt-10">
          <Button
            asChild
            size="lg"
            className="rounded-full bg-ocean hover:bg-ocean-dark text-white px-8 h-12 text-base"
          >
            <Link href="/search">Start Exploring</Link>
          </Button>
        </div>
      </section>

      {/* For Hosts */}
      <section className="bg-cream py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-10 text-center">
            For Hosts
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
                <Ship className="h-7 w-7 text-ocean" />
              </div>
              <div className="font-heading text-2xl font-bold text-gold mb-2">
                01
              </div>
              <h3 className="font-semibold text-lg text-navy mb-3">
                List Your Boat
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Create a listing with photos, pricing, and details about your
                boat and experience.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
                <Star className="h-7 w-7 text-ocean" />
              </div>
              <div className="font-heading text-2xl font-bold text-gold mb-2">
                02
              </div>
              <h3 className="font-semibold text-lg text-navy mb-3">
                Host Guests
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Accept booking requests, welcome guests aboard, and deliver
                amazing experiences.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center hover:shadow-xl transition-shadow duration-300">
              <div className="w-14 h-14 rounded-xl bg-ocean/10 flex items-center justify-center mx-auto mb-5">
                <Shield className="h-7 w-7 text-ocean" />
              </div>
              <div className="font-heading text-2xl font-bold text-gold mb-2">
                03
              </div>
              <h3 className="font-semibold text-lg text-navy mb-3">
                Get Paid
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Receive payments directly to your bank account through Stripe
                Connect. Fast and secure.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-navy text-navy hover:bg-navy hover:text-white px-8 h-12 text-base"
            >
              <Link href="/become-a-host">Become a Host</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
