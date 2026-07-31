import React, { useState, useMemo } from 'react';
import { Article } from '../types';
import { Calendar, ChevronRight, ChevronLeft, Filter, RefreshCw, Sparkles, Check, Search, AlertCircle } from 'lucide-react';

interface ArchiveCalendarProps {
  articles: Article[];
  isDarkMode: boolean;
  onSelectDateFilter: (filteredArticles: Article[], dateLabel: string | null) => void;
}

const ARABIC_MONTHS = [
  { name: 'يناير', value: 1 },
  { name: 'فبراير', value: 2 },
  { name: 'مارس', value: 3 },
  { name: 'أبريل', value: 4 },
  { name: 'مايو', value: 5 },
  { name: 'يونيو', value: 6 },
  { name: 'يوليو', value: 7 },
  { name: 'أغسطس', value: 8 },
  { name: 'سبتمبر', value: 9 },
  { name: 'أكتوبر', value: 10 },
  { name: 'نوفمبر', value: 11 },
  { name: 'ديسمبر', value: 12 },
];

const YEARS = [2026, 2025, 2024, 2023];

export const parseArticleDate = (art: Article): { year: number; month: number; day: number } | null => {
  if (art.isoDate) {
    const parts = art.isoDate.split('-').map(Number);
    if (parts.length === 3) return { year: parts[0], month: parts[1], day: parts[2] };
  }
  
  if (art.publishDate) {
    // e.g., "25 مايو 2025" or "26 يوليو 2026" or "2026/07/26"
    const str = art.publishDate.trim();
    if (str.includes('اليوم')) {
      const today = new Date();
      return { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    }
    
    // Check if format is YYYY-MM-DD or YYYY/MM/DD
    const matchSlash = str.match(/(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})/);
    if (matchSlash) {
      return { year: Number(matchSlash[1]), month: Number(matchSlash[2]), day: Number(matchSlash[3]) };
    }

    // Match Arabic text format e.g. "25 مايو 2025"
    const words = str.split(' ');
    if (words.length >= 3) {
      const dayNum = parseInt(words[0].replace(/[^\d]/g, ''), 10);
      const yearNum = parseInt(words[words.length - 1].replace(/[^\d]/g, ''), 10);
      const monthName = words[1];
      const monthObj = ARABIC_MONTHS.find(m => m.name === monthName);
      if (monthObj && !isNaN(dayNum) && !isNaN(yearNum)) {
        return { year: yearNum, month: monthObj.value, day: dayNum };
      }
    }
  }

  // Default fallback date for articles without explicit date
  return { year: 2026, month: 7, day: 26 };
};

