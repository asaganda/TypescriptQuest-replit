import TopNav from '../TopNav';

export default function TopNavExample() {
  return (
    <TopNav
      userName="Alex Developer"
      totalXP={450}
      onLogout={() => console.log('Logout clicked')}
    />
  );
}
