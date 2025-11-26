import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "wouter";

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
  onClick
}: LevelCardProps) {
  const lessonToStart = nextLessonId || `${id}-1`;
  return (
    <Card 
      className={`${isLocked ? "opacity-60" : "hover-elevate"} relative`}
      data-testid={`card-level-${id}`}
    >
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
        
        <Link href={`/level/${id}/lesson/${lessonToStart}`}>
          <Button 
            className="w-full gap-2" 
            disabled={isLocked}
            onClick={onClick}
            data-testid={`button-start-level-${id}`}
          >
            {isCompleted ? "Review" : isLocked ? "Locked" : "Continue"}
            {!isLocked && <ArrowRight className="w-4 h-4" />}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
