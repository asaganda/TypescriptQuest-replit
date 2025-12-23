import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Lock, ChevronRight, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/auth";

interface Lesson {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isLocked: boolean;
  challengeCount: number;
  challenges: {
    id: string;
    isCompleted: boolean;
  }[];
}

interface LessonListProps {
  lessons: Lesson[];
  onLessonClick: (lessonId: string) => void;
  currentLessonId?: string;
}

export default function LessonList({ lessons, onLessonClick, currentLessonId }: LessonListProps) {
  const [openLessonId, setOpenLessonId] = useState<string | null>(null);
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lessons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {lessons.map((lesson) => {
            const isCurrent = lesson.id === currentLessonId;
            const isOpen = openLessonId === lesson.id;
            const isLockedForUser = lesson.isLocked && !user?.isAdmin;

            return (
              <Button
                key={lesson.id}
                variant={isCurrent ? "secondary" : "ghost"}
                className="w-full justify-start gap-3 h-auto py-3 px-4"
                onClick={() => !isLockedForUser && onLessonClick(lesson.id)}
                disabled={isLockedForUser}
                data-testid={`button-lesson-${lesson.id}`}
              >
                <div className="flex flex-col md:flex-row lg:flex-col gap-3 flex-1 text-left">
                  <div className="flex items-center gap-3 md:flex-1 min-w-0">
                    {lesson.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-chart-2 flex-shrink-0" />
                    ) : lesson.isLocked ? (
                      <Lock className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0 whitespace-normal">
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {lesson.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Badge
                      variant="outline"
                      className="flex-shrink-0 self-start md:self-center lg:self-start cursor-pointer flex items-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenLessonId(isOpen ? null : lesson.id);
                      }}
                    >
                      <span>{lesson.challengeCount} challenges</span>
                      {isOpen ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </Badge>

                    {isOpen && lesson.challenges && lesson.challenges.length > 0 && (
                      <div
                        className="mt-1 border border-border rounded-md bg-muted/40 px-3 py-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ul className="space-y-1">
                          {lesson.challenges.map((challenge, index) => (
                            <li
                              key={challenge.id}
                              className="flex items-center justify-between text-xs text-muted-foreground"
                            >
                              <div className="flex items-center gap-2">
                                {challenge.isCompleted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-chart-2" />
                                ) : (
                                  <Circle className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                                <span>Challenge {index + 1}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
