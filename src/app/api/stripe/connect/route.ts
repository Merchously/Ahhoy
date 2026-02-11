import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const session = await auth();

  if (!session?.user || session.user.role !== "HOST") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  let connectAccountId = user.stripeConnectId;

  // Create Stripe Connect account if not exists
  if (!connectAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      metadata: { userId: user.id },
    });

    connectAccountId = account.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeConnectId: account.id },
    });
  }

  // Create account link for onboarding
  const accountLink = await stripe.accountLinks.create({
    account: connectAccountId,
    refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stripe-onboarding?refresh=true`,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/stripe-onboarding?success=true`,
    type: "account_onboarding",
  });

  return NextResponse.json({ url: accountLink.url });
}
