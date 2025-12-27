import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Database, RefreshCw, Sparkles, Heart, Settings, LogOut, Check } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileSelector, ActionButton } from '@/components/ui';
import { supabaseService, isSupabaseConfigured } from '@/services/supabase.service';
import { SOURCES } from '@/lib/constants';
import type { SourceType } from '@/types';

export function SettingsPage() {
  const { darkMode, setDarkMode, userProfile, setUserProfile, showToast, setCitationsCount } = useApp();
  const { signOut, user, profile } = useAuth();
  const [stats, setStats] = useState<{
    total: number;
    byType: Record<string, number>;
    byMood: Record<string, number>;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [preferredSources, setPreferredSources] = useState<SourceType[]>(
    profile?.preferred_sources || ['quran', 'hadith_sahih', 'hadith', 'action', 'rappel', 'sagesse']
  );

  // Sync preferred sources from profile
  useEffect(() => {
    if (profile?.preferred_sources) {
      setPreferredSources(profile.preferred_sources);
    }
  }, [profile?.preferred_sources]);

  useEffect(() => {
    const loadStats = async () => {
      const { stats: fetchedStats } = await supabaseService.citations.getStats();
      setStats(fetchedStats);
    };
    loadStats();
  }, []);

  const handleRefreshCitations = async () => {
    setIsRefreshing(true);
    try {
      const { count } = await supabaseService.citations.getCount();
      setCitationsCount(count);
      const { stats: fetchedStats } = await supabaseService.citations.getStats();
      setStats(fetchedStats);
      showToast('Base actualisée !');
    } catch {
      showToast('Erreur lors de l\'actualisation', 'error');
    }
    setIsRefreshing(false);
  };

  const handleProfileChange = (profile: 'particulier' | 'entrepreneur') => {
    setUserProfile(profile);
    showToast(`Profil ${profile} activé`);
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
      showToast('Déconnexion réussie', 'success');
    } catch (error) {
      console.error('Error signing out:', error);
      showToast('Erreur lors de la déconnexion', 'error');
    } finally {
      setIsSigningOut(false);
    }
  };

  const toggleSource = async (sourceId: SourceType) => {
    const newSources = preferredSources.includes(sourceId)
      ? preferredSources.filter((s) => s !== sourceId)
      : [...preferredSources, sourceId];

    // Au moins une source doit être sélectionnée
    if (newSources.length === 0) {
      showToast('Sélectionnez au moins une source', 'error');
      return;
    }

    setPreferredSources(newSources);

    // Mettre à jour en base de données
    if (user && profile) {
      try {
        await supabaseService.profiles.upsert({
          id: user.id,
          preferred_sources: newSources,
        });
        showToast('Sources mises à jour', 'success');
      } catch (error) {
        console.error('Error updating preferred sources:', error);
        showToast('Erreur lors de la mise à jour', 'error');
      }
    }
  };

  const typeLabels: Record<string, string> = {
    quran: 'Coran',
    hadith_sahih: 'Hadiths Sahih',
    hadith: 'Hadiths',
    action: 'Actions',
    rappel: 'Rappels',
    sagesse: 'Sagesses',
  };

  return (
    <div className="px-5 pb-28 max-w-lg mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <Settings size={24} className="text-[hsl(var(--primary))]" />
          <h1 className="font-quote text-2xl font-bold text-[hsl(var(--foreground))]">
            Réglages
          </h1>
        </div>
      </motion.div>

      <div className="flex flex-col gap-4">
        {/* Apparence */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5"
        >
          <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4 font-medium">
            Apparence
          </p>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[hsl(var(--primary)/0.15)] flex items-center justify-center text-[hsl(var(--primary))]">
                {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div className="text-left">
                <span className="font-semibold text-[hsl(var(--foreground))]">
                  Mode {darkMode ? 'sombre' : 'clair'}
                </span>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  {darkMode ? 'Thème nuit activé' : 'Thème jour activé'}
                </p>
              </div>
            </div>
            <div className={`w-12 h-7 rounded-full relative transition-colors ${
              darkMode ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
            }`}>
              <motion.div 
                animate={{ x: darkMode ? 22 : 3 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-lg"
              />
            </div>
          </button>
        </motion.div>

        {/* Profil */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5"
        >
          <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4 font-medium">
            Mon profil
          </p>
          <ProfileSelector value={userProfile} onChange={handleProfileChange} />
        </motion.div>

        {/* Sources préférées */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card p-5"
        >
          <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4 font-medium">
            Sources préférées
          </p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
            Choisissez les types de citations que vous souhaitez voir en priorité
          </p>
          <div className="grid grid-cols-2 gap-3">
            {SOURCES.map((source) => {
              const isSelected = preferredSources.includes(source.id);
              return (
                <motion.button
                  key={source.id}
                  onClick={() => toggleSource(source.id)}
                  whileTap={{ scale: 0.95 }}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.1)]'
                      : 'border-[hsl(var(--border))] bg-[hsl(var(--card))]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                  <div className="text-2xl mb-2">{source.emoji}</div>
                  <div className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
                    {source.label}
                  </div>
                  <div className="text-xs text-[hsl(var(--muted-foreground))]">
                    {source.description}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Base de données */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider font-medium">
              Base de données
            </p>
            <button
              onClick={handleRefreshCitations}
              disabled={isRefreshing}
              className="flex items-center gap-2 text-xs text-[hsl(var(--primary))] hover:underline disabled:opacity-50 font-medium"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              Actualiser
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-[hsl(var(--primary)/0.15)] flex items-center justify-center text-[hsl(var(--primary))]">
              <Database size={20} />
            </div>
            <div>
              <p className="font-semibold text-[hsl(var(--foreground))]">
                {stats?.total || 0} citations
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {isSupabaseConfigured ? 'Connecté à Supabase' : 'Mode démo'}
              </p>
            </div>
          </div>

          {stats && stats.total > 0 && (
            <div className="pt-4 border-t border-[hsl(var(--border))]">
              <p className="text-xs text-[hsl(var(--muted-foreground))] mb-3 font-medium">Répartition :</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <span
                    key={type}
                    className="text-xs px-3 py-1.5 rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] font-medium"
                  >
                    {typeLabels[type] || type}: {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* À propos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4 font-medium">
            À propos
          </p>

          <div className="flex items-center gap-3 mb-4">
            <div className="logo-glow w-14 h-14 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(38_92%_50%)] flex items-center justify-center text-white text-2xl shadow-lg">
              ☪
            </div>
            <div>
              <h3 className="font-quote text-xl font-bold text-gradient-gold">Nour</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Une parole de lumière...
              </p>
            </div>
          </div>

          <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed mb-4">
            Nour t'accompagne au quotidien avec des citations authentiques du Coran, 
            des hadiths sahih, et des messages de motivation alignés avec les valeurs islamiques.
          </p>

          <div className="p-4 rounded-xl bg-[hsl(var(--muted))]">
            <p className="text-xs font-semibold text-[hsl(var(--foreground))] mb-2 flex items-center gap-2">
              <Sparkles size={14} className="text-[hsl(var(--primary))]" />
              Nos engagements
            </p>
            <ul className="text-xs text-[hsl(var(--muted-foreground))] space-y-1.5">
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--primary))]" />
                Sources authentiques uniquement
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--primary))]" />
                Aucune confusion religieuse
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--primary))]" />
                Motivation sans manipulation
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-[hsl(var(--primary))]" />
                Respect total des textes sacrés
              </li>
            </ul>
          </div>

          <p className="text-center text-xs text-[hsl(var(--muted-foreground))] mt-4">
            Version 1.0.0 • Fait avec <Heart size={12} className="inline text-[hsl(var(--rose))]" fill="currentColor" />
          </p>
        </motion.div>

        {/* Compte */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card p-5"
        >
          <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4 font-medium">
            Compte
          </p>

          {/* Info utilisateur */}
          {user && (
            <div className="mb-4 p-4 rounded-xl bg-[hsl(var(--muted))]">
              <p className="text-sm font-semibold text-[hsl(var(--foreground))] mb-1">
                {profile?.display_name || user.email}
              </p>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                {user.email}
              </p>
            </div>
          )}

          {/* Bouton de déconnexion */}
          <ActionButton
            onClick={handleSignOut}
            icon={<LogOut size={20} />}
            label={isSigningOut ? 'Déconnexion...' : 'Se déconnecter'}
            variant="danger"
            size="lg"
            disabled={isSigningOut}
            className="w-full"
          />
        </motion.div>
      </div>
    </div>
  );
}
