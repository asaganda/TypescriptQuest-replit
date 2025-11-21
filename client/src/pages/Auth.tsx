import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

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

  return <AuthForm onLogin={handleLogin} onSignup={handleSignup} />;
}
