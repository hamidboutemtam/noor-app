import { useState, useCallback } from 'react';
import { supabaseService } from '@/services/supabase.service';
import type { Citation, Mood, UserProfile, SourceType } from '@/types';

export function useCitations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<{
    total: number;
    byType: Record<string, number>;
    byMood: Record<string, number>;
  } | null>(null);

  const getCitationByMood = useCallback(
    async (
      mood: Mood,
      userProfile: UserProfile,
      modeEpreuve: boolean = false,
      preferredSources?: SourceType[]
    ): Promise<Citation | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const { citation, error } = await supabaseService.citations.getByMood(
          mood,
          userProfile,
          modeEpreuve,
          preferredSources
        );

        if (error) {
          setError(error);
          return null;
        }

        return citation;
      } catch (err) {
        setError(err as Error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getCitationsByIds = useCallback(async (ids: string[]): Promise<Citation[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { citations, error } = await supabaseService.citations.getByIds(ids);

      if (error) {
        setError(error);
        return [];
      }

      return citations;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllCitations = useCallback(async (): Promise<Citation[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const { citations, error } = await supabaseService.citations.getAll();

      if (error) {
        setError(error);
        return [];
      }

      return citations;
    } catch (err) {
      setError(err as Error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { stats: fetchedStats, error } = await supabaseService.citations.getStats();

      if (error) {
        setError(error);
        return;
      }

      setStats(fetchedStats);
    } catch (err) {
      setError(err as Error);
    }
  }, []);

  return {
    isLoading,
    error,
    stats,
    getCitationByMood,
    getCitationsByIds,
    getAllCitations,
    fetchStats,
  };
}
