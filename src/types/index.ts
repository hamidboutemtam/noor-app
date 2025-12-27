// Types Supabase Auth
import type { User, Session } from '@supabase/supabase-js';
export type { User, Session };

// Types pour la base de données Supabase
export interface Citation {
  id: string;
  text_fr: string;
  text_ar: string | null;
  source_type: 'quran' | 'hadith_sahih' | 'hadith' | 'action' | 'rappel' | 'sagesse';
  source_ref: string | null;
  moods: string[];
  target: ('particulier' | 'entrepreneur')[];
  epreuve: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  has_boost: boolean;
  preferred_profile: 'particulier' | 'entrepreneur';
  created_at: string;
  updated_at: string;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  citation_id: string;
  created_at: string;
}

// Types pour l'application
export type Mood = 
  | 'stress' 
  | 'fatigue' 
  | 'déprime' 
  | 'motivation' 
  | 'procrastination' 
  | 'gratitude' 
  | 'patience' 
  | 'epreuve';

export interface MoodOption {
  id: Mood;
  label: string;
  emoji: string;
  color: string;
  description: string;
}

export type UserProfile = 'particulier' | 'entrepreneur';

export type SourceType = Citation['source_type'];

// Types pour les réponses Supabase
export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// Database types for Supabase
export type Database = {
  public: {
    Tables: {
      citations: {
        Row: Citation;
        Insert: Omit<Citation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Citation, 'id' | 'created_at' | 'updated_at'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_favorites: {
        Row: UserFavorite;
        Insert: Omit<UserFavorite, 'id' | 'created_at'>;
        Update: Partial<Omit<UserFavorite, 'id' | 'created_at'>>;
      };
    };
  };
};
