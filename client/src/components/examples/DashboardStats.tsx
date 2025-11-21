import DashboardStats from '../DashboardStats';

export default function DashboardStatsExample() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DashboardStats
        totalXP={450}
        xpToNextLevel={600}
        currentLevel={2}
        lessonsCompleted={8}
        challengesCompleted={15}
        badgesEarned={3}
      />
    </div>
  );
}
