import LevelCard from '../LevelCard';

export default function LevelCardExample() {
  return (
    <div className="p-6 max-w-md">
      <div className="space-y-4">
        <LevelCard
          id="1"
          levelNumber={1}
          title="TypeScript Basics"
          description="Learn fundamental types, interfaces, and type annotations"
          isLocked={false}
          isCompleted={false}
          completionPercentage={60}
          totalLessons={3}
          onClick={() => console.log('Level 1 clicked')}
        />
        <LevelCard
          id="2"
          levelNumber={2}
          title="Functions & Generics"
          description="Master function types, generics, and advanced type features"
          isLocked={true}
          isCompleted={false}
          completionPercentage={0}
          totalLessons={4}
          onClick={() => console.log('Level 2 clicked')}
        />
      </div>
    </div>
  );
}
