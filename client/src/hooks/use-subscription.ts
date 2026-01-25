import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";

interface SubscriptionConfig {
  isConfigured: boolean;
  publishableKey: string | null;
  pricing: {
    monthly: { amount: number; displayPrice: string; interval: string; name: string; description: string };
    annual: { amount: number; displayPrice: string; interval: string; name: string; description: string; savings: string };
  };
  paywallLevel: number;
}

interface Subscription {
  id?: string;
  userId?: string;
  status: "active" | "canceled" | "past_due" | "inactive";
  planType: "free" | "monthly" | "annual" | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  hasPremiumAccess: boolean;
}

interface AccessCheckResult {
  levelId: string;
  levelOrder: number;
  hasAccess: boolean;
  reason?: "free_level" | "active_subscription" | "admin" | "premium_access";
  requiresSubscription: boolean;
  subscriptionStatus?: string;
}

export function useSubscriptionConfig() {
  return useQuery<SubscriptionConfig>({
    queryKey: ["/api/subscription/config"],
    queryFn: () => apiRequest<SubscriptionConfig>("/api/subscription/config"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSubscription() {
  return useQuery<Subscription>({
    queryKey: ["/api/subscription"],
    queryFn: () => apiRequest<Subscription>("/api/subscription"),
    staleTime: 60 * 1000, // 1 minute
  });
}

export function useLevelAccess(levelId: string) {
  return useQuery<AccessCheckResult>({
    queryKey: ["/api/access/level", levelId],
    queryFn: () => apiRequest<AccessCheckResult>(`/api/access/level/${levelId}`),
    enabled: !!levelId,
  });
}

export function useCreateCheckout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planType: "monthly" | "annual") => {
      const result = await apiRequest<{ checkoutUrl: string }>("/api/subscription/create-checkout", {
        method: "POST",
        body: JSON.stringify({ planType }),
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiRequest<{ success: boolean; message: string }>("/api/subscription/cancel", {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subscription"] });
    },
  });
}

export function useSubscriptionPortal() {
  return useMutation({
    mutationFn: async () => {
      const result = await apiRequest<{ portalUrl: string }>("/api/subscription/portal", {
        method: "POST",
      });
      return result;
    },
  });
}

/**
 * Helper hook to determine if user has access to premium content.
 * Returns true if user has active subscription, is admin, or has premium access.
 */
export function useHasPremiumAccess() {
  const { data: subscription, isLoading } = useSubscription();

  const hasPremiumAccess =
    subscription?.status === "active" ||
    subscription?.hasPremiumAccess === true;

  return {
    hasPremiumAccess,
    isLoading,
    subscription,
  };
}
