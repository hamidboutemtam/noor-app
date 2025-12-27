import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ActionButton, LoadingSpinner } from '@/components/ui';

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error('Login error:', err);

      // Gérer les différents types d'erreurs
      if (err.message?.includes('popup')) {
        setError('Connexion annulée');
      } else if (err.message?.includes('network')) {
        setError('Erreur de connexion. Vérifiez votre connexion internet.');
      } else {
        setError('Erreur d\'authentification. Veuillez réessayer.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--surface-1)] flex items-center justify-center p-5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="card p-8 w-full max-w-lg"
      >
        {/* Logo avec effet pulse */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-5xl" style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(38 92% 50%) 100%)',
            boxShadow: '0 0 30px hsl(var(--primary) / 0.4)',
          }}>
            ✨
          </div>
        </motion.div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-center mb-3" style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(38 92% 50%) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Noor
        </h1>

        {/* Tagline */}
        <p className="text-center text-[hsl(var(--muted-foreground))] mb-8 text-lg">
          Une parole de lumière pour chaque instant
        </p>

        {/* Description */}
        <p className="text-center text-[hsl(var(--foreground)/0.7)] mb-8 text-sm leading-relaxed">
          Recevez des citations inspirantes du Coran, des hadiths et de la sagesse islamique,
          adaptées à votre état d'esprit et à votre profil.
        </p>

        {/* Bouton Google Sign-In */}
        <div className="mb-4">
          <ActionButton
            onClick={handleGoogleSignIn}
            icon={isLoading ? <LoadingSpinner size="sm" /> : <LogIn size={20} />}
            label={isLoading ? 'Connexion...' : 'Continuer avec Google'}
            variant="gold"
            size="lg"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Message d'erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[hsl(var(--rose))] text-center text-sm mt-4 p-3 rounded-lg bg-[hsl(var(--rose)/0.1)] border border-[hsl(var(--rose)/0.3)]"
          >
            {error}
          </motion.div>
        )}

        {/* Note de confidentialité */}
        <p className="text-center text-[hsl(var(--muted-foreground))] text-xs mt-6 leading-relaxed">
          En vous connectant, vous acceptez que vos préférences et favoris soient sauvegardés
          de manière sécurisée.
        </p>
      </motion.div>
    </div>
  );
}

// ===== LOADING SCREEN =====
// Component affiché pendant la vérification de session au démarrage
export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[var(--surface-1)] flex flex-col items-center justify-center">
      {/* Logo avec animation pulse */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-6xl" style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(38 92% 50%) 100%)',
          boxShadow: '0 0 40px hsl(var(--primary) / 0.5)',
        }}>
          ✨
        </div>
      </motion.div>

      {/* Loading spinner */}
      <LoadingSpinner size="lg" />

      {/* Texte optionnel */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-[hsl(var(--muted-foreground))] mt-6 text-sm"
      >
        Chargement...
      </motion.p>
    </div>
  );
}
