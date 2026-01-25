import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscriptionConfig, useSubscription, useCreateCheckout } from "@/hooks/use-subscription";
import { useAuth } from "@/lib/auth";
import { useLocation, useSearch } from "wouter";
import { useEffect } from "react";

export default function Pricing() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { data: config, isLoading: configLoading } = useSubscriptionConfig();
  const { data: subscription } = useSubscription();
  const createCheckout = useCreateCheckout();

  // Handle success/cancel URL params
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("subscription") === "success") {
      toast({
        title: "Welcome to Pro!",
        description: "Your subscription is now active. Enjoy all the content!",
      });
    } else if (params.get("subscription") === "canceled") {
      toast({
        title: "Checkout canceled",
        description: "No worries - you can subscribe anytime.",
        variant: "destructive",
      });
    }
  }, [search, toast]);

  const handleSubscribe = async (planType: "monthly" | "annual") => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    if (!config?.isConfigured) {
      toast({
        title: "Payment Integration Pending",
        description: "Stripe API keys need to be configured to enable payments.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { checkoutUrl } = await createCheckout.mutateAsync(planType);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start checkout",
        variant: "destructive",
      });
    }
  };

  const isSubscribed = subscription?.status === "active";
  const hasPremiumAccess = subscription?.hasPremiumAccess;
  const isPending = createCheckout.isPending;

  const plans = [
    {
      id: "free" as const,
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started",
      features: [
        "Access to Level 1: TypeScript Basics",
        "Basic challenges and lessons",
        "Track your progress",
        "Earn badges",
      ],
      cta: hasPremiumAccess ? "Premium Access" : isSubscribed ? "Downgrade" : "Current Plan",
      disabled: true,
      planType: null as null,
    },
    {
      id: "monthly" as const,
      name: config?.pricing?.monthly?.name || "Pro Monthly",
      price: config?.pricing?.monthly?.displayPrice || "$5",
      period: "per month",
      description: config?.pricing?.monthly?.description || "Unlock your full learning potential",
      features: [
        "Access to all 4 levels",
        "All lessons and challenges",
        "Advanced code challenges",
        "Priority support",
        "Exclusive badges",
        "Cancel anytime",
      ],
      cta: isSubscribed && subscription?.planType === "monthly" ? "Current Plan" : "Subscribe",
      disabled: (isSubscribed && subscription?.planType === "monthly") || hasPremiumAccess,
      highlighted: true,
      planType: "monthly" as const,
    },
    {
      id: "annual" as const,
      name: config?.pricing?.annual?.name || "Pro Annual",
      price: config?.pricing?.annual?.displayPrice || "$50",
      period: "per year",
      description: `Best value - save ${config?.pricing?.annual?.savings || "$10"}!`,
      features: [
        "Everything in Pro Monthly",
        "Save over 15%",
        "Annual subscription",
        "Priority support",
      ],
      cta: isSubscribed && subscription?.planType === "annual" ? "Current Plan" : "Subscribe",
      disabled: (isSubscribed && subscription?.planType === "annual") || hasPremiumAccess,
      planType: "annual" as const,
    },
  ];

  if (configLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-page-subtitle">
            Start learning TypeScript for free, or unlock all content with Pro
          </p>
        </div>

        {hasPremiumAccess && (
          <div className="bg-primary/10 border border-primary rounded-lg p-4 mb-8 text-center">
            <p className="text-primary font-medium">
              You have premium access! Enjoy all content for free.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={plan.highlighted ? "border-primary shadow-lg" : ""}
              data-testid={`card-plan-${plan.id}`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-semibold rounded-t-md" data-testid="text-most-popular">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle data-testid={`text-plan-name-${plan.id}`}>{plan.name}</CardTitle>
                <CardDescription data-testid={`text-plan-description-${plan.id}`}>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold" data-testid={`text-plan-price-${plan.id}`}>{plan.price}</span>
                  <span className="text-muted-foreground ml-2" data-testid={`text-plan-period-${plan.id}`}>/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={feature} className="flex items-start gap-2" data-testid={`text-feature-${plan.id}-${index}`}>
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => plan.planType && handleSubscribe(plan.planType)}
                  disabled={plan.disabled || isPending}
                  variant={plan.highlighted ? "default" : "outline"}
                  data-testid={`button-subscribe-${plan.id}`}
                >
                  {isPending && plan.planType ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!config?.isConfigured && (
          <div className="bg-muted rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold mb-2" data-testid="text-setup-title">Setup Required</h2>
            <p className="text-muted-foreground" data-testid="text-setup-description">
              Stripe integration is ready but requires API keys to be configured.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
