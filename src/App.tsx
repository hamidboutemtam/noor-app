import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Header, BottomNav, Toast } from '@/components/ui';
import { HomePage, CitationPage, FavoritesPage, SettingsPage, LoginPage, LoadingScreen } from '@/pages';

function AppContent() {
  const { user, loading } = useAuth();
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'citation':
        return <CitationPage />;
      case 'favorites':
        return <FavoritesPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  // Loading screen pendant la vérification de session
  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect vers login si non authentifié
  if (!user) {
    return <LoginPage />;
  }

  // App normale si authentifié
  return (
    <div className="min-h-screen bg-[var(--surface-1)]">
      <Header />
      <main>{renderPage()}</main>
      <BottomNav />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}
