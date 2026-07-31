import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ScheduleItem } from '../types';
import { Radio, Calendar, Clock, Bell, BellRing, Play, Tv, ChevronLeft, Filter, Search, User, Info, CheckCircle2, Sparkles } from 'lucide-react';

export const InteractiveScheduleSection: React.FC = () => {
  const { cmsData, setCurrentView, triggerToast, isDarkMode } = useApp();
  const [selectedDay, setSelectedDay] = useState<string>('اليوم');
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [selectedItemDetail, setSelectedItemDetail] = useState<ScheduleItem | null>(null);

  const days = ['اليوم', 'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
  const categories = ['الكل', 'إخباري', 'حواري / سياسي', 'اقتصادي', 'منوعات', 'صباحي / منوعات', 'رياضة'];

  const scheduleList = cmsData.schedule || [];

  // Filter schedule by day, category, search
  const filteredSchedule = scheduleList.filter(item => {
    const matchesDay = selectedDay === 'اليوم' || item.day === selectedDay || item.day === 'اليوم';
    const matchesCategory = selectedCategory === 'الكل' || item.category.includes(selectedCategory);
    const matchesSearch = searchQuery === '' || 
      item.title.includes(searchQuery) || 
      item.host.includes(searchQuery) ||
      item.description.includes(searchQuery);

    return matchesDay && matchesCategory && matchesSearch;
  });

  const liveNowItem = scheduleList.find(item => item.isLiveNow) || scheduleList[0];

  const handleToggleReminder = (itemId: string, title: string, time: string) => {
    const updated = !reminders[itemId];
    setReminders(prev => ({ ...prev, [itemId]: updated }));
    if (updated) {
      triggerToast('تم ضبط التنبيه', `سنقوم بتذكيرك فور بدء عرض برنامج "${title}" الساعة ${time}.`, 'live');
    } else {
      triggerToast('تم إلغاء التنبيه', `تم إزالة التذكير لبرنامج "${title}".`, 'system');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
        isDarkMode 
          ? 'bg-gradient-to-r from-[#0e1726] via-[#111f38] to-[#0a101d] border-slate-800' 
          : 'bg-gradient-to-r from-red-50 via-white to-slate-50 border-slate-200'
      }`}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-500 text-xs font-black">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>دليل البث التفاعلي - يمن 4 HD</span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-black leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              جدول مواعيد البرامج اليومية والمباشرة
            </h2>
            <p className={`text-xs sm:text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              تابع البث المباشر فوراً أو تصفح المواعيد القادمة واضبط التنبيهات الذكية حتى لا تفوتك برامجك الإخبارية والحوارية المفضلة.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentView('live')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <Tv className="w-4 h-4 animate-bounce" />
              <span>البث المباشر الآن</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured ON AIR NOW Card (مباشر الآن) */}
      {liveNowItem && (
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-red-950/90 via-slate-900 to-[#0e1726] border-2 border-red-600 shadow-2xl text-white overflow-hidden">
          {/* Animated Glow Backdrop */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-red-600 animate-pulse"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Right Info: Live Badge, Show Title, Host */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-red-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-lg shadow-red-600/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white"></span>
                  <span>على الهواء مباشرة (ON AIR)</span>
                </span>
                <span className="bg-slate-800/90 text-slate-300 border border-slate-700 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-red-400" />
                  <span>{liveNowItem.startTime} - {liveNowItem.endTime}</span>
                </span>
                <span className="bg-red-950/80 text-red-300 border border-red-800/60 font-extrabold text-xs px-3 py-1 rounded-full">
                  {liveNowItem.category}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug">
                  {liveNowItem.title}
                </h3>
                {liveNowItem.episodeTitle && (
                  <p className="text-sm font-bold text-red-400 mt-1 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>عنوان الحلقة: {liveNowItem.episodeTitle}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 p-3 rounded-2xl max-w-md">
                <img
                  src={liveNowItem.hostImage}
                  alt={liveNowItem.host}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500 shrink-0"
                />
                <div>
                  <div className="text-xs text-slate-400 font-semibold">تقديم الإعلامي /</div>
                  <div className="text-sm font-black text-slate-100">{liveNowItem.host}</div>
                  {liveNowItem.guestName && (
                    <div className="text-[11px] text-amber-400 font-bold mt-0.5">ضيف الحلقة: {liveNowItem.guestName}</div>
                  )}
                </div>
              </div>

              {/* Progress bar of current show */}
              <div className="space-y-1.5 max-w-xl">
                <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
                  <span>مستوى تقدم البث: {liveNowItem.progressPercentage || 68}%</span>
                  <span className="text-red-400 font-mono">متبقي حوالي 25 دقيقة</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-red-500 rounded-full transition-all duration-500"
                    style={{ width: `${liveNowItem.progressPercentage || 68}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Left Action: Quick Watch Button */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 shrink-0 w-full lg:w-auto">
              <button
                onClick={() => setCurrentView('live')}
                className="w-full sm:w-auto lg:w-48 py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-red-600/50 transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>شاهد البث الآن</span>
              </button>

              <button
                onClick={() => setSelectedItemDetail(liveNowItem)}
                className="w-full sm:w-auto lg:w-48 py-3 px-6 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Info className="w-4 h-4 text-red-400" />
                <span>تفاصيل البرنامج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Controls & Filters */}
      <div className={`p-5 rounded-2xl border space-y-4 shadow-xl transition-colors ${
        isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Day Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 ml-2 shrink-0 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-red-500" /> اليوم:
            </span>
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  selectedDay === day
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : isDarkMode 
                      ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700' 
                      : 'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="ابحث عن برنامج أو إعلامي..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-xs rounded-xl pl-3 pr-9 py-2.5 border focus:outline-none focus:border-red-500 transition-colors ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          </div>
        </div>

        {/* Categories Bar */}
        <div className={`pt-3 border-t flex items-center gap-2 overflow-x-auto ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <span className="text-[11px] font-bold text-slate-400 ml-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-red-500" /> التصنيف:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-red-400 border border-red-500/50'
                  : isDarkMode 
                    ? 'text-slate-400 hover:text-slate-200' 
                    : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Items Timeline List */}
      <div className="space-y-4">
        {filteredSchedule.length === 0 ? (
          <div className={`p-12 text-center rounded-2xl border ${isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
            <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-50" />
            <p className="font-bold text-sm">لا توجد برامج مطابقة للبحث أو التصنيف المحدد.</p>
          </div>
        ) : (
          filteredSchedule.map((item) => {
            const hasReminder = !!reminders[item.id];

            return (
              <div
                key={item.id}
                className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 group shadow-lg ${
                  item.isLiveNow
                    ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-[#0e1726] border-red-500 shadow-red-950/50'
                    : isDarkMode 
                      ? 'bg-[#0e1726] border-slate-800 hover:border-slate-700' 
                      : 'bg-white border-slate-200 hover:border-red-300 shadow-md'
                }`}
              >
                {/* Time Indicator & Live Badge */}
                <div className="flex items-center gap-4 shrink-0 min-w-[150px]">
                  <div className={`p-3 rounded-2xl border text-center font-mono ${
                    item.isLiveNow 
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30' 
                      : isDarkMode 
                        ? 'bg-slate-900 text-slate-200 border-slate-800' 
                        : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    <div className="text-xs font-black">{item.startTime}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">حتى {item.endTime}</div>
                  </div>

                  {item.isLiveNow ? (
                    <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 animate-pulse shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span>مباشر الآن</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400">
                      {item.category}
                    </span>
                  )}
                </div>

                {/* Show Details */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-3">
                    <h4 className={`font-extrabold text-base transition-colors ${
                      item.isLiveNow
                        ? 'text-red-400'
                        : isDarkMode ? 'text-slate-100 group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
                    }`}>
                      {item.title}
                    </h4>
                  </div>

                  <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <User className="w-3.5 h-3.5 text-red-500" />
                      <span>تقديم: {item.host}</span>
                    </span>
                    {item.guestName && (
                      <span className="text-amber-500 font-semibold">
                        • الضيف: {item.guestName}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 md:border-r border-slate-800/80 pt-3 md:pt-0 md:pr-4">
                  {item.isLiveNow ? (
                    <button
                      onClick={() => setCurrentView('live')}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all hover:scale-105"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>مشاهدة</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleReminder(item.id, item.title, item.startTime)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border transition-all ${
                        hasReminder
                          ? 'bg-amber-600/20 text-amber-500 border-amber-500/50'
                          : isDarkMode 
                            ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/50' 
                            : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-500'
                      }`}
                      title={hasReminder ? "إلغاء التذكير" : "ضبط تذكير"}
                    >
                      {hasReminder ? <BellRing className="w-4 h-4 text-amber-500" /> : <Bell className="w-4 h-4 text-slate-400" />}
                      <span>{hasReminder ? 'تم التذكير' : 'تذكير'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedItemDetail(item)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
                    }`}
                    title="تفاصيل إضافية"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Program Detail Modal */}
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className={`max-w-lg w-full border rounded-3xl p-6 shadow-2xl space-y-5 relative ${
            isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setSelectedItemDetail(null)}
              className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <span className="p-3 rounded-2xl bg-red-600/10 text-red-500 border border-red-500/30">
                <Tv className="w-6 h-6" />
              </span>
              <div>
                <span className="text-xs font-bold text-red-500">{selectedItemDetail.category}</span>
                <h3 className="text-xl font-black">{selectedItemDetail.title}</h3>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <img
                src={selectedItemDetail.hostImage}
                alt={selectedItemDetail.host}
                className="w-14 h-14 rounded-full object-cover border-2 border-red-500"
              />
              <div>
                <div className="text-xs text-slate-400 font-semibold">مقدم البرنامج /</div>
                <div className="font-extrabold text-sm">{selectedItemDetail.host}</div>
                <div className="text-xs text-red-400 font-bold mt-1">
                  الموعد: {selectedItemDetail.startTime} - {selectedItemDetail.endTime} ({selectedItemDetail.day})
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400">وصف البرنامج والموضوع:</h4>
              <p className="text-xs leading-relaxed text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                {selectedItemDetail.description}
              </p>
            </div>

            {selectedItemDetail.episodeTitle && (
              <div className="text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-900/50 p-3 rounded-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>عنون الحلقة الخاصة: {selectedItemDetail.episodeTitle}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  handleToggleReminder(selectedItemDetail.id, selectedItemDetail.title, selectedItemDetail.startTime);
                  setSelectedItemDetail(null);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{reminders[selectedItemDetail.id] ? 'تم التذكير' : 'تذكيري بالبرنامج'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedItemDetail(null);
                  setCurrentView('live');
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>انتقل للبث المباشر</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
