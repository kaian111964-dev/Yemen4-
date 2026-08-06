import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { YEMEN4_LOGO_URL } from '../data/initialData';
import { Radio, Tv, Settings, Menu, X, Home, Newspaper, Globe, TrendingUp, Trophy, Cpu, Video, Calendar, Phone } from 'lucide-react';

export const HeaderNav: React.FC = () => {
  const { currentView, setCurrentView, selectedCategory, setSelectedCategory, navigateToCategory, isDarkMode } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'الرئيسية', icon: Home, isPage: true },
    { id: 'الأخبار', label: 'الأخبار', icon: Newspaper, isCategory: true },
    { id: 'السياسة', label: 'السياسة', icon: Globe, isCategory: true },
    { id: 'الاقتصاد', label: 'الاقتصاد', icon: TrendingUp, isCategory: true },
    { id: 'الرياضة', label: 'الرياضة', icon: Trophy, isCategory: true },
    { id: 'التكنولوجيا', label: 'التكنولوجيا', icon: Cpu, isCategory: true },
    { id: 'videos', label: 'الفيديو', icon: Video, isPage: true },
    { id: 'live', label: 'البث المباشر', icon: Tv, isPage: true, isLive: true },
    { id: 'program', label: 'الجدول والبرامج', icon: Calendar, isPage: true },
    { id: 'admin', label: 'yemen4 ad', icon: Settings, isPage: true, isAdminBtn: true },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isPage) {
      setCurrentView(item.id as any);
    } else if (item.isCategory) {
      navigateToCategory(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className={`backdrop-blur-md border-b sticky top-0 z-40 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#0e1726]/95 border-slate-800/80 shadow-xl text-slate-100' 
        : 'bg-white/95 border-slate-200/90 shadow-md text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('home')}>
          <img
            src={YEMEN4_LOGO_URL}
            alt="شعار يمن 4 HD"
            className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_4px_12px_rgba(217,4,41,0.25)] transition-transform hover:scale-105"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive =
              (item.isPage && currentView === item.id) ||
              (item.isCategory && currentView === 'category' && selectedCategory === item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`relative px-3 py-2 rounded-lg text-sm font-extrabold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : isDarkMode
                      ? 'text-slate-200 hover:text-white hover:bg-slate-800/70'
                      : 'text-slate-800 hover:text-red-600 hover:bg-slate-100'
                }`}
              >
                {item.isLive ? (
                  <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                ) : null}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Left Actions: Admin CMS + Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('admin')}
            title="لوحة تحكم إدارة المحتوى (yemen4 ad)"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-black transition-all shadow-md ${
              isDarkMode
                ? 'bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 hover:border-red-500'
                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 hover:border-red-400'
            }`}
          >
            <Settings className="w-4 h-4 text-red-500 animate-spin-slow" />
            <span className="font-extrabold tracking-wide">yemen4 ad</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg ${
              isDarkMode ? 'bg-slate-800 text-slate-200 hover:text-white' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-2 animate-fadeIn ${
          isDarkMode ? 'bg-[#0a101d] border-slate-800' : 'bg-white border-slate-200 shadow-lg'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold text-sm text-right transition-colors ${
                  isDarkMode
                    ? 'text-slate-200 hover:bg-slate-800'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 text-red-500" />
                <span>{item.label}</span>
                {item.isLive && (
                  <span className="mr-auto bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    مباشر الآن
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
