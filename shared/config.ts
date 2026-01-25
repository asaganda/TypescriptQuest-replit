// Paywall configuration - which level requires payment
export const PAYWALL_CONFIG = {
  // Level order number where paywall starts (Level 1 is free, Level 2+ requires subscription)
  paywallStartsAtLevel: 2,
} as const;

// Pricing configuration
export const PRICING_CONFIG = {
  monthly: {
    amount: 500, // $5.00 in cents
    displayPrice: "$5",
    interval: "month" as const,
    name: "Pro Monthly",
    description: "Unlock all levels with monthly billing",
  },
  annual: {
    amount: 5000, // $50.00 in cents
    displayPrice: "$50",
    interval: "year" as const,
    name: "Pro Annual",
    description: "Best value - save $10 per year",
    savings: "$10",
  },
} as const;

export type PlanType = "free" | "monthly" | "annual";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "inactive";
