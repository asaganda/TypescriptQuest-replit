import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  challengeCount: number;
}

interface LessonListProps {
  lessons: Lesson[];
  onLessonClick: (lessonId: string) => void;
  currentLessonId?: string;
}

export default function LessonList({ lessons, onLessonClick, currentLessonId }: LessonListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lessons.map((lesson) => {
            const isCurrent = lesson.id === currentLessonId;
            
            return (
              <Button
                key={lesson.id}
                variant={isCurrent ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-auto py-3 px-4"
                onClick={() => !lesson.isLocked && onLessonClick(lesson.id)}
                disabled={lesson.isLocked}
                data-testid={`button-lesson-${lesson.id}`}
              >
                <div className="flex flex-wrap items-center gap-3 flex-1 text-left">
                  {lesson.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-chart-2 flex-shrink-0" />
                  ) : lesson.isLocked ? (
                    <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{lesson.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {lesson.description}
                    </div>
                  </div>
                  <Badge variant="outline" className="flex-shrink-0">
                    {lesson.challengeCount} challenges
                  </Badge>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