export const ArchiveCalendar: React.FC<ArchiveCalendarProps> = ({
  articles,
  isDarkMode,
  onSelectDateFilter
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(7); // July by default
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [customDatePicker, setCustomDatePicker] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'all' | 'year' | 'month' | 'day'>('all');

  // Compute article counts per day for the selected Year & Month
  const daysWithArticles = useMemo(() => {
    const counts: Record<number, number> = {};
    articles.forEach(art => {
      const parsed = parseArticleDate(art);
      if (parsed) {
        if (parsed.year === selectedYear && parsed.month === selectedMonth) {
          counts[parsed.day] = (counts[parsed.day] || 0) + 1;
        }
      }
    });
    return counts;
  }, [articles, selectedYear, selectedMonth]);

  // Handle Day Selection
  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    setFilterMode('day');
    const filtered = articles.filter(art => {
      const parsed = parseArticleDate(art);
      if (!parsed) return false;
      return parsed.year === selectedYear && parsed.month === selectedMonth && parsed.day === day;
    });

    const monthName = ARABIC_MONTHS.find(m => m.value === selectedMonth)?.name || selectedMonth;
    onSelectDateFilter(filtered, `${day} ${monthName} ${selectedYear}`);
  };

  // Handle Month Selection
  const handleSelectMonth = (mVal: number) => {
    setSelectedMonth(mVal);
    setSelectedDay(null);
    setFilterMode('month');
    const filtered = articles.filter(art => {
      const parsed = parseArticleDate(art);
      if (!parsed) return false;
      return parsed.year === selectedYear && parsed.month === mVal;
    });

    const monthName = ARABIC_MONTHS.find(m => m.value === mVal)?.name || mVal;
    onSelectDateFilter(filtered, `شهر ${monthName} ${selectedYear}`);
  };

  // Handle Year Selection
  const handleSelectYear = (yr: number) => {
    setSelectedYear(yr);
    setSelectedDay(null);
    setFilterMode('year');
    const filtered = articles.filter(art => {
      const parsed = parseArticleDate(art);
      if (!parsed) return false;
      return parsed.year === yr;
    });

    onSelectDateFilter(filtered, `عام ${yr}`);
  };

  // Handle Custom Date Input
  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value; // YYYY-MM-DD
    setCustomDatePicker(val);
    if (!val) {
      handleResetFilter();
      return;
    }
    const parts = val.split('-').map(Number);
    if (parts.length === 3) {
      const [yr, mo, dy] = parts;
      setSelectedYear(yr);
      setSelectedMonth(mo);
      setSelectedDay(dy);
      setFilterMode('day');

      const filtered = articles.filter(art => {
        const parsed = parseArticleDate(art);
        if (!parsed) return false;
        return parsed.year === yr && parsed.month === mo && parsed.day === dy;
      });

      const monthName = ARABIC_MONTHS.find(m => m.value === mo)?.name || mo;
      onSelectDateFilter(filtered, `${dy} ${monthName} ${yr}`);
    }
  };

  // Reset Filters
  const handleResetFilter = () => {
    setSelectedDay(null);
    setCustomDatePicker('');
    setFilterMode('all');
    onSelectDateFilter(articles, null);
  };

  // Total days in current selected month
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDayIndex = new Date(selectedYear, selectedMonth - 1, 1).getDay();

  return (
    <div className={`rounded-3xl p-5 border shadow-2xl transition-all space-y-5 ${
      isDarkMode ? 'bg-[#0e1726]/95 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
    }`}>
      
      {/* Calendar Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 border-slate-700/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span>تقويم الأرشيف الإخباري التفاعلي</span>
              <span className="text-[10px] bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                تفاعلي
              </span>
            </h3>
            <p className="text-xs text-slate-400">استعرض وتصفح جميع أخبار قناة يمن 4 HD باليوم والشهر والسنة</p>
          </div>
        </div>

        {/* Reset Filter Button */}
        <button
          onClick={handleResetFilter}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
            filterMode !== 'all'
              ? 'bg-red-600 text-white border-red-500 shadow-lg'
              : isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${filterMode !== 'all' ? 'animate-spin-once' : ''}`} />
          <span>{filterMode !== 'all' ? 'إعادة ضبط الأرشيف الكامل' : 'جميع التواريخ'}</span>
        </button>
      </div>

      {/* Control Row: Year Selector + Month Selector + Direct Date Input */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        
        {/* Year Select Buttons (4 cols) */}
        <div className="md:col-span-4 flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 shrink-0">السنة:</span>
          {YEARS.map(yr => (
            <button
              key={yr}
              onClick={() => handleSelectYear(yr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 border ${
                selectedYear === yr
                  ? 'bg-red-600 text-white border-red-500 shadow-md'
                  : isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {yr}
            </button>
          ))}
        </div>

        {/* Direct Date Picker Input (4 cols) */}
        <div className="md:col-span-4 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 shrink-0">تاريخ محدد:</span>
          <input
            type="date"
            value={customDatePicker}
            onChange={handleCustomDateChange}
            className={`w-full text-xs font-bold px-3 py-2 rounded-xl border focus:outline-none focus:border-red-500 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          />
        </div>

        {/* Month Selector Dropdown / Scroll (4 cols) */}
        <div className="md:col-span-4 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 shrink-0">الشهر:</span>
          <select
            value={selectedMonth}
            onChange={(e) => handleSelectMonth(Number(e.target.value))}
            className={`w-full text-xs font-extrabold px-3 py-2 rounded-xl border focus:outline-none focus:border-red-500 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            {ARABIC_MONTHS.map(m => (
              <option key={m.value} value={m.value}>
                {m.value}. {m.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Months Pills Grid */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-800/40">
        {ARABIC_MONTHS.map(m => {
          const isSelected = selectedMonth === m.value;
          return (
            <button
              key={m.value}
              onClick={() => handleSelectMonth(m.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-black border-amber-400 shadow'
                  : isDarkMode
                    ? 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
              }`}
            >
              {m.name}
            </button>
          );
        })}
      </div>

      {/* Days Grid Calendar for Selected Month */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              أيام شهر ({ARABIC_MONTHS.find(m => m.value === selectedMonth)?.name} {selectedYear})
            </span>
          </span>
          <span className="text-[11px] text-slate-400">
            انقر على أي يوم لاستعراض الأرشيف الميداني
          </span>
        </div>

        {/* Day Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-16 gap-1.5">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
            const count = daysWithArticles[day] || 0;
            const isSelected = selectedDay === day;

            return (
              <button
                key={day}
                onClick={() => handleSelectDay(day)}
                className={`relative p-2 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-0.5 border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-400 shadow-lg scale-105 ring-2 ring-red-400'
                    : count > 0
                      ? isDarkMode
                        ? 'bg-slate-800 border-red-500/60 text-slate-100 hover:border-red-400'
                        : 'bg-red-50 border-red-300 text-slate-900 hover:bg-red-100'
                      : isDarkMode
                        ? 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                        : 'bg-slate-100/80 border-slate-200 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{day}</span>
                {count > 0 && (
                  <span className={`text-[9px] px-1 rounded font-black ${
                    isSelected ? 'bg-white text-red-600' : 'bg-red-600 text-white'
                  }`}>
                    {count} خبر
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
