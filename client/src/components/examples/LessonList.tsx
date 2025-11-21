import LessonList from '../LessonList';

export default function LessonListExample() {
  const lessons = [
    {
      id: "1",
      title: "Introduction to Types",
      description: "Learn about basic TypeScript types",
      isCompleted: true,
      isLocked: false,
      challengeCount: 3
    },
    {
      id: "2",
      title: "Interfaces & Type Aliases",
      description: "Define custom types and interfaces",
      isCompleted: false,
      isLocked: false,
      challengeCount: 4
    },
    {
      id: "3",
      title: "Union & Intersection Types",
      description: "Combine types in powerful ways",
      isCompleted: false,
      isLocked: true,
      challengeCount: 2
    }
  ];

  return (
    <div className="p-6 max-w-md mx-auto">
      <LessonList
        lessons={lessons}
        onLessonClick={(id) => console.log('Lesson clicked:', id)}
        currentLessonId="2"
      />
    </div>
  );
}
