import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, User, LogOut, Sparkles } from "lucide-react";

interface TopNavProps {
  userName?: string;
  totalXP?: number;
  onLogout?: () => void;
}

export default function TopNav({ userName, totalXP = 0, onLogout }: TopNavProps) {
  const [location] = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Trophy },
    { path: "/levels", label: "Levels", icon: BookOpen },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="border-b bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <a className="flex items-center gap-2 font-bold text-xl hover-elevate active-elevate-2 rounded-md px-3 py-2" data-testid="link-home">
                <Sparkles className="w-6 h-6 text-primary" />
                <span>TypeScript Quest</span>
              </a>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <a data-testid={`link-${item.label.toLowerCase()}`}>
                      <Button 
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className="gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </Button>
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-1 px-3 py-1.5" data-testid="badge-xp">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="font-semibold">{totalXP} XP</span>
            </Badge>
            
            {userName && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground" data-testid="text-username">
                {userName}
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
