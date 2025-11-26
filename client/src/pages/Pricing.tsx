import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Pricing() {
  const { toast } = useToast();

  const handleSubscribe = (plan: string) => {
    toast({
      title: "Payment Integration Pending",
      description: "Stripe API keys need to be configured to enable payments. Contact support for manual setup.",
    });
  };

  const plans = [
    {
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
      cta: "Current Plan",
      disabled: true,
    },
    {
      name: "Pro Monthly",
      price: "$9",
      period: "per month",
      description: "Unlock your full learning potential",
      features: [
        "Access to all 4 levels",
        "All lessons and challenges",
        "Advanced code challenges",
        "Priority support",
        "Exclusive badges",
        "Cancel anytime",
      ],
      cta: "Subscribe",
      disabled: false,
      highlighted: true,
    },
    {
      name: "Pro Annual",
      price: "$89",
      period: "per year",
      description: "Best value - save $19!",
      features: [
        "Everything in Pro Monthly",
        "Save over 15%",
        "Annual subscription",
        "Priority support",
      ],
      cta: "Subscribe",
      disabled: false,
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" data-testid="text-page-title">Choose Your Plan</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto" data-testid="text-page-subtitle">
            Start learning TypeScript for free, or unlock all content with Pro
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={plan.highlighted ? "border-primary shadow-lg" : ""}
              data-testid={`card-plan-${plan.name.toLowerCase().replace(" ", "-")}`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-semibold rounded-t-md" data-testid="text-most-popular">
                  Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle data-testid={`text-plan-name-${plan.name.toLowerCase().replace(" ", "-")}`}>{plan.name}</CardTitle>
                <CardDescription data-testid={`text-plan-description-${plan.name.toLowerCase().replace(" ", "-")}`}>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold" data-testid={`text-plan-price-${plan.name.toLowerCase().replace(" ", "-")}`}>{plan.price}</span>
                  <span className="text-muted-foreground ml-2" data-testid={`text-plan-period-${plan.name.toLowerCase().replace(" ", "-")}`}>/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={feature} className="flex items-start gap-2" data-testid={`text-feature-${plan.name.toLowerCase().replace(" ", "-")}-${index}`}>
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  onClick={() => handleSubscribe(plan.name)}
                  disabled={plan.disabled}
                  variant={plan.highlighted ? "default" : "outline"}
                  data-testid={`button-subscribe-${plan.name.toLowerCase().replace(" ", "-")}`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-2" data-testid="text-setup-title">Setup Required</h2>
          <p className="text-muted-foreground" data-testid="text-setup-description">
            Stripe integration is ready but requires API keys to be configured. 
            Add <code className="bg-background px-2 py-1 rounded text-sm">STRIPE_SECRET_KEY</code> and{" "}
            <code className="bg-background px-2 py-1 rounded text-sm">STRIPE_PUBLISHABLE_KEY</code> as secrets
            to enable payments.
          </p>
        </div>
      </div>
    </div>
  );
}
