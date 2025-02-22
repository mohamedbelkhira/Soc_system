import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-provider";
import { Lock, Mail, AlertCircle, Shield } from "lucide-react";
import loginImage from "@/assets/images/login/soc_image.jpg";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError("");

    try {
      await login(username, password);
    } catch (err) {
      console.log("Login error in component:", err);
      setError("Identifiants invalides. Veuillez réessayer.");
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-background px-4">
      <div className="w-full max-w-6xl flex rounded-xl shadow-2xl overflow-hidden">
        {/* Image Section - Hidden on mobile */}
        <div className="hidden md:block w-3/5 bg-primary relative">
          <img
            src={loginImage}
            alt="DSD - System de supervision et de détection"
            className="w-full h-full object-cover opacity-85 mix-blend-overlay"
          />
           <div className="absolute inset-0 bg-[#1a472a]/80 dark:bg-[#1a472a]/70" />

          <div className="absolute top-8 left-8">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary-foreground" />
              <h1 className="text-4xl font-bold text-primary-foreground">DSD-ASSI</h1>
            </div>
            <div className="h-1 w-20 bg-accent mt-2 rounded"/>
          </div>
          <div className="absolute bottom-12 left-8 max-w-lg">
            <h2 className="text-3xl font-bold mb-4 text-primary-foreground">CNOSSI</h2>
            <p className="text-lg text-primary-foreground/90">supervision et Détection</p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-2/5 bg-card dark:bg-card">
          <Card className="border-none h-full">
            <CardHeader className="space-y-2 text-center pt-12">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-card-foreground">DSD-ASSI</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Portail d'authentification sécurisé
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 px-12 pt-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-base text-card-foreground">Nom d'utilisateur</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 h-12 text-base bg-background dark:bg-secondary border-input"
                      required
                      disabled={isLoading}
                      placeholder="Nom d'utilisateur"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base text-card-foreground">Mot de passe</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 text-base bg-background dark:bg-secondary border-input"
                      required
                      disabled={isLoading}
                      placeholder="••••••••"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 mt-2 text-destructive text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-semibold mt-4 bg-primary text-primary-foreground hover:bg-primary/90" 
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 items-center pt-6">
              <p className="text-sm text-muted-foreground">
                Système de supervision et de détection
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;