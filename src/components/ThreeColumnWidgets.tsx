import React from 'react';
import { useApp } from '../context/AppContext';
import { Eye, CloudSun, DollarSign, TrendingUp, TrendingDown, ChevronLeft } from 'lucide-react';

export const ThreeColumnWidgets: React.FC = () => {
  const { cmsData, navigateToArticle, setCurrentView, isDarkMode } = useApp();

  const mostReadArticles = [
    { id: 'art-1', title: 'الحكومة اليمنية تعلن استهداف سفينتين نقطيتين سعوديتين', views: 125430 },
    { id: 'art-2', title: 'اجتماع رئاسي موسع لمناقشة الأوضاع الراهنة', views: 98720 },
    { id: 'art-3', title: 'ارتفاع أسعار النفط عالمياً تجاوز 90 دولاراً للبرميل', views: 75310 },
    { id: 'art-4', title: 'منتخب اليمن يتأهل لنهائيات كأس آسيا 2027', views: 64210 },
    { id: 'art-6', title: 'مشاريع تنموية جديدة في عدة محافظات', views: 53640 }
  ];

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Column 1: Most Read (الأكثر قراءة) */}
        <div className={`border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-colors ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-extrabold text-base flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span className="w-2.5 h-5 bg-red-600 rounded-sm"></span>
                <span>الأكثر قراءة</span>
              </h3>
            </div>

            <div className="space-y-3.5">
              {mostReadArticles.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => navigateToArticle(item.id)}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors group ${
                    isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="w-6 h-6 rounded-full bg-red-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
                      isDarkMode ? 'text-slate-200 group-hover:text-red-400' : 'text-slate-800 group-hover:text-red-600'
                    }`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
                      <Eye className="w-3 h-3 text-red-500" />
                      <span>{item.views.toLocaleString('ar-YE')} مشاهدة</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: Weather Sana'a (الطقس - صنعاء) */}
        <div className={`border rounded-2xl p-5 shadow-xl flex flex-col justify-between relative overflow-hidden transition-colors ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-extrabold text-base flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span className="w-2.5 h-5 bg-amber-500 rounded-sm"></span>
                <span>الطقس - {cmsData.weather.city}</span>
              </h3>
            </div>

            {/* Main Temp Display */}
            <div className={`flex items-center justify-between my-2 p-3 rounded-2xl border ${
              isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <div>
                <div className="text-4xl font-black text-amber-500 tracking-tight">
                  {cmsData.weather.temp}°
                </div>
                <div className={`text-xs font-bold mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  {cmsData.weather.condition}
                </div>
              </div>
              <CloudSun className="w-14 h-14 text-amber-500 drop-shadow-[0_0_12px_rgba(251,191,36,0.3)]" />
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs my-3">
              <div className={`p-2 rounded-xl border text-center ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span className="text-[10px] text-slate-400 block">اتجاه الرياح</span>
                <span className="font-bold">{cmsData.weather.direction}</span>
              </div>
              <div className={`p-2 rounded-xl border text-center ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span className="text-[10px] text-slate-400 block">سرعة الرياح</span>
                <span className="font-bold">{cmsData.weather.windSpeed}</span>
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className={`grid grid-cols-5 gap-1.5 text-center mt-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              {cmsData.weather.forecast.map((f, i) => (
                <div key={i} className={`p-1.5 rounded-lg border ${
                  isDarkMode ? 'bg-slate-900/70 border-slate-800/80' : 'bg-slate-100 border-slate-200'
                }`}>
                  <span className="text-[10px] text-slate-400 block font-semibold">{f.day}</span>
                  <span className="text-xs font-black text-amber-500 block my-0.5">{f.tempHigh}°</span>
                  <span className="text-[9px] text-slate-400 block">{f.tempLow}°</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: Currency Rates (أسعار العملات) */}
        <div className={`border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-colors ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-extrabold text-base flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span className="w-2.5 h-5 bg-emerald-500 rounded-sm"></span>
                <span>أسعار العملات - اليمن</span>
              </h3>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-right">
                <thead>
                  <tr className={`border-b text-[11px] ${isDarkMode ? 'text-slate-400 border-slate-800' : 'text-slate-500 border-slate-200'}`}>
                    <th className="pb-2 font-bold">العملة</th>
                    <th className="pb-2 font-bold text-center">شراء</th>
                    <th className="pb-2 font-bold text-left">بيع / التغير</th>
                  </tr>
                </thead>
                <tbody className={`divide-y font-medium ${isDarkMode ? 'divide-slate-800/60' : 'divide-slate-200/80'}`}>
                  {cmsData.currencies.map((c) => (
                    <tr key={c.code} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-100'}`}>
                      <td className={`py-2.5 font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        <span>{c.flag}</span>
                        <span>{c.currency}</span>
                      </td>
                      <td className="py-2.5 text-center font-black text-amber-500">
                        {c.buyRate}
                      </td>
                      <td className="py-2.5 text-left font-bold">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] ${
                          c.change >= 0 
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-300 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800/80' 
                            : 'bg-red-100 text-red-700 border border-red-300 dark:bg-red-950 dark:text-red-400 dark:border-red-800/80'
                        }`}>
                          {c.change >= 0 ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                          <span>{Math.abs(c.change)}%</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('category')}
            className={`w-full mt-4 py-2 text-center text-xs font-bold border-t pt-3 flex items-center justify-center gap-1 transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-slate-200 border-slate-800' : 'text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
          >
            <span>عرض المزيد</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
