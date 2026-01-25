import ProfileCard from "@/components/ProfileCard";
import SubscriptionCard from "@/components/SubscriptionCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Flame } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getUserStats, getUserProgress } from "@/lib/api";

export default function Profile() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: getUserStats,
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/progress"],
    queryFn: getUserProgress,
  });

  if (!stats || !progress || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const statsDisplay = [
    { label: "Current Streak", value: "1 day", icon: Flame, color: "text-chart-5" },
    { label: "Lessons Completed", value: stats.lessonsCompleted.toString(), icon: Target, color: "text-chart-2" },
    { label: "Total XP", value: stats.totalXP.toString(), icon: TrendingUp, color: "text-chart-1" }
  ];

  const recentActivity = progress
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 5)
    .map(p => {
      const time = new Date(p.completedAt);
      const now = new Date();
      const diffMs = now.getTime() - time.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      let timeAgo = "";
      if (diffDays > 0) timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      else if (diffHours > 0) timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      else timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

      return {
        action: p.lessonId ? "Completed lesson" : "Solved challenge",
        title: p.lessonId || p.challengeId || "Unknown",
        time: timeAgo,
        xp: p.lessonId ? 20 : 30
      };
    });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="heading-profile">
            Your Profile
          </h1>
          <p className="text-muted-foreground text-lg">
            Track your learning progress and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <ProfileCard
              displayName={user.displayName}
              email={user.email}
              joinDate={joinDate}
              currentLevel={stats.currentLevel}
              totalXP={stats.totalXP}
            />
            <SubscriptionCard />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {statsDisplay.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {recentActivity.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between py-3 border-b last:border-0"
                        data-testid={`activity-${index}`}
                      >
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.title}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {activity.xp > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              +{activity.xp} XP
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
