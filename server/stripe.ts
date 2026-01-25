import Stripe from "stripe";

// Lazy initialization to allow graceful degradation when Stripe isn't configured
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }

  return stripeInstance;
}

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_PUBLISHABLE_KEY &&
    process.env.STRIPE_MONTHLY_PRICE_ID &&
    process.env.STRIPE_ANNUAL_PRICE_ID
  );
}

export function getStripePublishableKey(): string | null {
  return process.env.STRIPE_PUBLISHABLE_KEY || null;
}

export function getStripePriceId(planType: "monthly" | "annual"): string | null {
  if (planType === "monthly") {
    return process.env.STRIPE_MONTHLY_PRICE_ID || null;
  }
  return process.env.STRIPE_ANNUAL_PRICE_ID || null;
}
