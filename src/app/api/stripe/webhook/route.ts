import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "CONFIRMED",
            stripePaymentIntentId: session.payment_intent as string,
          },
        });
      }
      break;
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "PAID" },
        });
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const bookingId = paymentIntent.metadata?.bookingId;

      if (bookingId) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: "PENDING" },
        });
      }
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = charge.payment_intent as string;

      if (paymentIntentId) {
        const booking = await prisma.booking.findUnique({
          where: { stripePaymentIntentId: paymentIntentId },
        });

        if (booking) {
          await prisma.booking.update({
            where: { id: booking.id },
            data: { status: "REFUNDED" },
          });
        }
      }
      break;
    }

    case "account.updated": {
      const account = event.data.object as Stripe.Account;

      if (account.charges_enabled && account.payouts_enabled) {
        await prisma.user.updateMany({
          where: { stripeConnectId: account.id },
          data: { stripeOnboardingComplete: true },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
