import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Code, Trophy, Award } from "lucide-react";

interface DashboardStatsProps {
  totalXP: number;
  xpToNextLevel: number;
  currentLevel: number;
  lessonsCompleted: number;
  challengesCompleted: number;
  badgesEarned: number;
}

export default function DashboardStats({
  totalXP,
  xpToNextLevel,
  currentLevel,
  lessonsCompleted,
  challengesCompleted,
  badgesEarned
}: DashboardStatsProps) {
  const progressPercentage = (totalXP / xpToNextLevel) * 100;

  const stats = [
    {
      title: "Total XP",
      value: totalXP,
      icon: Trophy,
      color: "text-chart-1"
    },
    {
      title: "Lessons Completed",
      value: lessonsCompleted,
      icon: BookOpen,
      color: "text-chart-2"
    },
    {
      title: "Challenges Solved",
      value: challengesCompleted,
      icon: Code,
      color: "text-chart-3"
    },
    {
      title: "Badges Earned",
      value: badgesEarned,
      icon: Award,
      color: "text-chart-4"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} data-testid={`card-stat-${index}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid={`text-stat-value-${index}`}>
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Progress to Level {currentLevel + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Level {currentLevel}</span>
            <span className="font-semibold">{totalXP} / {xpToNextLevel} XP</span>
          </div>
          <Progress value={progressPercentage} className="h-3" data-testid="progress-level" />
          <p className="text-sm text-muted-foreground">
            {xpToNextLevel - totalXP} XP needed to unlock the next level
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
