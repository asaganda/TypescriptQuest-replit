import BadgeShowcase from '../BadgeShowcase';

export default function BadgeShowcaseExample() {
  const badges = [
    { id: "first-lesson", name: "First Steps", description: "Complete your first lesson", icon: "book" as const, earned: true },
    { id: "five-challenges", name: "Problem Solver", description: "Solve 5 challenges", icon: "zap" as const, earned: true },
    { id: "no-hints", name: "Pure Skill", description: "Complete a lesson without hints", icon: "trophy" as const, earned: true },
    { id: "perfect-score", name: "Perfectionist", description: "Get 100% on a challenge", icon: "star" as const, earned: false },
    { id: "speed-demon", name: "Speed Demon", description: "Complete a challenge in under 1 minute", icon: "target" as const, earned: false },
    { id: "level-master", name: "Level Master", description: "Complete all lessons in a level", icon: "trophy" as const, earned: false },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <BadgeShowcase badges={badges} />
    </div>
  );
}
