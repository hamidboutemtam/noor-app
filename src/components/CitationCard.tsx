import React from 'react';
import { motion } from 'framer-motion';
import { Heart, RefreshCw, Copy, Share2 } from 'lucide-react';
import { SourceBadge, ActionButton, SkeletonCard } from '@/components/ui';
import type { Citation } from '@/types';

interface CitationCardProps {
  citation: Citation | null;
  isLoading: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onRefresh: () => void;
  onCopy: () => void;
}

export function CitationCard({
  citation,
  isLoading,
  isFavorite,
  onToggleFavorite,
  onRefresh,
  onCopy,
}: CitationCardProps) {
  if (isLoading && !citation) {
    return <SkeletonCard />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Citation Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ 
          opacity: isLoading ? 0.6 : 1, 
          y: 0, 
          scale: isLoading ? 0.98 : 1 
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full glass-card citation-card p-8 relative"
      >
        {/* Source Badge */}
        {citation && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <SourceBadge type={citation.source_type} className="absolute top-5 left-6" />
          </motion.div>
        )}

        {/* Content */}
        <div className="mt-12">
          {isLoading ? (
            <div className="flex flex-col items-center py-8">
              <div className="spinner" />
              <p className="text-sm text-[hsl(var(--muted-foreground))] mt-4">
                Un instant de réflexion...
              </p>
            </div>
          ) : citation ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Arabic Text */}
              {citation.text_ar && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-arabic text-2xl leading-[2] text-center text-[hsl(var(--primary))] mb-6 rtl"
                >
                  {citation.text_ar}
                </motion.p>
              )}

              {/* Decorative divider */}
              {citation.text_ar && (
                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[hsl(var(--primary)/0.3)]" />
                  <span className="text-[hsl(var(--primary))]">✦</span>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[hsl(var(--primary)/0.3)]" />
                </div>
              )}

              {/* French Text */}
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-quote text-xl leading-relaxed text-center text-[hsl(var(--foreground))]"
              >
                « {citation.text_fr} »
              </motion.p>

              {/* Source Reference */}
              {citation.source_ref && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))] font-medium"
                >
                  — {citation.source_ref}
                </motion.p>
              )}
            </motion.div>
          ) : (
            <p className="text-center text-[hsl(var(--muted-foreground))]">
              Aucune citation disponible
            </p>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center justify-center gap-3"
      >
        <ActionButton
          onClick={onToggleFavorite}
          icon={
            <motion.div
              animate={isFavorite ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </motion.div>
          }
          variant="glass"
          active={isFavorite}
        />

        <ActionButton
          onClick={onRefresh}
          icon={
            <motion.div
              whileTap={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <RefreshCw size={18} />
            </motion.div>
          }
          label="Autre citation"
          variant="gold"
          size="lg"
        />

        <ActionButton
          onClick={onCopy}
          icon={<Copy size={20} />}
          variant="glass"
        />
      </motion.div>
    </div>
  );
}
