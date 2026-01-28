import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Sparkles, Code, TrendingUp, CheckCircle, Trophy } from "lucide-react";

const benefits = [
  {
    icon: Code,
    title: "Learn by Doing",
    description: "Write real TypeScript in a browser-based code editor",
  },
  {
    icon: TrendingUp,
    title: "Structured Progression",
    description: "Leveled curriculum from basics to advanced concepts",
  },
  {
    icon: CheckCircle,
    title: "Instant Feedback",
    description: "Know immediately if your solution is correct",
  },
  {
    icon: Trophy,
    title: "Gamified Learning",
    description: "Earn XP and track your progress as you level up",
  },
];

export default function Auth() {
  const { user, login, signup } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/dashboard");
    }
  }, [user, setLocation]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error("Login error:", error);
      alert(error instanceof Error ? error.message : "Login failed");
    }
  };

  const handleSignup = async (email: string, password: string, displayName: string) => {
    try {
      await signup(email, password, displayName);
    } catch (error) {
      console.error("Signup error:", error);
      alert(error instanceof Error ? error.message : "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left - Marketing Content */}
      <div className="lg:w-3/5 bg-muted/30 p-8 lg:p-12 flex flex-col items-center lg:items-start">
        {/* Branding */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <Sparkles className="w-6 h-6 text-primary" />
          <span>TypeScript Quest</span>
        </div>

        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center max-w-xl py-8 lg:py-0 text-center lg:text-left">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
            Learn TypeScript through hands-on practice, not passive reading
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Master TypeScript with interactive coding challenges, instant feedback, and a structured learning path designed for developers.
          </p>

          {/* Benefits */}
          <div className="space-y-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex items-start gap-3 text-left">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right - Auth Form */}
      <div className="lg:w-2/5 flex items-center justify-center p-6 lg:p-12 bg-background">
        <AuthForm onLogin={handleLogin} onSignup={handleSignup} />
      </div>
    </div>
  );
}
