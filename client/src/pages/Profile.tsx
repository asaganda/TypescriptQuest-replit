import ProfileCard from "@/components/ProfileCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Flame } from "lucide-react";

export default function Profile() {
  const stats = [
    { label: "Current Streak", value: "7 days", icon: Flame, color: "text-chart-5" },
    { label: "Lessons Completed", value: "8", icon: Target, color: "text-chart-2" },
    { label: "Average Score", value: "92%", icon: TrendingUp, color: "text-chart-1" }
  ];

  const recentActivity = [
    { action: "Completed lesson", title: "Union Types", time: "2 hours ago", xp: 20 },
    { action: "Solved challenge", title: "Type Guards", time: "3 hours ago", xp: 30 },
    { action: "Earned badge", title: "Problem Solver", time: "1 day ago", xp: 0 },
    { action: "Completed lesson", title: "Function Types", time: "2 days ago", xp: 20 }
  ];

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
          <div className="lg:col-span-1">
            <ProfileCard
              displayName="Alex Developer"
              email="alex@example.com"
              joinDate="November 2024"
              currentLevel={2}
              totalXP={450}
            />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, index) => {
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
          </div>
        </div>
      </div>
    </div>
  );
}
