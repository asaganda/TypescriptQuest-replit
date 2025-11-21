import { useState } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { getLessonsByLevel, getLesson, getChallengesByLesson, completeChallenge, getUserProgress, type Lesson } from "@/lib/api";
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

  const handleChallengeComplete = (correct: boolean, usedHint: boolean = false) => {
    if (correct && currentChallenge) {
      if (usedHint) {
        setUsedHintInLesson(true);
      }
      
      const alreadyCompleted = progress.some((p: any) => p.challengeId === currentChallenge.id);
      if (!alreadyCompleted) {
        completeMutation.mutate({
          challengeId: currentChallenge.id,
          usedHint,
        });
      }

      if (currentChallengeIndex < challenges.length - 1) {
        setTimeout(() => {
          setCurrentChallengeIndex(currentChallengeIndex + 1);
        }, 2000);
      }
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

            {currentChallenge && (
              <div className="space-y-6">
                {currentChallenge.type === "multiple-choice" && currentChallenge.options && currentChallenge.correctAnswer !== null ? (
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
