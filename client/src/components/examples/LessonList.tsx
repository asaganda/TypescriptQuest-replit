import LessonList from '../LessonList';

export default function LessonListExample() {
  const lessons = [
    {
      id: "1",
      title: "Introduction to Types",
      description: "Learn about basic TypeScript types",
      isCompleted: true,
      isLocked: false,
      challengeCount: 3,
      challenges: [
        { id: "1-1", isCompleted: true },
        { id: "1-2", isCompleted: true },
        { id: "1-3", isCompleted: true }
      ]
    },
    {
      id: "2",
      title: "Interfaces & Type Aliases",
      description: "Define custom types and interfaces",
      isCompleted: false,
      isLocked: false,
      challengeCount: 4,
      challenges: [
        { id: "2-1", isCompleted: true },
        { id: "2-2", isCompleted: false },
        { id: "2-3", isCompleted: false },
        { id: "2-4", isCompleted: false }
      ]
    },
    {
      id: "3",
      title: "Union & Intersection Types",
      description: "Combine types in powerful ways",
      isCompleted: false,
      isLocked: true,
      challengeCount: 2,
      challenges: [
        { id: "3-1", isCompleted: false },
        { id: "3-2", isCompleted: false }
      ]
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
