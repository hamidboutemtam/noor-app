import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Copy, Trash2 } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { SourceBadge, EmptyState } from '@/components/ui';

export function FavoritesPage() {
  const { favorites, toggleFavorite, showToast } = useApp();

  const handleCopy = async (citation: typeof favorites[0]) => {
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

  const handleRemove = (citationId: string) => {
    toggleFavorite(citationId);
    showToast('Retiré des favoris');
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
          <Heart size={24} className="text-[hsl(var(--rose))]" fill="currentColor" />
          <h1 className="font-quote text-2xl font-bold text-[hsl(var(--foreground))]">
            Mes Favoris
          </h1>
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          {favorites.length} citation{favorites.length !== 1 ? 's' : ''} sauvegardée
          {favorites.length !== 1 ? 's' : ''}
        </p>
      </motion.div>

      {/* Content */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={<Heart size={32} />}
          title="Aucun favori pour le moment"
          description="Appuie sur ❤️ pour sauvegarder tes citations préférées"
        />
      ) : (
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {favorites.map((citation, index) => (
              <motion.div
                key={citation.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.9 }}
                transition={{ 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
                className="glass-card p-5 relative overflow-hidden"
              >
                {/* Source Badge */}
                <SourceBadge type={citation.source_type} className="mb-4" />

                {/* Text */}
                <p className="font-quote text-base leading-relaxed text-[hsl(var(--foreground))] mb-3">
                  « {citation.text_fr} »
                </p>

                {/* Source */}
                {citation.source_ref && (
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mb-4 font-medium">
                    — {citation.source_ref}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-[hsl(var(--border)/0.5)]">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCopy(citation)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl btn-glass text-sm font-medium"
                  >
                    <Copy size={16} />
                    Copier
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleRemove(citation.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(var(--rose)/0.1)] text-[hsl(var(--rose))] border border-[hsl(var(--rose)/0.2)] text-sm font-medium hover:bg-[hsl(var(--rose)/0.15)] transition-colors"
                  >
                    <Trash2 size={16} />
                    Retirer
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
