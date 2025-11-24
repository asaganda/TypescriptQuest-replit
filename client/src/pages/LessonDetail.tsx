import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getLessonsByLevel, getLesson, getChallengesByLesson, completeChallenge, completeLesson, getUserProgress, type Lesson } from "@/lib/api";
import LessonContent from "@/components/LessonContent";
import LessonList from "@/components/LessonList";
import MultipleChoiceChallenge from "@/components/MultipleChoiceChallenge";
import CodeChallenge from "@/components/CodeChallenge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function LessonDetail() {
  const [, params] = useRoute("/level/:levelId/lesson/:lessonId");
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [usedHintInLesson, setUsedHintInLesson] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { toast } = useToast();

  const lessonId = params?.lessonId || "";
  const levelId = params?.levelId || "";

  const { data: lessons } = useQuery({
    queryKey: ["/api/levels", levelId, "lessons"],
    queryFn: () => getLessonsByLevel(levelId),
    enabled: !!levelId,
  });

  const { data: lesson } = useQuery({
    queryKey: ["/api/lessons", lessonId],
    queryFn: () => getLesson(lessonId),
    enabled: !!lessonId,
  });

  const { data: challenges } = useQuery({
    queryKey: ["/api/lessons", lessonId, "challenges"],
    queryFn: () => getChallengesByLesson(lessonId),
    enabled: !!lessonId,
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/progress"],
    queryFn: getUserProgress,
  });

  useEffect(() => {
    if (!challenges || !progress) {
      setCurrentChallengeIndex(0);
      setUsedHintInLesson(false);
      setShowCompletion(false);
      setIsTransitioning(false);
      return;
    }

    const firstIncompleteIndex = challenges.findIndex(
      (challenge) => !progress.some((p) => p.challengeId === challenge.id)
    );

    if (firstIncompleteIndex === -1) {
      setCurrentChallengeIndex(0);
      const isLessonComplete = progress.some((p) => p.lessonId === lessonId);
      setShowCompletion(isLessonComplete);
    } else {
      setCurrentChallengeIndex(firstIncompleteIndex);
      setShowCompletion(false);
    }
    
    setUsedHintInLesson(false);
    setIsTransitioning(false);
  }, [lessonId, challenges, progress]);

  const completeMutation = useMutation({
    mutationFn: (data: { challengeId: string; usedHint: boolean }) =>
      completeChallenge(data.challengeId, data.usedHint),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Challenge completed!",
        description: `You earned ${data.xpEarned || 30} XP`,
      });
    },
  });

  const lessonMutation = useMutation({
    mutationFn: (data: { lessonId: string; usedHint: boolean }) =>
      completeLesson(data.lessonId, data.usedHint),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Lesson completed!",
        description: `You earned ${data.xpEarned || 20} XP`,
      });
      setShowCompletion(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete lesson. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!lessons || !lesson || !challenges || !progress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const lessonsWithStatus = lessons.map((l: Lesson) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    isCompleted: progress.some((p: any) => p.lessonId === l.id),
    isLocked: false,
    challengeCount: 2,
  }));

  const currentChallenge = challenges[currentChallengeIndex];
  const isLessonCompleted = progress.some((p: any) => p.lessonId === lessonId);

  const handleChallengeComplete = async (correct: boolean, usedHint: boolean = false) => {
    if (!correct || !currentChallenge || isTransitioning) return;

    setIsTransitioning(true);
    const updatedUsedHint = usedHintInLesson || usedHint;
    if (usedHint) {
      setUsedHintInLesson(true);
    }
    
    try {
      await queryClient.refetchQueries({ queryKey: ["/api/progress"] });
      const freshProgress = queryClient.getQueryData(["/api/progress"]) as any[];
      
      const alreadyCompleted = freshProgress?.some((p: any) => p.challengeId === currentChallenge.id);
      if (!alreadyCompleted) {
        await new Promise<void>((resolve, reject) => {
          completeMutation.mutate(
            {
              challengeId: currentChallenge.id,
              usedHint,
            },
            {
              onSuccess: () => resolve(),
              onError: (error) => reject(error),
            }
          );
        });
      }

      const isLastChallenge = currentChallengeIndex === challenges.length - 1;

      if (!isLastChallenge) {
        setCurrentChallengeIndex(prev => prev + 1);
        setIsTransitioning(false);
      } else {
        const lessonAlreadyCompleted = freshProgress?.some((p: any) => p.lessonId === lessonId);
        if (!lessonAlreadyCompleted) {
          await new Promise<void>((resolve, reject) => {
            lessonMutation.mutate(
              {
                lessonId,
                usedHint: updatedUsedHint,
              },
              {
                onSuccess: () => resolve(),
                onError: (error) => reject(error),
              }
            );
          });
        } else {
          setShowCompletion(true);
        }
        setIsTransitioning(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete challenge. Please try again.",
        variant: "destructive",
      });
      setIsTransitioning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <Link href="/levels">
          <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            Back to Levels
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <LessonList
              lessons={lessonsWithStatus}
              onLessonClick={(id) => console.log('Lesson clicked:', id)}
              currentLessonId={lessonId}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <LessonContent
              title={lesson.title}
              content={lesson.content}
              isCompleted={isLessonCompleted}
            />

            {showCompletion ? (
              <div className="space-y-6">
                <div className="p-8 rounded-lg border-2 border-chart-2 bg-chart-2/10 text-center">
                  <h2 className="text-2xl font-bold mb-2">Lesson Complete!</h2>
                  <p className="text-muted-foreground mb-6">
                    Great work! You've completed all challenges in this lesson.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link href={`/levels`}>
                      <Button variant="outline" data-testid="button-back-levels">
                        Back to Levels
                      </Button>
                    </Link>
                    {lessons && lessonId && (() => {
                      const currentIndex = lessons.findIndex((l: Lesson) => l.id === lessonId);
                      const nextLesson = lessons[currentIndex + 1];
                      return nextLesson ? (
                        <Link href={`/level/${levelId}/lesson/${nextLesson.id}`}>
                          <Button data-testid="button-next-lesson">
                            Next Lesson
                          </Button>
                        </Link>
                      ) : null;
                    })()}
                  </div>
                </div>
              </div>
            ) : currentChallenge && (
              <div className="space-y-6">
                {currentChallenge.type === "multiple-choice" && currentChallenge.options && currentChallenge.correctAnswer !== undefined && currentChallenge.correctAnswer !== null ? (
                  <MultipleChoiceChallenge
                    question={currentChallenge.prompt}
                    options={currentChallenge.options}
                    correctAnswer={currentChallenge.correctAnswer}
                    explanation={currentChallenge.explanation || undefined}
                    onComplete={(correct) => handleChallengeComplete(correct, false)}
                  />
                ) : currentChallenge.type === "code" && currentChallenge.starterCode && currentChallenge.validationPatterns ? (
                  <CodeChallenge
                    title="Code Challenge"
                    prompt={currentChallenge.prompt}
                    starterCode={currentChallenge.starterCode}
                    validationPatterns={currentChallenge.validationPatterns}
                    hint={currentChallenge.hint || undefined}
                    onComplete={(correct) => handleChallengeComplete(correct, false)}
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
