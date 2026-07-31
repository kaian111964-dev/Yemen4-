import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Eye, Clock, Sparkles, Calendar as CalendarIcon, Filter, X } from 'lucide-react';
import { ArchiveCalendar } from './ArchiveCalendar';
import { Article } from '../types';

export const CategoryViewPage: React.FC = () => {
  const { cmsData, selectedCategory, setSelectedCategory, navigateToArticle, setCurrentView, isDarkMode } = useApp();

  const [showCalendar, setShowCalendar] = useState(true);
  const [dateFilteredArticles, setDateFilteredArticles] = useState<Article[] | null>(null);
  const [activeDateLabel, setActiveDateLabel] = useState<string | null>(null);

  const categories = ['الكل', 'محلي', 'دولي', 'تقارير', 'كتابات', 'رياضة', 'سياسة', 'اقتصاد', 'تكنولوجيا', 'المحافظات'];

  // Base Category Filter
  const baseArticles = selectedCategory && selectedCategory !== 'الكل'
    ? cmsData.articles.filter(a => a.category.includes(selectedCategory) || selectedCategory.includes(a.category))
    : cmsData.articles;

  // Final Articles list considering Date Filter
  const displayedArticles = dateFilteredArticles !== null ? dateFilteredArticles : baseArticles;

  const handleDateFilterChange = (filtered: Article[], label: string | null) => {
    if (label === null) {
      setDateFilteredArticles(null);
      setActiveDateLabel(null);
    } else {
      // Intersect with current selected category if applicable
      const categoryIntersect = selectedCategory && selectedCategory !== 'الكل'
        ? filtered.filter(a => a.category.includes(selectedCategory) || selectedCategory.includes(a.category))
        : filtered;

      setDateFilteredArticles(categoryIntersect);
      setActiveDateLabel(label);
    }
  };

  return (
    <div className={`min-h-screen py-6 px-4 animate-fadeIn transition-colors ${
      isDarkMode ? 'bg-[#070b14] text-slate-100' : 'bg-[#f4f6f9] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Navigation */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setCurrentView('home')}
            className={`self-start flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all border ${
              isDarkMode ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800' : 'text-slate-800 hover:text-red-600 bg-white border-slate-200 shadow-sm'
            }`}
          >
            <ArrowRight className="w-4 h-4 text-red-500" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 border shadow-md ${
                showCalendar
                  ? 'bg-red-600 text-white border-red-500 shadow-red-600/20'
                  : isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    : 'bg-white border-slate-300 text-slate-800 hover:text-red-600'
              }`}
            >
              <CalendarIcon className="w-4 h-4 text-amber-300" />
              <span>{showCalendar ? 'إخفاء تقويم الأرشيف' : 'عرض التقويم التفاعلي'}</span>
            </button>

            <h1 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              <Sparkles className="w-5 h-5 text-red-500" />
              <span>أرشيف الأخبار: {selectedCategory || 'جميع الأقسام'}</span>
            </h1>
          </div>
        </div>

        {/* Categories Bar */}
        <div className={`flex items-center gap-2 overflow-x-auto pb-2 border-b ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
          {categories.map((cat) => {
            const isActive = (selectedCategory === cat) || (!selectedCategory && cat === 'الكل');
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat === 'الكل' ? null : cat);
                  // Reset custom date filter on category switch
                  setDateFilteredArticles(null);
                  setActiveDateLabel(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : isDarkMode 
                      ? 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Interactive Calendar Section */}
        {showCalendar && (
          <div className="animate-fadeIn">
            <ArchiveCalendar
              articles={cmsData.articles}
              isDarkMode={isDarkMode}
              onSelectDateFilter={handleDateFilterChange}
            />
          </div>
        )}

        {/* Active Filter Indicator Bar */}
        {activeDateLabel && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 animate-fadeIn ${
            isDarkMode ? 'bg-red-950/30 border-red-800/50 text-red-200' : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-xs font-black">
                أرشيف الأخبار المصفاة بتاريخ: <span className="underline decoration-red-500 font-extrabold">{activeDateLabel}</span> ({displayedArticles.length} خبر)
              </span>
            </div>

            <button
              onClick={() => {
                setDateFilteredArticles(null);
                setActiveDateLabel(null);
              }}
              className="text-xs font-extrabold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl transition-all flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>إلغاء تصفية التاريخ</span>
            </button>
          </div>
        )}

        {/* Articles Grid */}
        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => navigateToArticle(art.id)}
                className={`border rounded-2xl overflow-hidden shadow-xl transition-all cursor-pointer group flex flex-col justify-between ${
                  isDarkMode ? 'bg-[#0e1726] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-red-300 shadow-md'
                }`}
              >
                <div>
                  <div className="aspect-video relative overflow-hidden bg-slate-900">
                    <img src={art.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className={`absolute bottom-2.5 right-2.5 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-md shadow ${art.categoryColor || 'bg-red-600'}`}>
                      {art.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className={`font-bold text-sm transition-colors leading-snug ${
                      isDarkMode ? 'text-slate-100 group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
                    }`}>
                      {art.title}
                    </h3>
                    <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{art.excerpt}</p>
                  </div>
                </div>

                <div className={`p-4 pt-0 border-t mt-2 flex items-center justify-between text-[11px] ${
                  isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-red-500" /> {art.publishDate || art.timeAgo}</span>
                  <span className="flex items-center gap-1 font-bold"><Eye className="w-3 h-3" /> {art.viewsCount.toLocaleString('ar-YE')}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`p-12 text-center rounded-3xl border ${isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
            <CalendarIcon className="w-12 h-12 text-red-500 mx-auto mb-3 opacity-60" />
            <h3 className="font-extrabold text-base text-slate-200">لا توجد أخبار منشورة في هذا التاريخ المحدد</h3>
            <p className="text-xs text-slate-400 mt-1">جرب اختيار يوم آخر من التقويم التفاعلي أو تصفح الأرشيف العام.</p>
            <button
              onClick={() => {
                setDateFilteredArticles(null);
                setActiveDateLabel(null);
              }}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-black text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              عرض جميع أخبار الأرشيف
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
