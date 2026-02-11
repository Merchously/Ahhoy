import { Ship, DollarSign, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Become a Host",
};

export default function BecomeAHostPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Turn Your Boat Into Income
          </h1>
          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join Ahhoy as a host and start earning by sharing your boat and
            creating unforgettable water experiences.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-gold hover:bg-gold/90 text-navy font-semibold px-8 h-12 text-base"
          >
            <Link href="/register?host=true">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-navy text-center mb-14">
          Why Host on Ahhoy?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-ocean transition-colors duration-300">
              <DollarSign className="h-8 w-8 text-ocean group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-lg text-navy mb-2">
              Earn Extra Income
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Set your own prices and earn money from your boat when you&apos;re
              not using it.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-ocean transition-colors duration-300">
              <Calendar className="h-8 w-8 text-ocean group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-lg text-navy mb-2">
              Flexible Schedule
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              You choose when you&apos;re available. Block off dates whenever
              you want.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-ocean transition-colors duration-300">
              <Users className="h-8 w-8 text-ocean group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-lg text-navy mb-2">
              Meet New People
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Connect with guests from around the world who share your love for
              the water.
            </p>
          </div>
          <div className="text-center group">
            <div className="w-16 h-16 rounded-2xl bg-ocean/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-ocean transition-colors duration-300">
              <Ship className="h-8 w-8 text-ocean group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="font-semibold text-lg text-navy mb-2">
              Easy to Manage
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Our dashboard makes it simple to manage listings, bookings, and
              earnings.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-navy mb-4">
            Ready to start hosting?
          </h2>
          <p className="text-gray-500 mb-8 text-lg">
            Sign up in minutes and create your first listing today.
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-ocean hover:bg-ocean-dark text-white px-8 h-12 text-base"
          >
            <Link href="/register?host=true">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
