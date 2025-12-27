import { useState, useCallback, useEffect } from 'react';
import { supabaseService, isSupabaseConfigured } from '@/services/supabase.service';
import type { Citation } from '@/types';

const LOCAL_STORAGE_KEY = 'noor_favorites';

export function useFavorites(userId?: string) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [favorites, setFavorites] = useState<Citation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Charger les favoris au montage
  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);

      if (userId && isSupabaseConfigured) {
        const { favoriteIds: ids } = await supabaseService.favorites.getByUserId(userId);
        setFavoriteIds(new Set(ids));

        if (ids.length > 0) {
          const { citations } = await supabaseService.citations.getByIds(ids);
          setFavorites(citations);
        }
      } else {
        // Mode local sans authentification
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          const ids = JSON.parse(stored);
          setFavoriteIds(new Set(ids));

          if (ids.length > 0) {
            const { citations } = await supabaseService.citations.getByIds(ids);
            setFavorites(citations);
          }
        }
      }

      setIsLoading(false);
    };

    loadFavorites();
  }, [userId]);

  const toggleFavorite = useCallback(
    async (citationId: string, citation?: Citation) => {
      const isFav = favoriteIds.has(citationId);

      // Mise à jour optimiste
      setFavoriteIds((prev) => {
        const newSet = new Set(prev);
        if (isFav) {
          newSet.delete(citationId);
        } else {
          newSet.add(citationId);
        }
        return newSet;
      });

      setFavorites((prev) => {
        if (isFav) {
          return prev.filter((c) => c.id !== citationId);
        } else if (citation) {
          return [...prev, citation];
        }
        return prev;
      });

      // Sauvegarder
      if (userId && isSupabaseConfigured) {
        if (isFav) {
          await supabaseService.favorites.remove(userId, citationId);
        } else {
          await supabaseService.favorites.add(userId, citationId);
        }
      } else {
        // Mode local
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        const ids = stored ? JSON.parse(stored) : [];

        if (isFav) {
          const filtered = ids.filter((id: string) => id !== citationId);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
        } else {
          ids.push(citationId);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids));
        }
      }
    },
    [favoriteIds, userId]
  );

  const isFavorite = useCallback(
    (citationId: string) => favoriteIds.has(citationId),
    [favoriteIds]
  );

  const refreshFavorites = useCallback(async () => {
    if (favoriteIds.size === 0) return;

    const ids = Array.from(favoriteIds);
    const { citations } = await supabaseService.citations.getByIds(ids);
    setFavorites(citations);
  }, [favoriteIds]);

  return {
    favorites,
    favoriteIds,
    favoritesCount: favoriteIds.size,
    isLoading,
    toggleFavorite,
    isFavorite,
    refreshFavorites,
  };
}
