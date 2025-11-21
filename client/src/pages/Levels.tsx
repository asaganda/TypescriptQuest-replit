import LevelCard from "@/components/LevelCard";
import { useQuery } from "@tanstack/react-query";
import { getLevels, getUserStats, getUserProgress, getLessonsByLevel } from "@/lib/api";

export default function Levels() {
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

  if (!levels || !stats || !progress) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const levelsWithProgress = levels.map((level) => {
    const isLocked = stats.totalXP < level.xpRequired;
    
    // Calculate completion percentage (would need to fetch lessons for each level)
    const completionPercentage = isLocked ? 0 : 0;
    
    return {
      id: level.id,
      levelNumber: level.order,
      title: level.name,
      description: level.description,
      isLocked,
      isCompleted: false,
      completionPercentage,
      totalLessons: 3, // Hardcoded for now
    };
  });

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
