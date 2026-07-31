import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Sun, Moon, Bell, User, CloudSun, Calendar, Facebook, Twitter, Instagram, Send, Youtube, CheckCircle, X, HardDrive } from 'lucide-react';
import { GoogleDriveModal } from './GoogleDriveModal';

export const HeaderTop: React.FC = () => {
  const {
    cmsData,
    user,
    setIsLoginModalOpen,
    isDarkMode,
    setIsDarkMode,
    unreadCount,
    notifications,
    markAllNotificationsAsRead,
    searchQuery,
    setSearchQuery,
    setCurrentView,
    navigateToArticle
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isDriveOpen, setIsDriveOpen] = useState(false);

  const todayDate = new Date().toLocaleDateString('ar-YE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const filteredSearchArticles = searchQuery.trim()
    ? cmsData.articles.filter(a =>
        a.title.includes(searchQuery) ||
        a.excerpt.includes(searchQuery) ||
        a.category.includes(searchQuery)
      )
    : [];

  return (
    <div className="bg-[#0b1320] border-b border-slate-800/80 text-xs text-slate-300 py-2 px-4 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Right Info: Date + Weather */}
        <div className="flex items-center gap-4 text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-red-500" />
            <span>{todayDate}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 font-medium bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-200">{cmsData.weather.city}</span>
            <span className="text-amber-400 font-bold">{cmsData.weather.temp}°</span>
            <span className="text-slate-400">({cmsData.weather.condition})</span>
          </div>
        </div>

        {/* Center: Search Input */}
        <div className="relative flex-1 max-w-sm mx-2">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="بحث في الموقع..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full bg-[#131f33] text-slate-100 placeholder-slate-400 text-xs rounded-full py-1.5 pl-3 pr-9 border border-slate-700/60 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[#0e1726] border border-slate-700 rounded-lg shadow-2xl z-50 max-h-72 overflow-y-auto p-2">
              <div className="text-[10px] text-slate-400 font-bold px-2 py-1 mb-1 border-b border-slate-800">
                نتائج البحث ({filteredSearchArticles.length})
              </div>
              {filteredSearchArticles.length > 0 ? (
                filteredSearchArticles.map(art => (
                  <div
                    key={art.id}
                    onClick={() => {
                      navigateToArticle(art.id);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-slate-800/80 rounded-md cursor-pointer transition-colors"
                  >
                    <img src={art.imageUrl} alt="" className="w-10 h-10 object-cover rounded" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-200 font-semibold truncate">{art.title}</div>
                      <div className="text-[10px] text-red-400">{art.category}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-slate-400 text-xs">لا توجد نتائج مطابقة</div>
              )}
            </div>
          )}
        </div>

        {/* Left Controls: Socials + Notifications + Dark Mode + User */}
        <div className="flex items-center gap-3">
          {/* Social Icons */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400 border-l border-slate-800 pl-3">
            <a href="#youtube" title="YouTube" className="hover:text-red-500 transition-colors">
              <Youtube className="w-3.5 h-3.5" />
            </a>
            <a href="#telegram" title="Telegram" className="hover:text-sky-400 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </a>
            <a href="#instagram" title="Instagram" className="hover:text-pink-400 transition-colors">
              <Instagram className="w-3.5 h-3.5" />
            </a>
            <a href="#x" title="X / Twitter" className="hover:text-slate-100 transition-colors">
              <Twitter className="w-3.5 h-3.5" />
            </a>
            <a href="#facebook" title="Facebook" className="hover:text-blue-500 transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'الوضع النهاري' : 'الوضع الليلى'}
            className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-400/40 transition-all"
          >
            {isDarkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
          </button>

          {/* Google Drive Direct Button */}
          <button
            onClick={() => setIsDriveOpen(true)}
            title="Google Drive"
            className="p-1.5 rounded-full bg-slate-900 border border-slate-800 text-blue-400 hover:text-blue-300 hover:border-blue-500/40 transition-all flex items-center justify-center"
          >
            <HardDrive className="w-3.5 h-3.5" />
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              title="الإشعارات"
              className="relative p-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-red-400 transition-all"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotifOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-[#0e1726] border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#0b1320]">
                  <span className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-red-500" /> الإشعارات اللحظية
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3" /> تعليم الكل كتم لقراء
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.linkArticleId) navigateToArticle(n.linkArticleId);
                          setIsNotifOpen(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-red-950/20 border-r-2 border-red-500' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className={`font-bold text-[11px] ${
                            n.type === 'breaking' ? 'text-red-500' : n.type === 'live' ? 'text-emerald-400' : 'text-sky-400'
                          }`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-500">{n.time}</span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 text-xs">لا توجد إشعارات حالياً</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Login Button */}
          {user ? (
            <button
              onClick={() => setCurrentView('profile')}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-full text-slate-200 transition-all"
            >
              <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover border border-red-500/40" />
              <span className="font-semibold max-w-[100px] truncate">{user.name}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full font-bold transition-all shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>

      {/* Google Drive Integration Modal */}
      <GoogleDriveModal isOpen={isDriveOpen} onClose={() => setIsDriveOpen(false)} />
    </div>
  );
};
