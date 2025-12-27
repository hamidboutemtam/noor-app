import type { MoodOption, SourceType } from '@/types';

export const MOODS: MoodOption[] = [
  {
    id: 'stress',
    label: 'Tendu',
    emoji: '🌊',
    color: 'hsl(346 77% 49.8%)',
    description: 'Besoin de relâcher la pression',
  },
  {
    id: 'fatigue',
    label: 'Épuisé',
    emoji: '🌙',
    color: 'hsl(270 50% 60%)',
    description: 'Retrouver de l\'énergie',
  },
  {
    id: 'déprime',
    label: 'Découragé',
    emoji: '🌱',
    color: 'hsl(220 70% 55%)',
    description: 'Chercher un peu de lumière',
  },
  {
    id: 'motivation',
    label: 'Déterminé',
    emoji: '🔥',
    color: 'hsl(15 90% 55%)',
    description: 'Nourrir cette énergie',
  },
  {
    id: 'procrastination',
    label: 'Bloqué',
    emoji: '🔑',
    color: 'hsl(30 80% 55%)',
    description: 'Se remettre en mouvement',
  },
  {
    id: 'gratitude',
    label: 'Reconnaissant',
    emoji: '✨',
    color: 'hsl(42 87% 55%)',
    description: 'Cultiver cette gratitude',
  },
  {
    id: 'patience',
    label: 'En attente',
    emoji: '🕊️',
    color: 'hsl(200 80% 50%)',
    description: 'Trouver la paix intérieure',
  },
  {
    id: 'epreuve',
    label: 'En épreuve',
    emoji: '💎',
    color: 'hsl(280 70% 50%)',
    description: 'Traverser ce moment difficile',
  },
];

export const SOURCE_LABELS: Record<SourceType, string> = {
  quran: 'CORAN',
  hadith_sahih: 'HADITH SAHIH',
  hadith: 'HADITH',
  action: 'ACTION',
  rappel: 'RAPPEL',
  sagesse: 'SAGESSE',
};

export const SOURCE_COLORS: Record<SourceType, string> = {
  quran: '#059669',
  hadith_sahih: '#0891b2',
  hadith: '#0ea5e9',
  action: '#d97706',
  rappel: '#7c3aed',
  sagesse: '#ec4899',
};

export const PROFILES = [
  {
    id: 'particulier' as const,
    label: 'Particulier',
    emoji: '👤',
    description: 'Pour le quotidien',
  },
  {
    id: 'entrepreneur' as const,
    label: 'Entrepreneur',
    emoji: '💼',
    description: 'Pour les projets',
  },
];

export const SOURCES = [
  {
    id: 'quran' as SourceType,
    label: 'Coran',
    emoji: '📖',
    color: SOURCE_COLORS.quran,
    description: 'Versets du Saint Coran',
  },
  {
    id: 'hadith_sahih' as SourceType,
    label: 'Hadiths Sahih',
    emoji: '✨',
    color: SOURCE_COLORS.hadith_sahih,
    description: 'Hadiths authentifiés',
  },
  {
    id: 'hadith' as SourceType,
    label: 'Hadiths',
    emoji: '💫',
    color: SOURCE_COLORS.hadith,
    description: 'Traditions prophétiques',
  },
  {
    id: 'action' as SourceType,
    label: 'Actions',
    emoji: '🎯',
    color: SOURCE_COLORS.action,
    description: 'Conseils pratiques',
  },
  {
    id: 'rappel' as SourceType,
    label: 'Rappels',
    emoji: '🌟',
    color: SOURCE_COLORS.rappel,
    description: 'Rappels spirituels',
  },
  {
    id: 'sagesse' as SourceType,
    label: 'Sagesses',
    emoji: '💎',
    color: SOURCE_COLORS.sagesse,
    description: 'Paroles de sagesse',
  },
];
