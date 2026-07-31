import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderTop } from './components/HeaderTop';
import { HeaderNav } from './components/HeaderNav';
import { TickerBar } from './components/TickerBar';
import { HeroSection } from './components/HeroSection';
import { LatestNewsGrid } from './components/LatestNewsGrid';
import { HomeCategorySections } from './components/HomeCategorySections';
import { CategoryBadges } from './components/CategoryBadges';
import { ThreeColumnWidgets } from './components/ThreeColumnWidgets';
import { MediaProgramsSection } from './components/MediaProgramsSection';
import { QuickActionBar } from './components/QuickActionBar';
import { Footer } from './components/Footer';
import { LiveStreamModalPage } from './components/LiveStreamModalPage';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { CategoryViewPage } from './components/CategoryViewPage';
import { ProgramsPage } from './components/ProgramsPage';
import { VideosPage } from './components/VideosPage';
import { AdminCMSModal } from './components/AdminCMSModal';
import { UserProfileModal } from './components/UserProfileModal';
import { InfoPagesView } from './components/InfoPagesView';
import { LoginModal } from './components/LoginModal';
import { ToastNotification } from './components/ToastNotification';

const AppContent: React.FC = () => {
  const { currentView, isLoginModalOpen, isDarkMode } = useApp();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between font-['Cairo',sans-serif] selection:bg-red-600 selection:text-white transition-colors duration-300 ${
        isDarkMode ? 'bg-[#070b14] text-slate-100' : 'bg-[#f4f6f9] text-slate-900'
      }`}
    >
      {/* Top Bars */}
      <div>
        <HeaderTop />
        <HeaderNav />
        <TickerBar />

        {/* View Router */}
        <main className="flex-1">
          {currentView === 'home' && (
            <div className="space-y-4">
              <HeroSection />
              <LatestNewsGrid />
              <HomeCategorySections />
              <CategoryBadges />
              <ThreeColumnWidgets />
              <MediaProgramsSection />
              <QuickActionBar />
            </div>
          )}

          {currentView === 'live' && <LiveStreamModalPage />}
          {currentView === 'article' && <ArticleDetailPage />}
          {currentView === 'category' && <CategoryViewPage />}
          {currentView === 'program' && <ProgramsPage />}
          {currentView === 'schedule' && <ProgramsPage />}
          {currentView === 'videos' && <VideosPage />}
          {currentView === 'admin' && <AdminCMSModal />}
          {currentView === 'profile' && <UserProfileModal />}
          {['about', 'contact', 'frequencies', 'privacy', 'cookies', 'rss'].includes(currentView) && <InfoPagesView />}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Notifications */}
      {isLoginModalOpen && <LoginModal />}
      <ToastNotification />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
