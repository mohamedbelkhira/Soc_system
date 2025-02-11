import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignupPage = () => {
  // États pour capturer les informations de l'utilisateur
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fonction de gestion de la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation minimale
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = 'Le nom est requis.';
    if (!email.trim()) newErrors.email = 'L\'e-mail est requis.';
    if (!password) newErrors.password = 'Le mot de passe est requis.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';

    setErrors(newErrors);

    // Si pas d'erreurs, procéder
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      // Simuler un appel API
      setTimeout(() => {
        console.log({
          name,
          email,
          password,
          confirmPassword
        });
        setIsLoading(false);
        // Optionnel : Réinitialiser le formulaire après soumission
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <Card className="border-none shadow-lg">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-lg-mobile md:text-2xl font-bold">Créer un Compte</CardTitle>
            <CardDescription>
              Remplissez les informations ci-dessous pour vous inscrire
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Formulaire d'Inscription */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Champ Nom */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="name"
                    placeholder="Votre nom"
                    type="text"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>
              
              {/* Champ E-mail */}
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    placeholder="nom@exemple.com"
                    type="email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              
              {/* Champ Mot de Passe */}
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              
              {/* Champ Confirmation Mot de Passe */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              {/* Bouton de Soumission */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-blue-500 hover:underline">
                Connectez-vous
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
