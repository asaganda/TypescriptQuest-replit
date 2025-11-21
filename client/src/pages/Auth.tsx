import AuthForm from "@/components/AuthForm";
import { useLocation } from "wouter";

export default function Auth() {
  const [, setLocation] = useLocation();

  const handleLogin = (email: string, password: string) => {
    console.log('Login:', email, password);
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1000);
  };

  const handleSignup = (email: string, password: string, displayName: string) => {
    console.log('Signup:', email, password, displayName);
    setTimeout(() => {
      setLocation("/dashboard");
    }, 1000);
  };

  return <AuthForm onLogin={handleLogin} onSignup={handleSignup} />;
}
