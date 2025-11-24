import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Code, Trophy, Award } from "lucide-react";
import { XP_THRESHOLDS } from "@shared/xp-utils";

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
  // Calculate XP progress within current level
  const currentLevelIndex = currentLevel - 1;
  const currentLevelStartXP = XP_THRESHOLDS[currentLevelIndex] || 0;
  const isMaxLevel = currentLevel >= XP_THRESHOLDS.length;
  
  // Handle max level case
  let xpEarnedInLevel: number;
  let xpRangeForLevel: number;
  let xpNeededForNextLevel: number;
  let progressPercentage: number;
  
  if (isMaxLevel) {
    // User is at max level - show 100% completion with normalized values
    const xpInLevel = totalXP - currentLevelStartXP;
    xpEarnedInLevel = xpInLevel || 1; // Normalize to at least 1 for display
    xpRangeForLevel = xpInLevel || 1; // Same as earned to show full completion
    xpNeededForNextLevel = 0;
    progressPercentage = 100;
  } else {
    // Normal level progression
    xpEarnedInLevel = totalXP - currentLevelStartXP;
    xpRangeForLevel = xpToNextLevel - currentLevelStartXP;
    xpNeededForNextLevel = Math.max(0, xpToNextLevel - totalXP);
    progressPercentage = Math.max(0, Math.min(100, (xpEarnedInLevel / xpRangeForLevel) * 100));
  }

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
          <CardTitle className="text-lg">
            {isMaxLevel ? "Max Level Achieved!" : `Progress to Level ${currentLevel + 1}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Level {currentLevel}</span>
            {isMaxLevel ? (
              <span className="font-semibold">{totalXP} XP Total</span>
            ) : (
              <span className="font-semibold">{xpEarnedInLevel} / {xpRangeForLevel} XP</span>
            )}
          </div>
          <Progress value={progressPercentage} className="h-3" data-testid="progress-level" />
          <p className="text-sm text-muted-foreground">
            {isMaxLevel 
              ? "You've mastered all levels! Keep learning and earning XP."
              : `${xpNeededForNextLevel} XP needed to unlock the next level`
            }
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
