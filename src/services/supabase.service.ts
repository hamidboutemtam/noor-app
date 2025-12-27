import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { Citation, Profile, UserFavorite, Mood, UserProfile } from '@/types';

// ============================================
// CITATIONS LOCALES DE FALLBACK
// Utilisées quand Supabase n'est pas configuré
// ============================================
const localCitations: Citation[] = [
  // --- CORAN ---
  {
    id: 'local-quran-1',
    text_fr: "Allah ne change pas l'état d'un peuple tant qu'ils ne changent pas ce qui est en eux-mêmes.",
    text_ar: "إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ",
    source_type: "quran",
    source_ref: "Sourate Ar-Ra'd, 13:11",
    moods: ["motivation", "procrastination"],
    target: ["particulier", "entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-quran-2',
    text_fr: "Après la difficulté vient certes la facilité.",
    text_ar: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
    source_type: "quran",
    source_ref: "Sourate Ash-Sharh, 94:5",
    moods: ["stress", "déprime", "fatigue", "epreuve"],
    target: ["particulier", "entrepreneur"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-quran-3',
    text_fr: "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
    text_ar: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    source_type: "quran",
    source_ref: "Sourate Al-Baqarah, 2:286",
    moods: ["stress", "fatigue", "déprime"],
    target: ["particulier", "entrepreneur"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-quran-4',
    text_fr: "Ton Seigneur ne t'a ni abandonné, ni détesté.",
    text_ar: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    source_type: "quran",
    source_ref: "Sourate Ad-Duha, 93:3",
    moods: ["déprime", "epreuve"],
    target: ["particulier"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-quran-5',
    text_fr: "Celui qui fait le poids d'un atome de bien le verra.",
    text_ar: "فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ",
    source_type: "quran",
    source_ref: "Sourate Az-Zalzalah, 99:7",
    moods: ["motivation", "gratitude"],
    target: ["particulier", "entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-quran-6',
    text_fr: "Si vous êtes reconnaissants, Je vous augmenterai certes en bienfaits.",
    text_ar: "لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    source_type: "quran",
    source_ref: "Sourate Ibrahim, 14:7",
    moods: ["gratitude", "motivation"],
    target: ["particulier", "entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-quran-7',
    text_fr: "Dis : Œuvrez, car Allah verra vos œuvres.",
    text_ar: "قُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ",
    source_type: "quran",
    source_ref: "Sourate At-Tawbah, 9:105",
    moods: ["motivation", "procrastination"],
    target: ["entrepreneur", "particulier"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-quran-8',
    text_fr: "Sois patient, car la promesse d'Allah est vérité.",
    text_ar: "فَاصْبِرْ إِنَّ وَعْدَ اللَّهِ حَقٌّ",
    source_type: "quran",
    source_ref: "Sourate Ar-Rûm, 30:60",
    moods: ["patience", "epreuve", "stress"],
    target: ["particulier", "entrepreneur"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-quran-9',
    text_fr: "Ne sois pas triste, Allah est avec nous.",
    text_ar: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا",
    source_type: "quran",
    source_ref: "Sourate At-Tawbah, 9:40",
    moods: ["déprime", "epreuve"],
    target: ["particulier"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // --- HADITHS ---
  {
    id: 'local-hadith-1',
    text_fr: "Les actes ne valent que par les intentions.",
    text_ar: "إنما الأعمال بالنيات",
    source_type: "hadith_sahih",
    source_ref: "Sahih Al-Bukhari, 1",
    moods: ["motivation"],
    target: ["particulier", "entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-hadith-2',
    text_fr: "Le croyant fort est meilleur et plus aimé d'Allah que le croyant faible.",
    text_ar: "المؤمن القوي خير وأحب إلى الله من المؤمن الضعيف",
    source_type: "hadith_sahih",
    source_ref: "Sahih Muslim, 2664",
    moods: ["motivation", "fatigue"],
    target: ["entrepreneur", "particulier"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-hadith-3',
    text_fr: "Celui qui emprunte le chemin de la science, Allah lui facilite une voie vers le Paradis.",
    text_ar: "من سلك طريقا يلتمس فيه علما سهل الله له به طريقا إلى الجنة",
    source_type: "hadith_sahih",
    source_ref: "Sahih Muslim, 2699",
    moods: ["motivation", "procrastination"],
    target: ["particulier", "entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-hadith-4',
    text_fr: "La patience est la clé du soulagement.",
    text_ar: "الصبر مفتاح الفرج",
    source_type: "hadith",
    source_ref: "Rapporté par Al-Bayhaqi",
    moods: ["patience", "stress", "epreuve"],
    target: ["particulier", "entrepreneur"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-hadith-5',
    text_fr: "Demande l'aide d'Allah et ne faiblis pas.",
    text_ar: "استعن بالله ولا تعجز",
    source_type: "hadith_sahih",
    source_ref: "Sahih Muslim, 2664",
    moods: ["motivation", "procrastination"],
    target: ["particulier", "entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // --- MESSAGES ACTION ---
  {
    id: 'local-action-1',
    text_fr: "Tu n'as pas besoin d'aller bien pour avancer. Tu as juste besoin d'avancer.",
    text_ar: null,
    source_type: "action",
    source_ref: null,
    moods: ["déprime", "procrastination", "fatigue"],
    target: ["particulier"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-action-2',
    text_fr: "La discipline aujourd'hui t'évitera le regret demain.",
    text_ar: null,
    source_type: "action",
    source_ref: null,
    moods: ["procrastination"],
    target: ["particulier", "entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-action-3',
    text_fr: "Le manque de résultats n'est pas une injustice, c'est un signal.",
    text_ar: null,
    source_type: "action",
    source_ref: null,
    moods: ["motivation"],
    target: ["entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-action-4',
    text_fr: "L'échec n'est pas un verdict, c'est une information.",
    text_ar: null,
    source_type: "action",
    source_ref: null,
    moods: ["epreuve"],
    target: ["entrepreneur"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-action-5',
    text_fr: "La constance est plus puissante que la motivation.",
    text_ar: null,
    source_type: "action",
    source_ref: null,
    moods: ["motivation", "procrastination"],
    target: ["particulier", "entrepreneur"],
    epreuve: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  // --- RAPPELS ÉPREUVE ---
  {
    id: 'local-rappel-1',
    text_fr: "L'épreuve n'est pas une punition automatique. C'est souvent une élévation déguisée.",
    text_ar: null,
    source_type: "rappel",
    source_ref: null,
    moods: ["epreuve", "patience"],
    target: ["particulier", "entrepreneur"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-rappel-2',
    text_fr: "Ce moment difficile ne définit pas toute ta vie.",
    text_ar: null,
    source_type: "rappel",
    source_ref: null,
    moods: ["epreuve", "déprime"],
    target: ["particulier"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'local-rappel-3',
    text_fr: "Tu n'es pas faible parce que tu luttes. Tu es humain.",
    text_ar: null,
    source_type: "rappel",
    source_ref: null,
    moods: ["epreuve", "fatigue", "déprime"],
    target: ["particulier"],
    epreuve: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
];

// ============================================
// SERVICE SUPABASE CENTRALISÉ
// ============================================
export const supabaseService = {
  // ===== CITATIONS =====
  citations: {
    /**
     * Récupérer toutes les citations
     */
    async getAll(): Promise<{ citations: Citation[]; error: Error | null }> {
      if (!isSupabaseConfigured) {
        return { citations: localCitations, error: null };
      }

      try {
        const { data, error } = await supabase
          .from('citations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return { citations: data || [], error: null };
      } catch (error) {
        console.error('Error fetching citations:', error);
        return { citations: localCitations, error: error as Error };
      }
    },

    /**
     * Récupérer une citation par humeur
     */
    async getByMood(
      mood: Mood,
      userProfile: UserProfile,
      modeEpreuve: boolean = false
    ): Promise<{ citation: Citation | null; error: Error | null }> {
      if (!isSupabaseConfigured) {
        // Filtrer les citations locales
        let filtered = localCitations.filter((c) => {
          const moodMatch = c.moods.includes(mood);
          const profileMatch = c.target.includes(userProfile);
          const epreuveMatch = modeEpreuve ? c.epreuve : true;
          return moodMatch && profileMatch && (modeEpreuve ? epreuveMatch : true);
        });

        if (filtered.length === 0) {
          filtered = localCitations.filter((c) => c.target.includes(userProfile));
        }

        if (filtered.length === 0) {
          filtered = localCitations;
        }

        const randomCitation = filtered[Math.floor(Math.random() * filtered.length)];
        return { citation: randomCitation, error: null };
      }

      try {
        let query = supabase
          .from('citations')
          .select('*')
          .contains('moods', [mood])
          .contains('target', [userProfile]);

        if (modeEpreuve) {
          query = query.eq('epreuve', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Si pas de résultat avec le mood, chercher par profil uniquement
        if (!data || data.length === 0) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('citations')
            .select('*')
            .contains('target', [userProfile]);

          if (fallbackError) throw fallbackError;

          const citations = fallbackData || [];
          const randomCitation = citations[Math.floor(Math.random() * citations.length)];
          return { citation: randomCitation || null, error: null };
        }

        const randomCitation = data[Math.floor(Math.random() * data.length)];
        return { citation: randomCitation, error: null };
      } catch (error) {
        console.error('Error fetching citation by mood:', error);
        // Fallback vers les citations locales
        const filtered = localCitations.filter((c) => c.moods.includes(mood));
        const randomCitation = filtered[Math.floor(Math.random() * filtered.length)];
        return { citation: randomCitation || localCitations[0], error: error as Error };
      }
    },

    /**
     * Récupérer des citations par IDs
     */
    async getByIds(ids: string[]): Promise<{ citations: Citation[]; error: Error | null }> {
      if (!isSupabaseConfigured) {
        const citations = localCitations.filter((c) => ids.includes(c.id));
        return { citations, error: null };
      }

      try {
        const { data, error } = await supabase
          .from('citations')
          .select('*')
          .in('id', ids);

        if (error) throw error;
        return { citations: data || [], error: null };
      } catch (error) {
        console.error('Error fetching citations by IDs:', error);
        return { citations: [], error: error as Error };
      }
    },

    /**
     * Récupérer une citation par ID
     */
    async getById(id: string): Promise<{ citation: Citation | null; error: Error | null }> {
      if (!isSupabaseConfigured) {
        const citation = localCitations.find((c) => c.id === id) || null;
        return { citation, error: null };
      }

      try {
        const { data, error } = await supabase
          .from('citations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        return { citation: data, error: null };
      } catch (error) {
        console.error('Error fetching citation by ID:', error);
        return { citation: null, error: error as Error };
      }
    },

    /**
     * Compter le nombre total de citations
     */
    async getCount(): Promise<{ count: number; error: Error | null }> {
      if (!isSupabaseConfigured) {
        return { count: localCitations.length, error: null };
      }

      try {
        const { count, error } = await supabase
          .from('citations')
          .select('*', { count: 'exact', head: true });

        if (error) throw error;
        return { count: count || 0, error: null };
      } catch (error) {
        console.error('Error counting citations:', error);
        return { count: localCitations.length, error: error as Error };
      }
    },

    /**
     * Récupérer les statistiques des citations
     */
    async getStats(): Promise<{
      stats: {
        total: number;
        byType: Record<string, number>;
        byMood: Record<string, number>;
      };
      error: Error | null;
    }> {
      if (!isSupabaseConfigured) {
        const byType: Record<string, number> = {};
        const byMood: Record<string, number> = {};

        localCitations.forEach((c) => {
          byType[c.source_type] = (byType[c.source_type] || 0) + 1;
          c.moods.forEach((m) => {
            byMood[m] = (byMood[m] || 0) + 1;
          });
        });

        return {
          stats: { total: localCitations.length, byType, byMood },
          error: null,
        };
      }

      try {
        const { data, error } = await supabase.from('citations').select('*');

        if (error) throw error;

        const citations = data || [];
        const byType: Record<string, number> = {};
        const byMood: Record<string, number> = {};

        citations.forEach((c) => {
          byType[c.source_type] = (byType[c.source_type] || 0) + 1;
          c.moods.forEach((m: string) => {
            byMood[m] = (byMood[m] || 0) + 1;
          });
        });

        return {
          stats: { total: citations.length, byType, byMood },
          error: null,
        };
      } catch (error) {
        console.error('Error fetching stats:', error);
        return {
          stats: { total: 0, byType: {}, byMood: {} },
          error: error as Error,
        };
      }
    },
  },

  // ===== PROFILS =====
  profiles: {
    async getById(userId: string): Promise<{ profile: Profile | null; error: Error | null }> {
      if (!isSupabaseConfigured) {
        return { profile: null, error: null };
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        return { profile: data, error: null };
      } catch (error) {
        console.error('Error fetching profile:', error);
        return { profile: null, error: error as Error };
      }
    },

    async upsert(profile: Partial<Profile> & { id: string }): Promise<{ error: Error | null }> {
      if (!isSupabaseConfigured) {
        return { error: null };
      }

      try {
        const { error } = await supabase.from('profiles').upsert(profile);
        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Error upserting profile:', error);
        return { error: error as Error };
      }
    },
  },

  // ===== FAVORIS =====
  favorites: {
    async getByUserId(userId: string): Promise<{ favoriteIds: string[]; error: Error | null }> {
      if (!isSupabaseConfigured) {
        // Utiliser localStorage en mode démo
        const stored = localStorage.getItem('noor_favorites');
        return { favoriteIds: stored ? JSON.parse(stored) : [], error: null };
      }

      try {
        const { data, error } = await supabase
          .from('user_favorites')
          .select('citation_id')
          .eq('user_id', userId);

        if (error) throw error;
        return { favoriteIds: data?.map((f) => f.citation_id) || [], error: null };
      } catch (error) {
        console.error('Error fetching favorites:', error);
        return { favoriteIds: [], error: error as Error };
      }
    },

    async add(userId: string, citationId: string): Promise<{ error: Error | null }> {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('noor_favorites');
        const favorites = stored ? JSON.parse(stored) : [];
        if (!favorites.includes(citationId)) {
          favorites.push(citationId);
          localStorage.setItem('noor_favorites', JSON.stringify(favorites));
        }
        return { error: null };
      }

      try {
        const { error } = await supabase
          .from('user_favorites')
          .insert({ user_id: userId, citation_id: citationId });

        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Error adding favorite:', error);
        return { error: error as Error };
      }
    },

    async remove(userId: string, citationId: string): Promise<{ error: Error | null }> {
      if (!isSupabaseConfigured) {
        const stored = localStorage.getItem('noor_favorites');
        const favorites = stored ? JSON.parse(stored) : [];
        const filtered = favorites.filter((id: string) => id !== citationId);
        localStorage.setItem('noor_favorites', JSON.stringify(filtered));
        return { error: null };
      }

      try {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('citation_id', citationId);

        if (error) throw error;
        return { error: null };
      } catch (error) {
        console.error('Error removing favorite:', error);
        return { error: error as Error };
      }
    },
  },

  // ===== AUTH =====
  auth: {
    async getSession() {
      if (!isSupabaseConfigured) {
        return { session: null, error: null };
      }

      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    },

    async signInWithEmail(email: string, password: string) {
      if (!isSupabaseConfigured) {
        return { user: null, error: new Error('Supabase non configuré') };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { user: data.user, error };
    },

    async signUp(email: string, password: string, displayName?: string) {
      if (!isSupabaseConfigured) {
        return { user: null, error: new Error('Supabase non configuré') };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: displayName },
        },
      });
      return { user: data.user, error };
    },

    async signInWithGoogle() {
      if (!isSupabaseConfigured) {
        return { data: null, error: new Error('Supabase non configuré') };
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      return { data, error };
    },

    async signOut() {
      if (!isSupabaseConfigured) {
        return { error: null };
      }

      const { error } = await supabase.auth.signOut();
      return { error };
    },

    onAuthStateChange(callback: (event: string, session: unknown) => void) {
      if (!isSupabaseConfigured) {
        return { data: { subscription: { unsubscribe: () => {} } } };
      }

      return supabase.auth.onAuthStateChange(callback);
    },
  },
};

export { isSupabaseConfigured };
