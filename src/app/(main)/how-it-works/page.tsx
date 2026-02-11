import { Search, CreditCard, Anchor, Ship, Star, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">How Ahhoy Works</h1>
      <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
        Whether you&apos;re looking for an unforgettable day on the water or want
        to share your boat with others, Ahhoy makes it simple.
      </p>

      {/* For Guests */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">For Guests</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center p-6">
              <Search className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">1. Discover</h3>
              <p className="text-sm text-muted-foreground">
                Browse water experiences by location, activity type, or date.
                Filter by price, capacity, and more.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <CreditCard className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">2. Book & Pay</h3>
              <p className="text-sm text-muted-foreground">
                Select your date, choose the number of guests, and pay securely
                through Stripe. No hidden fees.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <Anchor className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">3. Enjoy</h3>
              <p className="text-sm text-muted-foreground">
                Meet your host at the dock and enjoy your water experience.
                Leave a review when you&apos;re done!
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Button asChild size="lg">
            <Link href="/search">Start Exploring</Link>
          </Button>
        </div>
      </section>

      {/* For Hosts */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">For Hosts</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="text-center p-6">
              <Ship className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">1. List Your Boat</h3>
              <p className="text-sm text-muted-foreground">
                Create a listing with photos, pricing, and details about your
                boat and experience.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <Star className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">2. Host Guests</h3>
              <p className="text-sm text-muted-foreground">
                Accept booking requests, welcome guests aboard, and deliver
                amazing experiences.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="text-center p-6">
              <Shield className="h-10 w-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">3. Get Paid</h3>
              <p className="text-sm text-muted-foreground">
                Receive payments directly to your bank account through Stripe
                Connect. Fast and secure.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center mt-8">
          <Button asChild size="lg" variant="outline">
            <Link href="/become-a-host">Become a Host</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
