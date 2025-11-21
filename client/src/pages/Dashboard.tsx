import DashboardStats from "@/components/DashboardStats";
import BadgeShowcase from "@/components/BadgeShowcase";

export default function Dashboard() {
  const badges = [
    { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "book" as const, earned: true },
    { id: "five-challenges", name: "Problem Solver", description: "Solve 5 challenges", icon: "zap" as const, earned: true },
    { id: "no-hints", name: "Pure Skill", description: "Complete a lesson without hints", icon: "trophy" as const, earned: true },
    { id: "perfect-score", name: "Perfectionist", description: "Get 100% on a challenge", icon: "star" as const, earned: false },
    { id: "speed-demon", name: "Speed Demon", description: "Complete a challenge in under 1 minute", icon: "target" as const, earned: false },
    { id: "level-master", name: "Level Master", description: "Complete all lessons in a level", icon: "trophy" as const, earned: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="heading-welcome">
            Welcome back, Alex!
          </h1>
          <p className="text-muted-foreground text-lg">
            Continue your TypeScript learning journey
          </p>
        </div>

        <DashboardStats
          totalXP={450}
          xpToNextLevel={600}
          currentLevel={2}
          lessonsCompleted={8}
          challengesCompleted={15}
          badgesEarned={3}
        />

        <BadgeShowcase badges={badges} />
      </div>
    </div>
  );
}
