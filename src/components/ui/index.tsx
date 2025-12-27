import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Heart,
  Settings,
  RefreshCw,
  Copy,
  ChevronLeft,
  Shield,
  Moon,
  Sun,
  Trash2,
  Star,
  Database,
  Wifi,
  WifiOff,
  Sparkles,
  Share2,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { SOURCE_LABELS, SOURCE_COLORS, MOODS } from '@/lib/constants';
import type { SourceType, Mood as MoodType } from '@/types';
import { isSupabaseConfigured } from '@/services/supabase.service';

// ===== ICONS EXPORT =====
export const Icons = {
  Home,
  Heart,
  Settings,
  RefreshCw,
  Copy,
  ChevronLeft,
  Shield,
  Moon,
  Sun,
  Trash2,
  Star,
  Database,
  Wifi,
  WifiOff,
  Sparkles,
  Share2,
};

// ===== HEADER =====
export function Header() {
  const { currentPage, citationsCount, darkMode, setDarkMode } = useApp();

  if (currentPage === 'citation') return null;

  return (
    <header className="sticky top-0 z-50 glass border-b border-[hsl(var(--border)/0.5)] safe-top">
      <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="logo-glow w-12 h-12 rounded-2xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(38_92%_50%)] flex items-center justify-center shadow-lg">
            <span className="text-2xl">☪</span>
          </div>
          <div>
            <h1 className="font-quote text-2xl font-bold text-gradient-gold">Nour</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              Une parole de lumière...
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Connection indicator */}
          <div className={`flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-full ${
            isSupabaseConfigured 
              ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]' 
              : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
          }`}>
            {isSupabaseConfigured ? <Wifi size={10} /> : <WifiOff size={10} />}
            <span className="hidden sm:inline">{citationsCount}</span>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-10 h-10 rounded-xl bg-[hsl(var(--muted))] flex items-center justify-center text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/0.8)] transition-colors"
          >
            <motion.div
              initial={false}
              animate={{ rotate: darkMode ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </motion.div>
          </button>
        </div>
      </div>
    </header>
  );
}

// ===== BOTTOM NAVIGATION =====
export function BottomNav() {
  const { currentPage, setCurrentPage, favoritesCount } = useApp();

  const navItems = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'favorites', icon: Heart, label: 'Favoris', badge: favoritesCount },
    { id: 'settings', icon: Settings, label: 'Réglages' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-[hsl(var(--border)/0.5)] safe-bottom z-50">
      <div className="max-w-lg mx-auto flex justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = currentPage === item.id || (item.id === 'home' && currentPage === 'citation');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`relative flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                isActive 
                  ? 'text-[hsl(var(--primary))]' 
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
            >
              <div className="relative">
                <Icon 
                  size={22} 
                  fill={item.id === 'favorites' && isActive ? 'currentColor' : 'none'}
                  strokeWidth={isActive ? 2.5 : 2}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>
              <span className="text-[11px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-dot"
                  className="absolute -bottom-0.5 w-1.5 h-1.5 bg-[hsl(var(--primary))] rounded-full"
                  style={{ boxShadow: '0 0 10px hsl(var(--primary) / 0.5)' }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ===== TOAST =====
export function Toast() {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast.visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={`toast ${toast.type === 'success' ? 'toast-success' : 'toast-error'}`}
        >
          <span className="flex items-center gap-2">
            {toast.type === 'success' && <Sparkles size={16} />}
            {toast.message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ===== SOURCE BADGE =====
interface SourceBadgeProps {
  type: SourceType;
  className?: string;
}

export function SourceBadge({ type, className = '' }: SourceBadgeProps) {
  const badgeClass = {
    quran: 'badge-quran',
    hadith_sahih: 'badge-hadith',
    hadith: 'badge-hadith',
    action: 'badge-action',
    rappel: 'badge-rappel',
    sagesse: 'badge-rappel',
  }[type] || 'badge-action';

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {SOURCE_LABELS[type]}
    </span>
  );
}

// ===== MOOD CARD =====
interface MoodCardProps {
  mood: MoodType;
  onClick: () => void;
  index?: number;
}

export function MoodCard({ mood, onClick, index = 0 }: MoodCardProps) {
  const moodData = MOODS.find((m) => m.id === mood);
  if (!moodData) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 25 }}
      onClick={onClick}
      className="mood-card card p-5 flex flex-col items-center gap-2 text-center"
    >
      <motion.span 
        className="text-4xl mb-1"
        whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.4 }}
      >
        {moodData.emoji}
      </motion.span>
      <span className="text-sm font-semibold text-[hsl(var(--foreground))]">
        {moodData.label}
      </span>
      <span className="text-[11px] text-[hsl(var(--muted-foreground))] leading-tight">
        {moodData.description}
      </span>
    </motion.button>
  );
}

