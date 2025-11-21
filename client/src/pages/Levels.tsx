import LevelCard from "@/components/LevelCard";

export default function Levels() {
  const levels = [
    {
      id: "1",
      levelNumber: 1,
      title: "TypeScript Basics",
      description: "Learn fundamental types, interfaces, and type annotations to build a strong foundation",
      isLocked: false,
      isCompleted: false,
      completionPercentage: 67,
      totalLessons: 3
    },
    {
      id: "2",
      levelNumber: 2,
      title: "Functions & Generics",
      description: "Master function types, generics, and advanced type features for flexible code",
      isLocked: false,
      isCompleted: false,
      completionPercentage: 25,
      totalLessons: 4
    },
    {
      id: "3",
      levelNumber: 3,
      title: "React + TypeScript",
      description: "Build type-safe React applications with TypeScript for better component design",
      isLocked: true,
      isCompleted: false,
      completionPercentage: 0,
      totalLessons: 5
    }
  ];

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
          {levels.map((level) => (
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
