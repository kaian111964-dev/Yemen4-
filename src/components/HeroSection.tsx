import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Pause, Eye, Maximize2, Radio, ChevronLeft, ChevronRight, Clock, Sparkles, Flame, Share2, Check } from 'lucide-react';
import { YEMEN4_LOGO_URL, DEFAULT_LIVE_POSTER_URL } from '../data/initialData';
import { sortArticles } from '../lib/utils';

export const HeroSection: React.FC = () => {
  const { cmsData, navigateToArticle, setCurrentView, isDarkMode, triggerToast } = useApp();
  
  const settings = cmsData.siteSettings || {
    sliderAutoPlay: true,
    sliderInterval: 5,
    sliderPauseOnHover: true,
    heroSectionTitle: 'السلايدر الإخباري الرئيسي',
    breakingSectionTitle: 'أهم الأخبار الآن',
    borderRadius: 'rounded-3xl',
    showHeroSlider: true,
    showBreakingTimeline: true,
  };

  // Sort articles based on newsSortBy setting (date, priority, views)
  const sortedArticles = sortArticles(cmsData.articles, settings.newsSortBy);

  // Prepare slides list from articles flagged with isHero or default sorted
  const heroArticles = sortedArticles.filter(a => a.isHero);
  const slides = heroArticles.length > 0 ? heroArticles : sortedArticles.slice(0, 5);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const currentArticle = slides[activeSlide] || cmsData.articles[0];

  const autoPlay = settings.sliderAutoPlay !== false;
  const intervalSeconds = settings.sliderInterval || 5;

  // Autoplay timer logic
  useEffect(() => {
    if (isPaused && settings.sliderPauseOnHover) return;
    if (!autoPlay || slides.length <= 1) return;

    // Main slide increment timer
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
      setProgress(0);
    }, intervalSeconds * 1000);

    // Progress bar animation timer
    const stepMs = 50;
    const increment = (stepMs / (intervalSeconds * 1000)) * 100;
    const progressTimer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + increment));
    }, stepMs);

    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [isPaused, autoPlay, slides.length, intervalSeconds, settings.sliderPauseOnHover, activeSlide]);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  const handleSelectSlide = (index: number) => {
    setActiveSlide(index);
    setProgress(0);
  };

  const handleShareSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    triggerToast('تم نسخ رابط الخبر', 'يمكنك الآن مشاركته بسهولة عبر وسائل التواصل.', 'system');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Dynamic "أهم الأخبار الآن" timeline derived from articles flagged with isBreaking or top recent
  const breakingArticles = sortedArticles.filter(a => a.isBreaking);
  const topTimelineNews = breakingArticles.length > 0 ? breakingArticles.slice(0, 5) : sortedArticles.slice(0, 5);

  const radiusClass = settings.borderRadius || 'rounded-3xl';
  const pyClass = settings.sectionSpacing || 'py-6';

  const showSlider = settings.showHeroSlider !== false;
  const showTimeline = settings.showBreakingTimeline !== false;

  if (!showSlider && !showTimeline) {
    return null;
  }

  return (
    <section className={`${pyClass} px-4 max-w-7xl mx-auto`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Main Luxury Hero Slider (8 cols) */}
        {showSlider && (
          <div 
            className={`lg:col-span-8 flex flex-col justify-between relative ${radiusClass} overflow-hidden min-h-[460px] lg:min-h-[520px] bg-slate-950 border border-slate-800/80 shadow-2xl group transition-all`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
          {/* Animated Progress Bar at Top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-30">
            <div 
              className="h-full bg-gradient-to-r from-red-600 via-amber-400 to-red-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          {/* Slide Background Image & Ken Burns Zoom */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              key={currentArticle.id}
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out brightness-90 animate-fadeIn"
            />
            {/* Multi-layered cinematic gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-[#060a12]/75 to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60"></div>
          </div>

          {/* Top Header Controls / Badges */}
          <div className="relative p-6 flex flex-wrap items-center justify-between z-20 gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg shadow-red-600/40 flex items-center gap-1.5 animate-pulse">
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>تغطية عاجلة</span>
              </span>

              <span className="bg-slate-900/90 border border-slate-700/80 text-red-400 font-extrabold text-xs px-3 py-1 rounded-full backdrop-blur-md">
                {currentArticle.category}
              </span>
            </div>

            {/* Slide Counter & Pause Status */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="bg-black/60 hover:bg-black/90 text-white p-2 rounded-full border border-white/10 backdrop-blur-md transition-all text-xs flex items-center gap-1.5"
                title={isPaused ? "تشغيل التلقائي" : "إيقاف مؤقت"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
                <span className="hidden sm:inline text-[10px] font-bold text-slate-300">
                  {isPaused ? 'موقّف' : 'مباشر'}
                </span>
              </button>

              <span className="bg-black/60 border border-white/10 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-md">
                0{activeSlide + 1} / 0{slides.length}
              </span>
            </div>
          </div>

          {/* Navigation Arrows (Left & Right Overlay) */}
          <button
            onClick={handleNextSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all scale-90 sm:scale-100 hover:scale-110 active:scale-95"
            title="الخبر التالي"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handlePrevSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-red-600 text-white border border-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl transition-all scale-90 sm:scale-100 hover:scale-110 active:scale-95"
            title="الخبر السابق"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Bottom Content Area */}
          <div className="relative p-6 sm:p-8 z-20 mt-auto max-w-4xl space-y-4">
            
            {/* Meta Stats Row */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                <span>{currentArticle.timeAgo}</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentArticle.viewsCount.toLocaleString('ar-YE')} مشاهدة</span>
              </span>
              {currentArticle.author && (
                <span className="text-slate-400 border-r border-slate-700 pr-3">
                  بقلم / {typeof currentArticle.author === 'object' ? currentArticle.author.name : currentArticle.author}
                </span>
              )}
            </div>

            {/* Headline */}
            <h1
              onClick={() => navigateToArticle(currentArticle.id)}
              className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug hover:text-red-400 cursor-pointer transition-colors drop-shadow-md"
            >
              {currentArticle.title}
            </h1>

            {/* Excerpt */}
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed line-clamp-2 max-w-2xl">
              {currentArticle.excerpt}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateToArticle(currentArticle.id)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center gap-2 shadow-xl shadow-red-600/40 transition-all hover:scale-105 active:scale-95"
              >
                <span>اقرأ التقرير الكامل</span>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('videos')}
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700/80 font-extrabold text-xs sm:text-sm px-5 py-3 rounded-xl flex items-center gap-2 backdrop-blur-md transition-all hover:border-red-500/50"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>التغطية المرئية</span>
              </button>

              <button
                onClick={handleShareSlide}
                className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/80 backdrop-blur-md transition-all hover:text-white"
                title="مشاركة الخبر"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Interactive Thumbnail & Titles Selector Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-4 border-t border-slate-800/80">
              {slides.map((slide, idx) => {
                const isActive = idx === activeSlide;

                return (
                  <button
                    key={slide.id}
                    onClick={() => handleSelectSlide(idx)}
                    className={`text-right p-2 rounded-xl transition-all border flex flex-col justify-between h-16 relative overflow-hidden group/thumb ${
                      isActive
                        ? 'bg-red-950/70 border-red-500 text-white shadow-lg ring-1 ring-red-500'
                        : 'bg-slate-900/60 hover:bg-slate-800/90 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold mb-1">
                      <span className={isActive ? 'text-red-400' : 'text-slate-500'}>0{idx + 1}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span>}
                    </div>

                    <p className="text-[10px] font-bold line-clamp-1 leading-snug">
                      {slide.title}
                    </p>
                  </button>
                );
              })}
            </div>

          </div>
        </div>
        )}

        {/* Right Column: Live TV Card + Timeline News (4 cols or 12 if slider hidden) */}
        {showTimeline && (
          <div className={`${showSlider ? 'lg:col-span-4' : 'lg:col-span-12'} flex flex-col gap-6`}>
          
          {/* Live Stream Widget Card */}
          <div className={`border rounded-3xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden transition-colors ${
            isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
          }`}>
            {/* Header */}
            <div className={`flex items-center justify-between border-b pb-3 mb-3 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-red-500 animate-pulse" />
                <h3 className={`font-extrabold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>البث المباشر</h3>
              </div>
              <span className="bg-red-600/90 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                مباشر الآن
              </span>
            </div>

            {/* Screen Thumbnail */}
            <div
              onClick={() => setCurrentView('live')}
              className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video group cursor-pointer border border-slate-800 mb-3 shadow-md"
            >
              <img
                src={cmsData.liveStreamPosterUrl ?? cmsData.siteSettings?.liveStreamPosterUrl ?? DEFAULT_LIVE_POSTER_URL}
                alt="غلاف البث المباشر - قناة يمن 4 HD"
                className="w-full h-full object-contain bg-slate-950 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>
              <img
                src={YEMEN4_LOGO_URL}
                alt="Yemen 4 HD"
                className="absolute top-2 right-2 h-7 w-auto object-contain bg-black/60 p-1 rounded-md backdrop-blur-sm"
              />
            </div>

            {/* Info Bar */}
            <div className={`flex items-center justify-between text-xs p-2.5 rounded-xl border ${
              isDarkMode ? 'text-slate-400 bg-slate-900/80 border-slate-800' : 'text-slate-600 bg-slate-100 border-slate-200'
            }`}>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-red-500" />
                <span className={`font-extrabold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>125,430</span>
                <span>مشاهد</span>
              </div>
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-[10px] px-2 py-0.5 rounded font-bold">
                جودة عالية HD
              </span>
              <button onClick={() => setCurrentView('live')} className={isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"}>
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Timeline - أهم الأخبار الآن */}
          <div className={`border rounded-3xl p-5 shadow-xl flex-1 flex flex-col transition-colors ${
            isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
          }`}>
            <div className={`flex items-center justify-between border-b pb-2.5 mb-3 ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
              <h3 className={`font-extrabold text-sm flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span className="w-2 h-4 bg-red-600 rounded-sm"></span>
                <span>أهم الأخبار الآن</span>
              </h3>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {topTimelineNews.map((news, idx) => (
                <div
                  key={news.id}
                  onClick={() => navigateToArticle(news.id)}
                  className={`flex items-start gap-3 p-2 rounded-xl cursor-pointer transition-colors group ${
                    isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5 shadow">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                      <Clock className="w-3 h-3 text-red-500" />
                      <span>{news.timeAgo || news.publishDate || 'الآن'}</span>
                    </div>
                    <h4 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                      isDarkMode ? 'text-slate-200 group-hover:text-red-400' : 'text-slate-800 group-hover:text-red-600'
                    }`}>
                      {news.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('category')}
              className={`w-full mt-3 py-2 text-center text-xs font-bold border-t pt-2 transition-colors ${
                isDarkMode ? 'text-slate-400 hover:text-slate-200 border-slate-800/80' : 'text-slate-600 hover:text-slate-900 border-slate-200'
              }`}
            >
              عرض المزيد
            </button>
          </div>

        </div>
        )}

      </div>
    </section>
  );
};

