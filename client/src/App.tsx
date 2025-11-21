import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Levels from "@/pages/Levels";
import Profile from "@/pages/Profile";
import LessonDetail from "@/pages/LessonDetail";
import TopNav from "@/components/TopNav";
import { useLocation } from "wouter";

function Router() {
  const [location, setLocation] = useLocation();
  const isAuthPage = location === "/" || location === "/auth";

  return (
    <>
      {!isAuthPage && (
        <TopNav
          userName="Alex Developer"
          totalXP={450}
          onLogout={() => {
            console.log('Logging out...');
            setLocation("/");
          }}
        />
      )}
      <Switch>
        <Route path="/" component={Auth} />
        <Route path="/auth" component={Auth} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/levels" component={Levels} />
        <Route path="/profile" component={Profile} />
        <Route path="/level/:levelId/lesson/:lessonId" component={LessonDetail} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
