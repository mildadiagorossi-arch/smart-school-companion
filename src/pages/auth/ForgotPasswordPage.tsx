import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, AlertCircle, Loader2, GraduationCap, Sparkles, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          <div className="clay-card-lg p-8 text-center space-y-6">
            <div className="clay-card w-20 h-20 mx-auto flex items-center justify-center bg-success/10">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-foreground">
                Vérifiez vos emails
              </h2>
              <p className="text-muted-foreground">
                Nous avons envoyé un lien de réinitialisation à <strong className="text-foreground">{email}</strong>
              </p>
            </div>

            <p className="text-sm text-muted-foreground">
              Vérifiez votre dossier spam si vous ne voyez pas l'email
            </p>

            <Link to="/auth/login">
              <Button className="clay-button bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </div>
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
          <p className="text-muted-foreground">Réinitialisation du mot de passe</p>
        </div>

        {/* Form Card */}
        <div className="clay-card-lg p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-center text-foreground">
            Mot de passe oublié ?
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
                  placeholder="vous@exemple.com"
                  className="clay-input pl-10 h-12"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Nous vous enverrons un lien pour réinitialiser votre mot de passe
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 clay-button bg-primary hover:bg-primary/90 text-primary-foreground text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
              ) : null}
              Envoyer le lien
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center">
            <Link 
              to="/auth/login" 
              className="text-primary hover:text-primary/80 font-medium transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
