import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Zap, Target, Star, BookOpen, Lock } from "lucide-react";

interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: "trophy" | "zap" | "target" | "star" | "book";
  earned: boolean;
}

interface BadgeShowcaseProps {
  badges: BadgeData[];
}

const iconMap = {
  trophy: Trophy,
  zap: Zap,
  target: Target,
  star: Star,
  book: BookOpen,
};

export default function BadgeShowcase({ badges }: BadgeShowcaseProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Achievements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {badges.map((badge) => {
            const Icon = iconMap[badge.icon];
            return (
              <div
                key={badge.id}
                className="flex flex-col items-center gap-2 p-4 rounded-md hover-elevate"
                data-testid={`badge-${badge.id}`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    badge.earned
                      ? "bg-primary/10"
                      : "bg-muted"
                  }`}
                >
                  {badge.earned ? (
                    <Icon className="w-8 h-8 text-primary" />
                  ) : (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${badge.earned ? "" : "text-muted-foreground"}`}>
                    {badge.name}
                  </p>
                  {badge.earned && (
                    <Badge variant="secondary" className="mt-1 text-xs">
                      Earned
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
