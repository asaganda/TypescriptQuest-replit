import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useSubscription, useSubscriptionPortal, useCancelSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";

export default function SubscriptionCard() {
  const { data: subscription, isLoading } = useSubscription();
  const portalMutation = useSubscriptionPortal();
  const cancelMutation = useCancelSubscription();
  const { toast } = useToast();

  const handleManageBilling = async () => {
    try {
      const { portalUrl } = await portalMutation.mutateAsync();
      if (portalUrl) {
        window.location.href = portalUrl;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to open billing portal",
        variant: "destructive",
      });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync();
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will remain active until the end of the billing period.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  const isActive = subscription?.status === "active";
  const hasPremiumAccess = subscription?.hasPremiumAccess;
  const planType = subscription?.planType;
  const periodEnd = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  // Premium access without subscription (friends/testers)
  if (hasPremiumAccess && !isActive) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Premium Access
            </CardTitle>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              Active
            </Badge>
          </div>
          <CardDescription>
            You have full access to all content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You have been granted premium access. Enjoy all levels and lessons!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Active subscription
  if (isActive) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-500" />
              Pro {planType === "annual" ? "Annual" : "Monthly"}
            </CardTitle>
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
              Active
            </Badge>
          </div>
          <CardDescription>
            Full access to all levels and content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {periodEnd && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {subscription?.cancelAtPeriodEnd
                ? `Access until ${periodEnd}`
                : `Renews on ${periodEnd}`
              }
            </div>
          )}

          {subscription?.cancelAtPeriodEnd && (
            <p className="text-sm text-amber-600">
              Your subscription is set to cancel at the end of the billing period.
            </p>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleManageBilling}
              disabled={portalMutation.isPending}
            >
              {portalMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ExternalLink className="w-4 h-4" />
              )}
              Manage Billing
            </Button>
            {!subscription?.cancelAtPeriodEnd && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Cancel"
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // No subscription - show upgrade prompt
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription</CardTitle>
        <CardDescription>
          Upgrade to Pro to unlock all content
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You're on the free plan. Upgrade to access all 4 levels, advanced challenges, and exclusive content.
        </p>
        <Link href="/pricing">
          <Button className="gap-2">
            <Crown className="w-4 h-4" />
            Upgrade to Pro
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
