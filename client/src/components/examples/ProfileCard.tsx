import ProfileCard from '../ProfileCard';

export default function ProfileCardExample() {
  return (
    <div className="p-6 max-w-md mx-auto">
      <ProfileCard
        displayName="Alex Developer"
        email="alex@example.com"
        joinDate="November 2024"
        currentLevel={2}
        totalXP={450}
      />
    </div>
  );
}
