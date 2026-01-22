import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Code, Trophy, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { XP_THRESHOLDS } from "@shared/xp-utils";

interface DashboardStatsProps {
  totalXP: number;
  xpToNextLevel: number;
  currentLevel: number;
  lessonsCompleted: number;
  challengesCompleted: number;
  badgesEarned: number;
  completedChallengesInLevel: number;
  totalChallengesInLevel: number;
}

export default function DashboardStats({
  totalXP,
  xpToNextLevel,
  currentLevel,
  lessonsCompleted,
  challengesCompleted,
  badgesEarned,
  completedChallengesInLevel,
  totalChallengesInLevel
}: DashboardStatsProps) {
  // Calculate completion-based progress for current level
  const isMaxLevel = currentLevel >= XP_THRESHOLDS.length;

  // Calculate progress percentage based on challenge completion
  let progressPercentage: number;
  let challengesRemaining: number;

  if (isMaxLevel) {
    // User is at max level - show 100% completion
    progressPercentage = 100;
    challengesRemaining = 0;
  } else if (totalChallengesInLevel === 0) {
    // No challenges in this level yet
    progressPercentage = 0;
    challengesRemaining = 0;
  } else {
    // Normal level progression based on challenges completed
    progressPercentage = Math.max(0, Math.min(100, (completedChallengesInLevel / totalChallengesInLevel) * 100));
    challengesRemaining = totalChallengesInLevel - completedChallengesInLevel;
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
            {isMaxLevel ? "Max Level Achieved!" : `Level ${currentLevel} Progress`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Level {currentLevel}</span>
            {isMaxLevel ? (
              <span className="font-semibold">{totalXP} XP Total</span>
            ) : (
              <span className="font-semibold">{completedChallengesInLevel} / {totalChallengesInLevel} Challenges</span>
            )}
          </div>
          <Progress value={progressPercentage} className="h-3" data-testid="progress-level" />
          <p className="text-sm text-muted-foreground">
            {isMaxLevel
              ? "You've mastered all levels! Keep learning and earning XP."
              : challengesRemaining === 0
                ? "Level complete! Next level unlocked."
                : `${challengesRemaining} ${challengesRemaining === 1 ? 'challenge' : 'challenges'} remaining to unlock the next level`
            }
          </p>
          {challengesCompleted === 0 && (
            <Link href="/level/1/lesson/1-1">
              <Button className="gap-2 mt-4">
                Start First Lesson
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
