import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BookOpen, Trophy, User, LogOut, Sparkles, Menu } from "lucide-react";

interface TopNavProps {
  userName?: string;
  totalXP?: number;
  onLogout?: () => void;
}

export default function TopNav({ userName, totalXP = 0, onLogout }: TopNavProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              <div className="flex items-center gap-2 font-bold text-xl hover-elevate active-elevate-2 rounded-md px-3 py-2 cursor-pointer" data-testid="link-home">
                <Sparkles className="w-6 h-6 text-primary" />
                <span>TypeScript Quest</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                return (
                  <Link key={item.path} href={item.path}>
                    <Button 
                      variant={isActive ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                      data-testid={`link-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="md:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  {userName && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pb-4 border-b" data-testid="text-username-mobile">
                      <User className="w-4 h-4" />
                      {userName}
                    </div>
                  )}
                  
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location === item.path;
                    return (
                      <Link key={item.path} href={item.path}>
                        <Button 
                          variant={isActive ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3"
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid={`link-mobile-${item.label.toLowerCase()}`}
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout?.();
                    }}
                    data-testid="button-mobile-logout"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

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
              className="hidden md:flex"
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
