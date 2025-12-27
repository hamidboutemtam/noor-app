import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { supabaseService } from '@/services/supabase.service';
import type { User, Session, Profile } from '@/types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger le profil utilisateur depuis la DB
  const loadProfile = async (userId: string) => {
    try {
      const { profile: userProfile, error } = await supabaseService.profiles.getById(userId);
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  // Initialiser l'auth au chargement
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);

      try {
        // Vérifier si une session existe
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (currentSession?.user) {
          setUser(currentSession.user);
          setSession(currentSession);
          await loadProfile(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Charger le profil quand l'utilisateur se connecte
          await loadProfile(currentSession.user.id);
        } else {
          // Nettoyer le profil quand l'utilisateur se déconnecte
          setProfile(null);
        }

        // Fin du chargement après le premier événement auth
        if (loading) {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Connexion avec Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabaseService.auth.signInWithGoogle();
      if (error) throw error;
    } catch (error: any) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  // Déconnexion
  const signOut = async () => {
    try {
      const { error } = await supabaseService.auth.signOut();
      if (error) throw error;

      // Nettoyer l'état local
      setUser(null);
      setProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
