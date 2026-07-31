import React from 'react';
import { useApp } from '../context/AppContext';
import { MatchesScheduleWidget } from './MatchesScheduleWidget';
import { ChevronLeft, Eye, Clock, MapPin, Globe, FileText, Feather, Trophy, Sparkles, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
import { sortArticles } from '../lib/utils';

export const HomeCategorySections: React.FC = () => {
  const { cmsData, navigateToArticle, navigateToCategory, isDarkMode, triggerToast } = useApp();

  if (cmsData.siteSettings?.showCategorySections === false) {
    return null;
  }

  // Sort articles based on newsSortBy setting
  const sortedArticles = sortArticles(cmsData.articles, cmsData.siteSettings?.newsSortBy);

  // Helper for safe author rendering
  const getAuthorName = (author: any) => {
    if (!author) return '';
    if (typeof author === 'object') return author.name || '';
    return String(author);
  };

  const getAuthorAvatar = (author: any) => {
    if (author && typeof author === 'object' && author.avatar) {
      return author.avatar;
    }
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
  };

  const getAuthorRole = (author: any) => {
    if (author && typeof author === 'object' && author.role) {
      return author.role;
    }
    return 'كاتب ومحلل السياسي';
  };

  // Filter articles for each category
  const localArticles = sortedArticles.filter(a => a.category === 'محلي' || a.category?.includes('محلي') || a.category === 'المحافظات');
  const intlArticles = sortedArticles.filter(a => a.category === 'دولي' || a.category?.includes('دولي') || a.category === 'العالم');
  const reportArticles = sortedArticles.filter(a => a.category === 'تقارير' || a.category?.includes('تقارير') || a.category === 'تحقيق');
  const opinionArticles = sortedArticles.filter(a => a.category === 'كتابات' || a.category === 'مقالات' || a.category?.includes('كتابات'));
  const sportsArticles = sortedArticles.filter(a => a.category === 'رياضة' || a.category?.includes('رياضة'));

  // Fallbacks if user hasn't created items yet in a category
  const displayLocal = localArticles.length > 0 ? localArticles : cmsData.articles.slice(0, 4);
  const displayIntl = intlArticles.length > 0 ? intlArticles : cmsData.articles.slice(1, 4);
  const displayReports = reportArticles.length > 0 ? reportArticles : cmsData.articles.slice(2, 5);
  const displayOpinions = opinionArticles.length > 0 ? opinionArticles : cmsData.articles.slice(0, 3);
  const displaySports = sportsArticles.length > 0 ? sportsArticles : cmsData.articles.filter(a => a.category === 'رياضة');

  const handleShare = (e: React.MouseEvent, title: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    triggerToast('تم نسخ الرابط', `تم نسخ رابط: ${title}`, 'system');
  };

  const settings = cmsData.siteSettings || {};
  const radiusClass = settings.borderRadius || 'rounded-2xl';
  const pyClass = settings.sectionSpacing || 'py-6';
  const titleSizeClass = settings.sectionTitleSize || 'text-xl sm:text-2xl';
  const shadowClass = settings.cardShadow || 'shadow-xl';
  const headerColor = settings.sectionHeaderColor || '#ef4444';

  return (
    <div className={`space-y-10 ${pyClass}`}>

      {/* ======================================================== */}
      {/* 1. قسم الأخبار المحلية (LOCAL NEWS SECTION) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Section Title Bar */}
        <div className={`flex flex-wrap items-center justify-between gap-3 mb-6 border-b pb-3 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-gradient-to-b from-red-500 to-red-700 rounded-sm shadow-md shadow-red-600/30"></span>
            <div>
              <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <MapPin className="w-5 h-5 text-red-500" />
                <span>أخبار محلية والمحافظات</span>
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">تغطية ميدانية حصرية لمختلف المحافظات اليمنية والعاصمة صنعاء</p>
            </div>
          </div>

          <button
            onClick={() => navigateToCategory('محلي')}
            className={`text-xs font-bold px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-red-500/50'
                : 'bg-white border-slate-200 text-slate-700 hover:text-red-600 hover:border-red-300 shadow-sm'
            }`}
          >
            <span>جميع الأخبار المحلية</span>
            <ChevronLeft className="w-4 h-4 text-red-500" />
          </button>
        </div>

        {/* Local Grid Layout: 1 Big Featured Card + 3 Side Horizontal Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Lead Card (7 cols) */}
          {displayLocal[0] && (
            <div
              onClick={() => navigateToArticle(displayLocal[0].id)}
              className={`lg:col-span-7 border rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-300 relative min-h-[380px] ${
                isDarkMode ? 'bg-[#0e1726] border-slate-800 hover:border-red-500/50 shadow-2xl' : 'bg-white border-slate-200 hover:border-red-300 shadow-lg'
              }`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950">
                <img
                  src={displayLocal[0].imageUrl}
                  alt={displayLocal[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <span className="absolute top-4 right-4 bg-red-600 text-white font-black text-xs px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>تغطية خاصة</span>
                </span>
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-red-500 font-extrabold mb-2">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {displayLocal[0].timeAgo}</span>
                    <span className="flex items-center gap-1 text-slate-400"><Eye className="w-3.5 h-3.5" /> {displayLocal[0].viewsCount.toLocaleString('ar-YE')}</span>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-extrabold leading-snug transition-colors line-clamp-2 ${
                    isDarkMode ? 'text-white group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
                  }`}>
                    {displayLocal[0].title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                    {displayLocal[0].excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-bold">
                  {displayLocal[0].author && (
                    <span className="flex items-center gap-2">
                      <img src={getAuthorAvatar(displayLocal[0].author)} alt="" className="w-6 h-6 rounded-full object-cover border border-red-500" />
                      <span>{getAuthorName(displayLocal[0].author)}</span>
                    </span>
                  )}
                  <span className="text-red-500 font-black flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    <span>متابعة التفاصيل</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Side Cards List (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {displayLocal.slice(1, 4).map((art) => (
              <div
                key={art.id}
                onClick={() => navigateToArticle(art.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer group flex gap-3.5 items-center ${
                  isDarkMode
                    ? 'bg-[#0e1726] border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    : 'bg-white border-slate-200 hover:border-red-300 hover:shadow-md'
                }`}
              >
                <div className="relative w-32 aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-slate-900">
                  <img src={art.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] text-white font-bold px-1.5 py-0.5 rounded">
                    {art.category || 'محلي'}
                  </span>
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-1.5">
                  <h4 className={`text-xs sm:text-sm font-extrabold line-clamp-2 leading-snug transition-colors ${
                    isDarkMode ? 'text-slate-100 group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
                  }`}>
                    {art.title}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-red-500" /> {art.timeAgo}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {art.viewsCount.toLocaleString('ar-YE')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 2. قسم الأخبار الدولية (INTERNATIONAL NEWS SECTION) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className={`flex flex-wrap items-center justify-between gap-3 mb-6 border-b pb-3 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-gradient-to-b from-sky-500 to-sky-700 rounded-sm shadow-md shadow-sky-600/30"></span>
            <div>
              <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Globe className="w-5 h-5 text-sky-500" />
                <span>أخبار دولية وإقليمية</span>
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">متابعة لحظية لأبرز التطورات السياسية والاقتصادية حول العالم</p>
            </div>
          </div>

          <button
            onClick={() => navigateToCategory('دولي')}
            className={`text-xs font-bold px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-sky-500/50'
                : 'bg-white border-slate-200 text-slate-700 hover:text-sky-600 hover:border-sky-300 shadow-sm'
            }`}
          >
            <span>جميع الشؤون الدولية</span>
            <ChevronLeft className="w-4 h-4 text-sky-500" />
          </button>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayIntl.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => navigateToArticle(art.id)}
              className={`border rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#0e1726] border-slate-800/90 shadow-xl hover:border-sky-500/50 hover:shadow-2xl'
                  : 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-sky-300'
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 right-3 bg-sky-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md">
                  {art.category || 'دولي'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-2">
                    <span className="flex items-center gap-1 text-sky-500"><Clock className="w-3 h-3" /> {art.timeAgo}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {art.viewsCount.toLocaleString('ar-YE')}</span>
                  </div>

                  <h3 className={`font-black text-base leading-snug line-clamp-2 transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-sky-400' : 'text-slate-900 group-hover:text-sky-600'
                  }`}>
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span>محرر الشؤون الدولية</span>
                  <button
                    onClick={(e) => handleShare(e, art.title)}
                    className="p-1.5 hover:text-sky-400 transition-colors"
                    title="مشاركة الخبر"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ======================================================== */}
      {/* 3. قسم التقارير والتحقيقات (DEEP REPORTS & FEATURES) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
          isDarkMode ? 'bg-[#09111e] border-amber-500/20 text-slate-100' : 'bg-amber-950/5 border-amber-200 text-slate-900'
        }`}>
          {/* Decorative Amber Glow Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-amber-500/30 pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-3 h-8 bg-amber-500 rounded-sm shadow-lg shadow-amber-500/50"></span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2 text-amber-500">
                  <FileText className="w-6 h-6" />
                  <span>تقارير واستقصاءات خاصة</span>
                </h2>
                <p className={`text-xs font-semibold mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  تحقيقات ميدانية استقصائية وقراءات تحليليّة وثائقية معززة بالحقائق والبيانات
                </p>
              </div>
            </div>

            <button
              onClick={() => navigateToCategory('تقارير')}
              className="text-xs font-extrabold px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all shadow-lg flex items-center gap-1.5"
            >
              <span>أرشيف التحقيقات الكامل</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Reports Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {displayReports.slice(0, 2).map((art) => (
              <div
                key={art.id}
                onClick={() => navigateToArticle(art.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer group flex flex-col sm:flex-row gap-5 items-center ${
                  isDarkMode
                    ? 'bg-[#0e1726]/90 border-slate-800 hover:border-amber-500/60 hover:shadow-2xl'
                    : 'bg-white border-amber-200/80 hover:border-amber-400 hover:shadow-xl'
                }`}
              >
                <div className="relative w-full sm:w-44 aspect-[4/3] rounded-xl overflow-hidden shrink-0 bg-slate-950">
                  <img src={art.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 right-2 bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded shadow">
                    تحقيق خاص
                  </span>
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                    قراءة معمقة • 5 دقائق
                  </span>

                  <h3 className={`text-sm sm:text-base font-black leading-snug line-clamp-2 transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-amber-400' : 'text-slate-900 group-hover:text-amber-700'
                  }`}>
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold pt-1">
                    <span className="flex items-center gap-1.5">
                      <img src={getAuthorAvatar(art.author)} alt="" className="w-5 h-5 rounded-full object-cover border border-amber-500" />
                      <span>{getAuthorName(art.author)}</span>
                    </span>
                    <span className="text-amber-500 font-extrabold flex items-center gap-1">
                      <span>اقرأ التقرير</span>
                      <ArrowLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ======================================================== */}
      {/* 4. قسم كتابات وآراء (OPINION COLUMNS & WRITERS) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className={`flex flex-wrap items-center justify-between gap-3 mb-6 border-b pb-3 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-gradient-to-b from-purple-500 to-purple-700 rounded-sm shadow-md shadow-purple-600/30"></span>
            <div>
              <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Feather className="w-5 h-5 text-purple-500" />
                <span>كتابات وآراء</span>
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">مقالات وأعمدة تحليليّة لكبار الكُتّاب والمفكرين والمحللين السياسيين</p>
            </div>
          </div>

          <button
            onClick={() => navigateToCategory('كتابات')}
            className={`text-xs font-bold px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-purple-500/50'
                : 'bg-white border-slate-200 text-slate-700 hover:text-purple-600 hover:border-purple-300 shadow-sm'
            }`}
          >
            <span>جميع المقالات والأعمدة</span>
            <ChevronLeft className="w-4 h-4 text-purple-500" />
          </button>
        </div>

        {/* Columnists Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayOpinions.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => navigateToArticle(art.id)}
              className={`p-6 rounded-3xl border shadow-xl flex flex-col justify-between cursor-pointer group transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#0e1726] border-slate-800 hover:border-purple-500/60 hover:bg-slate-900/90'
                  : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-2xl'
              }`}
            >
              {/* Writer Header Avatar */}
              <div className="flex items-center gap-3 mb-4 border-b border-slate-800/80 pb-3">
                <img
                  src={getAuthorAvatar(art.author)}
                  alt={getAuthorName(art.author)}
                  className="w-14 h-14 rounded-full object-cover border-2 border-purple-500 shadow-md group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className={`text-sm font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {getAuthorName(art.author)}
                  </h4>
                  <span className="text-[11px] text-purple-400 font-bold block">{getAuthorRole(art.author)}</span>
                </div>
              </div>

              {/* Column Title */}
              <div className="space-y-2 flex-1">
                <h3 className={`text-base font-black leading-snug line-clamp-2 transition-colors ${
                  isDarkMode ? 'text-slate-100 group-hover:text-purple-400' : 'text-slate-900 group-hover:text-purple-600'
                }`}>
                  "{art.title}"
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              {/* Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between text-xs font-extrabold text-purple-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-400 font-normal">{art.timeAgo}</span>
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                  <span>قراءة المقال</span>
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ======================================================== */}
      {/* 5. قسم الرياضة + جدول المباريات (SPORTS & MATCHES SCHEDULE) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4">
        {/* Full Interactive Matches Schedule Hub Component */}
        <MatchesScheduleWidget />

        <div className={`flex flex-wrap items-center justify-between gap-3 mb-6 border-b pb-3 ${
          isDarkMode ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className="w-3 h-8 bg-gradient-to-b from-emerald-500 to-emerald-700 rounded-sm shadow-md shadow-emerald-600/30"></span>
            <div>
              <h2 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Trophy className="w-5 h-5 text-emerald-500" />
                <span>الرياضة المحلية والعالمية</span>
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">متابعة نتائج المباريات، أخبار منتخب اليمن، والدوريات العربية والأوروبية</p>
            </div>
          </div>

          <button
            onClick={() => navigateToCategory('رياضة')}
            className={`text-xs font-bold px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-emerald-500/50'
                : 'bg-white border-slate-200 text-slate-700 hover:text-emerald-600 hover:border-emerald-300 shadow-sm'
            }`}
          >
            <span>جميع الأخبار الرياضية</span>
            <ChevronLeft className="w-4 h-4 text-emerald-500" />
          </button>
        </div>

        {/* Match Ticker Bar Accent */}
        <div className={`p-4 rounded-2xl border mb-6 flex flex-wrap items-center justify-between gap-3 text-xs font-bold ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-200' : 'bg-emerald-50 border-emerald-200 text-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-0.5 rounded-full font-black">نتيجة حية</span>
            <span>المنتخب اليمني (2) - (1) منتخب فيتنام</span>
          </div>
          <span className="text-emerald-500 font-black">تأهل إلى نهائيات كأس آسيا 2027 🏆</span>
        </div>

        {/* 3 Sports Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displaySports.slice(0, 3).map((art) => (
            <div
              key={art.id}
              onClick={() => navigateToArticle(art.id)}
              className={`border rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-300 ${
                isDarkMode
                  ? 'bg-[#0e1726] border-slate-800/90 shadow-xl hover:border-emerald-500/50 hover:shadow-2xl'
                  : 'bg-white border-slate-200 shadow-md hover:shadow-xl hover:border-emerald-300'
              }`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-3 right-3 bg-emerald-600 text-white font-extrabold text-[10px] px-3 py-1 rounded-full shadow-md">
                  {art.category || 'رياضة'}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold mb-2">
                    <span className="flex items-center gap-1 text-emerald-500"><Clock className="w-3 h-3" /> {art.timeAgo}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {art.viewsCount.toLocaleString('ar-YE')}</span>
                  </div>

                  <h3 className={`font-black text-base leading-snug line-clamp-2 transition-colors ${
                    isDarkMode ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-600'
                  }`}>
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>

                <div className={`pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-600'
                }`}>
                  <span>قسم الرياضة</span>
                  <span className="text-emerald-500 font-extrabold flex items-center gap-1">
                    <span>التفاصيل</span>
                    <ArrowLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