// ===== LOADING SPINNER =====
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4',
  };

  return <div className={`spinner ${sizes[size]} ${className}`} />;
}

// ===== TOGGLE SWITCH =====
interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function ToggleSwitch({ checked, onChange, label, description, icon }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center justify-between p-4 card hover:bg-[hsl(var(--card-hover))]"
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-11 h-11 rounded-xl bg-[hsl(var(--primary)/0.15)] flex items-center justify-center text-[hsl(var(--primary))]">
            {icon}
          </div>
        )}
        <div className="text-left">
          {label && <div className="font-semibold text-[hsl(var(--foreground))]">{label}</div>}
          {description && <div className="text-xs text-[hsl(var(--muted-foreground))]">{description}</div>}
        </div>
      </div>
      <div
        className={`w-12 h-7 rounded-full transition-colors relative ${
          checked ? 'bg-[hsl(var(--primary))]' : 'bg-[hsl(var(--muted))]'
        }`}
      >
        <motion.div
          animate={{ x: checked ? 22 : 3 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-[3px] w-[22px] h-[22px] bg-white rounded-full shadow-lg"
        />
      </div>
    </button>
  );
}

// ===== PROFILE SELECTOR =====
interface ProfileSelectorProps {
  value: 'particulier' | 'entrepreneur';
  onChange: (value: 'particulier' | 'entrepreneur') => void;
}

export function ProfileSelector({ value, onChange }: ProfileSelectorProps) {
  return (
    <div className="flex gap-3">
      {(['particulier', 'entrepreneur'] as const).map((profile) => (
        <motion.button
          key={profile}
          onClick={() => onChange(profile)}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 py-4 px-4 rounded-xl font-semibold text-sm transition-all ${
            value === profile
              ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] border-2 border-[hsl(var(--primary))] shadow-[var(--shadow-gold)]'
              : 'bg-transparent text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] hover:border-[hsl(var(--primary)/0.3)]'
          }`}
        >
          {profile === 'particulier' ? '👤 Particulier' : '💼 Entrepreneur'}
        </motion.button>
      ))}
    </div>
  );
}

// ===== EMPTY STATE =====
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16 px-6"
    >
      <div className="w-20 h-20 mx-auto mb-5 bg-[hsl(var(--muted))] rounded-full flex items-center justify-center text-[hsl(var(--muted-foreground))]">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">{title}</h3>
      {description && <p className="text-sm text-[hsl(var(--muted-foreground))] mb-6">{description}</p>}
      {action}
    </motion.div>
  );
}

// ===== ACTION BUTTON =====
interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  variant?: 'gold' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  active?: boolean;
}

export function ActionButton({
  onClick,
  icon,
  label,
  variant = 'glass',
  size = 'md',
  className = '',
  disabled = false,
  active = false,
}: ActionButtonProps) {
  const variants = {
    gold: 'btn-gold',
    glass: `btn-glass ${active ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))]' : ''}`,
    ghost: 'bg-transparent text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]',
    danger: 'bg-[hsl(var(--rose)/0.1)] text-[hsl(var(--rose))] border border-[hsl(var(--rose)/0.3)] hover:bg-[hsl(var(--rose)/0.2)]',
  };

  const sizes = {
    sm: 'w-10 h-10 rounded-lg',
    md: 'w-14 h-14 rounded-xl',
    lg: label ? 'h-14 px-6 rounded-xl gap-2.5' : 'w-16 h-16 rounded-2xl',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className={`flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon}
      {label && <span className="font-semibold text-sm">{label}</span>}
    </motion.button>
  );
}

// ===== SKELETON LOADER =====
export function SkeletonCard() {
  return (
    <div className="card p-8">
      <div className="animate-shimmer h-6 w-24 rounded-full mb-8" />
      <div className="space-y-4">
        <div className="animate-shimmer h-8 w-full rounded-lg" />
        <div className="animate-shimmer h-8 w-3/4 rounded-lg mx-auto" />
        <div className="animate-shimmer h-6 w-1/2 rounded-lg mx-auto mt-6" />
      </div>
    </div>
  );
}
