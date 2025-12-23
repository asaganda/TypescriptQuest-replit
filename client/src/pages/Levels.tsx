import LevelCard from "@/components/LevelCard";
import { useQuery } from "@tanstack/react-query";
import { getLevels, getUserStats, getUserProgress, getLessonsByLevel, getChallengesByLesson } from "@/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";

interface LevelProgress {
  id: string;
  levelNumber: number;
  title: string;
  description: string;
  isLocked: boolean;
  isCompleted: boolean;
  completionPercentage: number;
  totalLessons: number;
  nextLessonId: string | null;
}

export default function Levels() {
  const { user } = useAuth();
  const [levelsWithProgress, setLevelsWithProgress] = useState<LevelProgress[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const { data: levels } = useQuery({
    queryKey: ["/api/levels"],
    queryFn: getLevels,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: getUserStats,
  });

  const { data: progress } = useQuery({
    queryKey: ["/api/progress"],
    queryFn: getUserProgress,
  });

  useEffect(() => {
    async function calculateProgress() {
      if (!levels || !stats || !progress) return;

      setIsCalculating(true);

      try {
        // Sort levels by order to process them sequentially
        const sortedLevels = [...levels].sort((a, b) => a.order - b.order);
        const levelData: LevelProgress[] = [];

        for (const level of sortedLevels) {
          // First level is always unlocked, subsequent levels require previous level completion
          // Admins bypass all lock restrictions
          let isLocked = false;
          if (!user?.isAdmin && level.order > 1) {
            const previousLevel = levelData[levelData.length - 1];
            isLocked = !previousLevel?.isCompleted;
          }

          try {
            const lessons = await getLessonsByLevel(level.id);
            const totalLessons = lessons.length;

            if (isLocked) {
              levelData.push({
                id: level.id,
                levelNumber: level.order,
                title: level.name,
                description: level.description,
                isLocked: true,
                isCompleted: false,
                completionPercentage: 0,
                totalLessons,
                nextLessonId: null,
              });
              continue;
            }

            const lessonChallenges = await Promise.all(
              lessons.map(async (lesson) => ({
                lesson,
                challenges: await getChallengesByLesson(lesson.id),
              }))
            );

            let completedCount = 0;
            let totalCount = 0;
            let nextLessonId: string | null = null;

            for (const { lesson, challenges } of lessonChallenges) {
              totalCount += challenges.length;

              const lessonCompletedChallenges = challenges.filter((challenge) =>
                progress.some((p) => p.challengeId === challenge.id)
              ).length;

              completedCount += lessonCompletedChallenges;

              if (!nextLessonId && lessonCompletedChallenges < challenges.length) {
                nextLessonId = lesson.id;
              }
            }

            const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
            const isCompleted = completedCount === totalCount && totalCount > 0;

            if (!nextLessonId && lessons.length > 0) {
              const sortedLessons = [...lessons].sort((a, b) => a.order - b.order);
              nextLessonId = sortedLessons[0].id;
            }

            levelData.push({
              id: level.id,
              levelNumber: level.order,
              title: level.name,
              description: level.description,
              isLocked: false,
              isCompleted,
              completionPercentage,
              totalLessons,
              nextLessonId,
            });
          } catch (error) {
            console.error(`Failed to fetch data for level ${level.id}:`, error);
            levelData.push({
              id: level.id,
              levelNumber: level.order,
              title: level.name,
              description: level.description,
              isLocked,
              isCompleted: false,
              completionPercentage: 0,
              totalLessons: 0,
              nextLessonId: null,
            });
          }
        }

        setLevelsWithProgress(levelData);
      } catch (error) {
        console.error('Failed to calculate progress:', error);
      } finally {
        setIsCalculating(false);
      }
    }

    calculateProgress();
  }, [levels, stats, progress]);

  if (!levels || !stats || !progress || isCalculating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2" data-testid="heading-levels">
            Learning Path
          </h1>
          <p className="text-muted-foreground text-lg">
            Progress through levels to master TypeScript
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {levelsWithProgress.map((level) => (
            <LevelCard
              key={level.id}
              {...level}
              onClick={() => console.log(`Starting level ${level.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
