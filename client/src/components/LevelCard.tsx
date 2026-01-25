import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { ProBadge } from "@/components/PaywallBanner";

interface LevelCardProps {
  id: string;
  levelNumber: number;
  title: string;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
  completionPercentage: number;
  totalLessons: number;
  nextLessonId?: string | null;
  onClick?: () => void;
  requiresSubscription?: boolean;
  hasSubscription?: boolean;
}

export default function LevelCard({
  id,
  levelNumber,
  title,
  description,
  isLocked,
  isCompleted,
  completionPercentage,
  totalLessons,
  nextLessonId,
  onClick,
  requiresSubscription = false,
  hasSubscription = false,
}: LevelCardProps) {
  const { user } = useAuth();
  const lessonToStart = nextLessonId || `${id}-1`;
  const isAdminBypass = user?.isAdmin && isLocked;
  const isPaywalled = requiresSubscription && !hasSubscription && !user?.isAdmin;

  return (
    <Card
      className={`${isLocked && !user?.isAdmin ? "opacity-60" : "hover-elevate"} relative`}
      data-testid={`card-level-${id}`}
    >
      {isAdminBypass && (
        <Badge className="absolute top-2 right-2 bg-yellow-500 text-black hover:bg-yellow-600">
          ADMIN
        </Badge>
      )}
      {isCompleted && (
        <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
          <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
      
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isCompleted ? "default" : "secondary"} data-testid={`badge-level-${id}`}>
                Level {levelNumber}
              </Badge>
              {requiresSubscription && <ProBadge />}
              {isLocked && <Lock className="w-4 h-4 text-muted-foreground" />}
            </div>
            <CardTitle className={isLocked ? "text-muted-foreground" : ""}>
              {title}
            </CardTitle>
          </div>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{totalLessons} lessons</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" style={{marginBottom: "1em"}} data-testid={`progress-level-${id}`} />
        </div>
        
        {isLocked && !user?.isAdmin ? (
          <Button
            className="w-full gap-2"
            disabled
            data-testid={`button-start-level-${id}`}
          >
            Locked
          </Button>
        ) : isPaywalled ? (
          <Link href="/pricing">
            <Button
              className="w-full gap-2"
              data-testid={`button-start-level-${id}`}
            >
              Upgrade to Pro
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        ) : (
          <Link href={`/level/${id}/lesson/${lessonToStart}`}>
            <Button
              className="w-full gap-2"
              onClick={onClick}
              data-testid={`button-start-level-${id}`}
            >
              {isAdminBypass ? "Access (Admin)" : isCompleted ? "Review" : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
