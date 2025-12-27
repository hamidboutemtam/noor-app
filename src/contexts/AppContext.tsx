import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Mood, UserProfile, Citation } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '@/services/supabase.service';

interface AppContextType {
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Mood
  selectedMood: Mood | null;
  setSelectedMood: (mood: Mood | null) => void;

  // User settings
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  modeEpreuve: boolean;
  setModeEpreuve: (mode: boolean) => void;
  darkMode: boolean;
  setDarkMode: (mode: boolean) => void;

  // Favorites
  favorites: Citation[];
  favoriteIds: Set<string>;
  favoritesCount: number;
  toggleFavorite: (citationId: string, citation?: Citation) => void;
  isFavorite: (citationId: string) => boolean;

  // Toast
  showToast: (message: string, type?: 'success' | 'error') => void;
  toast: { visible: boolean; message: string; type: 'success' | 'error' };

  // Stats
  citationsCount: number;
  setCitationsCount: (count: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { user, profile } = useAuth();

  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);

  // User preferences (persisted)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    // Initialiser depuis le profil auth s'il existe, sinon depuis localStorage
    if (profile?.preferred_profile) {
      return profile.preferred_profile;
    }
    const stored = localStorage.getItem('noor_profile');
    return (stored as UserProfile) || 'particulier';
  });

  const [modeEpreuve, setModeEpreuve] = useState(() => {
    const stored = localStorage.getItem('noor_modeEpreuve');
    return stored ? JSON.parse(stored) : false;
  });

  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('noor_darkMode');
    if (stored !== null) return JSON.parse(stored);
    // Mode sombre par défaut
    return true;
  });

  // Toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  // Stats
  const [citationsCount, setCitationsCount] = useState(0);

  // Favorites hook - passer userId si authentifié
  const {
    favorites,
    favoriteIds,
    favoritesCount,
    toggleFavorite,
    isFavorite,
  } = useFavorites(user?.id);

  // Sync userProfile from auth profile when it changes
  useEffect(() => {
    if (profile?.preferred_profile) {
      setUserProfile(profile.preferred_profile);
    }
  }, [profile?.preferred_profile]);

  // Persist user profile to both localStorage and database
  useEffect(() => {
    localStorage.setItem('noor_profile', userProfile);

    // Mettre à jour la DB si l'utilisateur est authentifié
    if (user && profile) {
      supabaseService.profiles.upsert({
        id: user.id,
        preferred_profile: userProfile,
      }).catch((error) => {
        console.error('Error updating profile preference:', error);
      });
    }
  }, [userProfile, user, profile]);

  // Persist mode épreuve
  useEffect(() => {
    localStorage.setItem('noor_modeEpreuve', JSON.stringify(modeEpreuve));
  }, [modeEpreuve]);

  // Persist and apply dark mode
  useEffect(() => {
    localStorage.setItem('noor_darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [darkMode]);

  // Toast handler
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2500);
  }, []);

  const value: AppContextType = {
    currentPage,
    setCurrentPage,
    selectedMood,
    setSelectedMood,
    userProfile,
    setUserProfile,
    modeEpreuve,
    setModeEpreuve,
    darkMode,
    setDarkMode,
    favorites,
    favoriteIds,
    favoritesCount,
    toggleFavorite,
    isFavorite,
    showToast,
    toast,
    citationsCount,
    setCitationsCount,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
