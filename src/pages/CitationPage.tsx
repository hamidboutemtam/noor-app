import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { CitationCard } from '@/components/CitationCard';
import { useCitations } from '@/hooks/useCitations';
import { MOODS } from '@/lib/constants';
import type { Citation } from '@/types';

export function CitationPage() {
  const {
    selectedMood,
    setCurrentPage,
    userProfile,
    modeEpreuve,
    toggleFavorite,
    isFavorite,
    showToast,
  } = useApp();

  const { profile } = useAuth();
  const { getCitationByMood, isLoading } = useCitations();
  const [citation, setCitation] = useState<Citation | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentMood = MOODS.find((m) => m.id === selectedMood);

  const fetchCitation = useCallback(async () => {
    if (!selectedMood) return;

    setIsAnimating(true);
    const newCitation = await getCitationByMood(
      selectedMood,
      userProfile,
      modeEpreuve,
      profile?.preferred_sources
    );
    setCitation(newCitation);
    setTimeout(() => setIsAnimating(false), 300);
  }, [selectedMood, userProfile, modeEpreuve, profile?.preferred_sources, getCitationByMood]);

  useEffect(() => {
    fetchCitation();
  }, []);

  const handleCopy = async () => {
    if (!citation) return;

    const text = citation.text_ar
      ? `${citation.text_fr}\n\n${citation.text_ar}\n\n— ${citation.source_ref || ''}`
      : `${citation.text_fr}\n\n— ${citation.source_ref || ''}`;

    try {
      await navigator.clipboard.writeText(text.trim());
      showToast('Citation copiée !');
    } catch {
      showToast('Erreur lors de la copie', 'error');
    }
  };

  const handleToggleFavorite = () => {
    if (citation) {
      toggleFavorite(citation.id, citation);
      showToast(
        isFavorite(citation.id) ? 'Retiré des favoris' : 'Ajouté aux favoris'
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-5 pb-28 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-4 mb-4">
        <button
          onClick={() => setCurrentPage('home')}
          className="w-11 h-11 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] hover:border-[var(--primary)] transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {currentMood && (
          <div className="flex items-center gap-2 bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-4 py-2">
            <span className="text-xl">{currentMood.emoji}</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {currentMood.label}
            </span>
          </div>
        )}

        <div className="w-11" />
      </div>

      {/* Citation */}
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <CitationCard
            citation={citation}
            isLoading={isLoading || isAnimating}
            isFavorite={citation ? isFavorite(citation.id) : false}
            onToggleFavorite={handleToggleFavorite}
            onRefresh={fetchCitation}
            onCopy={handleCopy}
          />
        </motion.div>
      </div>
    </div>
  );
}
