import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, AlertCircle, Loader2, GraduationCap, Sparkles } from 'lucide-react';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect. Essayez: direction@ecole.ma');
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo/Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="clay-card p-3">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <Sparkles className="h-5 w-5 text-accent animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-gradient">SchoolGenius</h1>
          <p className="text-muted-foreground">Plateforme de gestion scolaire intelligente</p>
        </div>

        {/* Form Card */}
        <div className="clay-card-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-foreground">
            Bienvenue
          </h2>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="clay-card-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="direction@ecole.ma"
                  className="clay-input pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Mot de passe <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="clay-input pl-10 h-12"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-muted" />
                <span className="text-muted-foreground">Se souvenir de moi</span>
              </label>
              <Link 
                to="/auth/forgot-password" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 clay-button bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : null}
              Se connecter
            </Button>
          </form>

          {/* Demo accounts hint */}
          <div className="clay-card-sm p-4 bg-muted/30">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Comptes démo :</strong><br />
              direction@ecole.ma • admin@ecole.ma<br />
              prof@ecole.ma • parent@ecole.ma
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-muted-foreground">
            Pas encore de compte ?{' '}
            <Link 
              to="/auth/register" 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
