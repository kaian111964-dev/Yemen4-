import React from 'react';
import { useApp } from '../context/AppContext';
import { Eye, Clock, ChevronLeft } from 'lucide-react';
import { sortArticles } from '../lib/utils';

export const LatestNewsGrid: React.FC = () => {
  const { cmsData, navigateToArticle, navigateToCategory, isDarkMode } = useApp();

  const settings = cmsData.siteSettings || {
    latestSectionTitle: 'آخر الأخبار والتغطيات',
    borderRadius: 'rounded-2xl',
    showLatestGrid: true
  };

  if (settings.showLatestGrid === false) {
    return null;
  }

  // Sort articles based on newsSortBy setting
  const sortedArticles = sortArticles(cmsData.articles, settings.newsSortBy);

  // Filter articles flagged for latest news or recent articles
  const filteredLatest = sortedArticles.filter(a => a.isLatest !== false);
  const latestArticles = filteredLatest.length > 0 ? filteredLatest.slice(0, 8) : sortedArticles.slice(0, 8);

  const radiusClass = settings.borderRadius || 'rounded-2xl';
  const pyClass = settings.sectionSpacing || 'py-6';
  const titleSizeClass = settings.sectionTitleSize || 'text-xl';
  const shadowClass = settings.cardShadow || 'shadow-xl';
  const headerColor = settings.sectionHeaderColor || '#ef4444';

  return (
    <section className={`${pyClass} px-4 max-w-7xl mx-auto`}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <h2 className={`${titleSizeClass} font-black flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          <span className="w-2.5 h-6 rounded-sm shrink-0" style={{ backgroundColor: headerColor }}></span>
          <span>{settings.latestSectionTitle || 'آخر الأخبار والتغطيات'}</span>
        </h2>
        <button
          onClick={() => navigateToCategory('الأخبار')}
          className={`text-xs font-bold flex items-center gap-1 transition-colors ${
            isDarkMode ? 'text-slate-400 hover:text-red-400' : 'text-slate-600 hover:text-red-600'
          }`}
        >
          <span>عرض المزيد</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {latestArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => navigateToArticle(art.id)}
            className={`border ${radiusClass} ${shadowClass} overflow-hidden transition-all duration-300 flex flex-col cursor-pointer group ${
              isDarkMode
                ? 'bg-[#0e1726] border-slate-800/90 hover:border-slate-700 hover:shadow-2xl'
                : 'bg-white border-slate-200 hover:shadow-xl hover:border-red-300'
            }`}
          >
            {/* Image Thumbnail & Category Badge */}
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img
                src={art.imageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className={`absolute bottom-2.5 right-2.5 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-md shadow-md ${art.categoryColor || 'bg-red-600'}`}>
                {art.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <h3 className={`font-bold text-sm leading-snug mb-3 transition-colors line-clamp-2 ${
                isDarkMode ? 'text-slate-100 group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
              }`}>
                {art.title}
              </h3>

              {/* Footer Meta */}
              <div className={`flex items-center justify-between text-[11px] pt-2 border-t ${
                isDarkMode ? 'text-slate-400 border-slate-800/80' : 'text-slate-500 border-slate-200'
              }`}>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-500" />
                  <span>{art.timeAgo}</span>
                </div>
                <div className={`flex items-center gap-1 font-semibold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <Eye className="w-3 h-3 text-slate-500" />
                  <span>{art.viewsCount.toLocaleString('ar-YE')}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
