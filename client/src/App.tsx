import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Levels from "@/pages/Levels";
import Profile from "@/pages/Profile";
import LessonDetail from "@/pages/LessonDetail";
import TopNav from "@/components/TopNav";
import { useLocation } from "wouter";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!user) {
    return <Redirect to="/" />;
  }
  
  return <Component />;
}

function Router() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const isAuthPage = location === "/" || location === "/auth";

  return (
    <>
      {!isAuthPage && user && <TopNavWithStats onLogout={logout} userName={user.displayName} />}
      <Switch>
        <Route path="/" component={Auth} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard">
          {() => <ProtectedRoute component={Dashboard} />}
        </Route>
        <Route path="/levels">
          {() => <ProtectedRoute component={Levels} />}
        </Route>
        <Route path="/profile">
          {() => <ProtectedRoute component={Profile} />}
        </Route>
        <Route path="/level/:levelId/lesson/:lessonId">
          {() => <ProtectedRoute component={LessonDetail} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function TopNavWithStats({ onLogout, userName }: { onLogout: () => void; userName: string }) {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: async () => {
      const response = await fetch("/api/stats", { credentials: "include" });
      if (!response.ok) return { totalXP: 0 };
      return response.json();
    },
  });

  return <TopNav userName={userName} totalXP={stats?.totalXP || 0} onLogout={onLogout} />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
