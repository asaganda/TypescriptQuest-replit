import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Lock, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface PaywallBannerProps {
  variant?: "inline" | "full";
  levelName?: string;
}

export function PaywallBanner({ variant = "inline", levelName }: PaywallBannerProps) {
  if (variant === "full") {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="bg-primary/10 rounded-full p-4 mb-4">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {levelName ? `${levelName} is a Pro Level` : "Pro Content"}
        </h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Upgrade to Pro to unlock all levels, lessons, and challenges. Continue your TypeScript mastery journey!
        </p>
        <Link href="/pricing">
          <Button className="gap-2">
            Upgrade to Pro
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Crown className="w-5 h-5 text-primary" />
        <span className="text-sm font-medium">
          Unlock all content with Pro
        </span>
      </div>
      <Link href="/pricing">
        <Button size="sm" className="gap-2">
          Upgrade
          <ArrowRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}

export function ProBadge() {
  return (
    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 gap-1">
      <Crown className="w-3 h-3" />
      PRO
    </Badge>
  );
}
