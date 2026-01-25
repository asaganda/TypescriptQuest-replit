import { storage } from "../storage";
import { PAYWALL_CONFIG } from "@shared/config";

export interface AccessCheckResult {
  hasAccess: boolean;
  reason?: "free_level" | "active_subscription" | "admin" | "premium_access";
  requiresSubscription: boolean;
  subscriptionStatus?: string;
}

/**
 * Check if a user can access a specific level based on their subscription status.
 *
 * Access is granted if ANY of the following are true:
 * 1. User is an admin
 * 2. User has hasPremiumAccess = true (friends/testers)
 * 3. Level is below the paywall (free tier)
 * 4. User has an active subscription
 *
 * No grace period - if subscription is not active, access is blocked immediately.
 */
export async function checkLevelAccess(
  userId: string,
  levelOrder: number
): Promise<AccessCheckResult> {
  // Check if user is admin or has premium access
  const user = await storage.getUser(userId);

  if (user?.isAdmin) {
    return { hasAccess: true, reason: "admin", requiresSubscription: false };
  }

  if (user?.hasPremiumAccess) {
    return { hasAccess: true, reason: "premium_access", requiresSubscription: false };
  }

  // Check if this level is free (below paywall)
  if (levelOrder < PAYWALL_CONFIG.paywallStartsAtLevel) {
    return { hasAccess: true, reason: "free_level", requiresSubscription: false };
  }

  // Level requires subscription - check subscription status
  const subscription = await storage.getSubscription(userId);

  if (!subscription || subscription.status === "inactive") {
    return {
      hasAccess: false,
      requiresSubscription: true,
      subscriptionStatus: "inactive",
    };
  }

  // Only active subscriptions grant access - no grace period
  if (subscription.status === "active") {
    // Check if subscription has ended (extra safety check)
    if (subscription.currentPeriodEnd && new Date() > subscription.currentPeriodEnd) {
      return {
        hasAccess: false,
        requiresSubscription: true,
        subscriptionStatus: "expired",
      };
    }

    return {
      hasAccess: true,
      reason: "active_subscription",
      requiresSubscription: true,
      subscriptionStatus: "active",
    };
  }

  // For any other status (past_due, canceled, etc.) - no access
  return {
    hasAccess: false,
    requiresSubscription: true,
    subscriptionStatus: subscription.status,
  };
}
