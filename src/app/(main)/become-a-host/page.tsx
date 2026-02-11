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
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Turn Your Boat Into Income
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join Ahhoy as a host and start earning by sharing your boat and
            creating unforgettable water experiences.
          </p>
          <Button asChild size="lg" variant="secondary" className="text-blue-600">
            <Link href="/register?host=true">Get Started</Link>
          </Button>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Host on Ahhoy?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Earn Extra Income</h3>
            <p className="text-sm text-muted-foreground">
              Set your own prices and earn money from your boat when you&apos;re
              not using it.
            </p>
          </div>
          <div className="text-center">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Flexible Schedule</h3>
            <p className="text-sm text-muted-foreground">
              You choose when you&apos;re available. Block off dates whenever
              you want.
            </p>
          </div>
          <div className="text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Meet New People</h3>
            <p className="text-sm text-muted-foreground">
              Connect with guests from around the world who share your love for
              the water.
            </p>
          </div>
          <div className="text-center">
            <Ship className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Easy to Manage</h3>
            <p className="text-sm text-muted-foreground">
              Our dashboard makes it simple to manage listings, bookings, and
              earnings.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start hosting?</h2>
          <p className="text-muted-foreground mb-8">
            Sign up in minutes and create your first listing today.
          </p>
          <Button asChild size="lg">
            <Link href="/register?host=true">Create Your Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
