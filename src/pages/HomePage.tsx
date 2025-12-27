import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Database, Sparkles } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { MoodCard, ProfileSelector } from '@/components/ui';
import { MOODS } from '@/lib/constants';
import { supabaseService, isSupabaseConfigured } from '@/services/supabase.service';
import type { Mood } from '@/types';

export function HomePage() {
  const {
    setCurrentPage,
    setSelectedMood,
    userProfile,
    setUserProfile,
    modeEpreuve,
    setModeEpreuve,
    citationsCount,
    setCitationsCount,
  } = useApp();

  useEffect(() => {
    const loadCount = async () => {
      const { count } = await supabaseService.citations.getCount();
      setCitationsCount(count);
    };
    loadCount();
  }, [setCitationsCount]);

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    setCurrentPage('citation');
  };

  return (
    <div className="px-5 pb-28 max-w-lg mx-auto">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-8"
      >
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-[hsl(var(--muted-foreground))] mb-2"
        >
          Prends un instant pour toi
        </motion.p>
        <motion.h2 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-quote text-2xl text-[hsl(var(--foreground))]"
        >
          Comment te sens-tu ?
        </motion.h2>
      </motion.div>

      {/* Stats Banner */}
      {citationsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(38_92%_50%)] text-[hsl(var(--primary-foreground))] shadow-[var(--shadow-gold)]"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Database size={20} />
              </div>
              <div>
                <p className="text-sm opacity-90">Base enrichie</p>
                <p className="text-xl font-bold">{citationsCount} citations</p>
              </div>
            </div>
            <div className="text-right">
              <Sparkles size={24} className="opacity-60" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Mode Épreuve Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <button
          onClick={() => setModeEpreuve(!modeEpreuve)}
          className={`w-full cursor-pointer rounded-2xl p-4 transition-all flex items-center justify-between ${
            modeEpreuve
              ? 'bg-gradient-to-br from-[hsl(280_70%_50%)] to-[hsl(280_70%_40%)] text-white shadow-lg'
              : 'card hover:border-[hsl(var(--primary)/0.3)]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              modeEpreuve ? 'bg-white/20' : 'bg-[hsl(var(--primary)/0.15)]'
            }`}>
              <Shield size={20} className={modeEpreuve ? 'text-white' : 'text-[hsl(var(--primary))]'} />
            </div>
            <div className="text-left">
              <p className={`font-semibold ${modeEpreuve ? 'text-white' : 'text-[hsl(var(--foreground))]'}`}>
                Mode Épreuve
              </p>
              <p className={`text-xs ${modeEpreuve ? 'text-white/70' : 'text-[hsl(var(--muted-foreground))]'}`}>
                Messages de patience et réconfort
              </p>
            </div>
          </div>
          <div className={`w-12 h-7 rounded-full relative transition-colors ${
            modeEpreuve ? 'bg-white/30' : 'bg-[hsl(var(--muted))]'
          }`}>
            <motion.div 
              animate={{ x: modeEpreuve ? 22 : 3 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-lg"
            />
          </div>
        </button>
      </motion.div>

      {/* Mood Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-8"
      >
        {MOODS.map((mood, index) => (
          <MoodCard
            key={mood.id}
            mood={mood.id}
            onClick={() => handleMoodSelect(mood.id)}
            index={index}
          />
        ))}
      </motion.div>

      {/* Profile Selector */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-5"
      >
        <p className="text-xs text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3 font-medium">
          Mon profil
        </p>
        <ProfileSelector value={userProfile} onChange={setUserProfile} />
      </motion.div>
    </div>
  );
}
