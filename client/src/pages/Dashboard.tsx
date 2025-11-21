import DashboardStats from "@/components/DashboardStats";
import BadgeShowcase from "@/components/BadgeShowcase";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserStats, getBadges } from "@/lib/api";

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: getUserStats,
  });

  const { data: badges } = useQuery({
    queryKey: ["/api/badges"],
    queryFn: getBadges,
  });

  if (!stats || !badges) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const xpThresholds = [0, 200, 500];
  const currentLevelIndex = stats.currentLevel - 1;
  const nextLevelXP = xpThresholds[currentLevelIndex + 1] || 1000;
  const badgesEarned = badges.filter(b => b.earned).length;

  const badgesForShowcase = badges.map(badge => ({
    id: badge.id,
    name: badge.name,
    description: badge.description,
    icon: badge.icon as "trophy" | "zap" | "target" | "star" | "book",
    earned: badge.earned || false,
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="heading-welcome">
            Welcome back, {user?.displayName}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your TypeScript learning journey
          </p>
        </div>

        <DashboardStats
          totalXP={stats.totalXP}
          xpToNextLevel={nextLevelXP}
          currentLevel={stats.currentLevel}
          lessonsCompleted={stats.lessonsCompleted}
          challengesCompleted={stats.challengesCompleted}
          badgesEarned={badgesEarned}
        />

        <BadgeShowcase badges={badgesForShowcase} />
      </div>
    </div>
  );
}
