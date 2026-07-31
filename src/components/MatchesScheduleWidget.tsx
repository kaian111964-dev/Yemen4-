import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MatchItem } from '../types';
import { Trophy, Tv, Calendar, Clock, MapPin, Bell, Radio, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Flame, Vote } from 'lucide-react';

export const MatchesScheduleWidget: React.FC = () => {
  const { cmsData, isDarkMode, triggerToast } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('الكل');
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [userVotes, setUserVotes] = useState<Record<string, 'home' | 'away' | 'draw'>>({});

  const matches = cmsData.matches || [];

  // Filter logic
  const filteredMatches = matches.filter(m => {
    if (selectedFilter === 'الكل') return true;
    if (selectedFilter === 'live') return m.status === 'live';
    if (selectedFilter === 'upcoming') return m.status === 'upcoming';
    if (selectedFilter === 'finished') return m.status === 'finished';
    return m.tournament.includes(selectedFilter) || selectedFilter.includes(m.tournament);
  });

  const liveMatchesCount = matches.filter(m => m.status === 'live').length;

  const toggleReminder = (matchId: string, matchName: string) => {
    const isSet = reminders[matchId];
    setReminders(prev => ({ ...prev, [matchId]: !isSet }));
    triggerToast(
      !isSet ? 'تم تفعيل التنبيه 🔔' : 'تم إلغاء التنبيه',
      !isSet ? `سنقوم بتذكيرك فور انطلاق مباراة (${matchName}).` : `تم إزالة التذكير لمباراة (${matchName}).`,
      'system'
    );
  };

  const handleVote = (matchId: string, choice: 'home' | 'away' | 'draw') => {
    setUserVotes(prev => ({ ...prev, [matchId]: choice }));
    triggerToast('شكراً لمشاركتك ⚽', 'تم تسجيل توقعك لنتيجة المباراة بنجاح!', 'system');
  };

  const settings = cmsData.siteSettings || {};
  if (settings.showMatchesBar === false) {
    return null;
  }

  const radiusClass = settings.borderRadius || 'rounded-2xl';
  const pyClass = settings.sectionSpacing || 'py-6';

  return (
    <div className="w-full my-8">
      {/* Container Box */}
      <div className={`p-5 sm:p-7 rounded-3xl border shadow-2xl relative overflow-hidden transition-all ${
        isDarkMode
          ? 'bg-[#0b1320] border-emerald-500/30 text-white'
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border-slate-800 shadow-slate-950/40'
      }`}>
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header Title Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Trophy className="w-5 h-5 text-slate-950 font-extrabold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">جدول مباريات اليوم والبطولات</h2>
                {liveMatchesCount > 0 && (
                  <span className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full animate-pulse shadow-md shadow-red-600/40">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    <span>{liveMatchesCount} مباراة حية</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">تغطية مباشرة لنتائج المنتخب الوطني، الدوري اليمني، والدوريات العالمية</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>ناقل حصري: <strong className="text-emerald-400">قناة يمن 4 HD</strong></span>
            </span>
          </div>
        </div>

        {/* Filter Scrollable Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar relative z-10">
          {[
            { id: 'الكل', label: 'جميع المباريات' },
            { id: 'live', label: 'جارية الآن 🔴' },
            { id: 'upcoming', label: 'المباريات القادمة' },
            { id: 'finished', label: 'المباريات المنتهية' },
            { id: 'الدوري اليمني', label: 'الدوري اليمني الممتاز 🇾🇪' },
            { id: 'كأس آسيا', label: 'تصفيات كأس آسيا 🏆' },
            { id: 'دوري أبطال أوروبا', label: 'دوري أبطال أوروبا ⭐' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 border ${
                selectedFilter === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20 scale-105'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Matches Grid */}
        {filteredMatches.length === 0 ? (
          <div className="py-12 text-center text-slate-400 bg-slate-900/50 rounded-2xl border border-slate-800">
            <Trophy className="w-10 h-10 mx-auto text-slate-600 mb-2 animate-bounce" />
            <p className="text-sm font-bold">لا توجد مباريات مطابقة للفلتر المختار حالياً.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
            {filteredMatches.map((match) => (
              <div
                key={match.id}
                className={`p-4 rounded-2xl border transition-all relative flex flex-col justify-between group ${
                  match.status === 'live'
                    ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-[#121c2d] border-red-500/60 shadow-xl shadow-red-950/20'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                {/* Tournament Header & Status */}
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-3 border-b border-slate-800/80 pb-2">
                  <span className="text-emerald-400 truncate max-w-[170px] flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{match.tournament}</span>
                  </span>

                  {match.status === 'live' && (
                    <span className="flex items-center gap-1.5 text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/30 animate-pulse font-black">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      <span>شوط 2 ({match.minute || '68\''})</span>
                    </span>
                  )}

                  {match.status === 'upcoming' && (
                    <span className="text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      لم تبدأ بعد
                    </span>
                  )}

                  {match.status === 'finished' && (
                    <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                      انتهت FT
                    </span>
                  )}
                </div>

                {/* Match Teams & Score Center */}
                <div className="flex items-center justify-between py-2 px-1">
                  {/* Home Team */}
                  <div className="flex-1 text-center flex flex-col items-center space-y-1.5">
                    <div className="w-12 h-12 rounded-full p-1 bg-slate-800 border border-slate-700 shadow-md overflow-hidden group-hover:scale-110 transition-transform">
                      <img src={match.homeLogo} alt={match.homeTeam} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <span className="text-xs font-extrabold text-white line-clamp-1">{match.homeTeam}</span>
                  </div>

                  {/* Score / Time Badge */}
                  <div className="px-3 text-center flex flex-col items-center justify-center">
                    {match.status === 'upcoming' ? (
                      <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl shadow">
                        <span className="text-sm font-black text-amber-400 block">{match.time}</span>
                        <span className="text-[10px] text-slate-400 block font-semibold">{match.date}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-800 shadow-inner">
                        <span className={`text-xl font-black ${match.homeScore! > match.awayScore! ? 'text-emerald-400' : 'text-white'}`}>
                          {match.homeScore}
                        </span>
                        <span className="text-xs text-slate-500 font-bold">:</span>
                        <span className={`text-xl font-black ${match.awayScore! > match.homeScore! ? 'text-emerald-400' : 'text-white'}`}>
                          {match.awayScore}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 text-center flex flex-col items-center space-y-1.5">
                    <div className="w-12 h-12 rounded-full p-1 bg-slate-800 border border-slate-700 shadow-md overflow-hidden group-hover:scale-110 transition-transform">
                      <img src={match.awayLogo} alt={match.awayTeam} className="w-full h-full object-cover rounded-full" />
                    </div>
                    <span className="text-xs font-extrabold text-white line-clamp-1">{match.awayTeam}</span>
                  </div>
                </div>

                {/* Info Bar & Stadium */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[190px]">
                    <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                    <span className="truncate">{match.stadium || 'استاد المريسي'}</span>
                  </div>

                  {match.channel && (
                    <span className="text-emerald-400 font-extrabold flex items-center gap-1 shrink-0">
                      <Tv className="w-3 h-3" />
                      <span>{match.channel}</span>
                    </span>
                  )}
                </div>

                {/* Interactive Action Bar (Vote / Reminder) */}
                <div className="mt-3 pt-2 flex items-center justify-between gap-2 text-[11px] font-bold">
                  {match.status === 'upcoming' ? (
                    <button
                      onClick={() => toggleReminder(match.id, `${match.homeTeam} ضد ${match.awayTeam}`)}
                      className={`w-full py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all border ${
                        reminders[match.id]
                          ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
                      }`}
                    >
                      <Bell className={`w-3.5 h-3.5 ${reminders[match.id] ? 'fill-emerald-400 text-emerald-400' : ''}`} />
                      <span>{reminders[match.id] ? 'تم ضبط التذكير' : 'تذكيري بالمباراة'}</span>
                    </button>
                  ) : match.status === 'live' ? (
                    <div className="w-full flex items-center justify-between bg-red-950/40 border border-red-500/30 px-3 py-1.5 rounded-xl">
                      <span className="text-red-400 font-extrabold flex items-center gap-1">
                        <Radio className="w-3.5 h-3.5 animate-spin" />
                        <span>منقولة حية الآن</span>
                      </span>
                      <button
                        onClick={() => triggerToast('بث مباشر', `جاري توجيهك إلى تغطية مباراة ${match.homeTeam} و ${match.awayTeam}`, 'live')}
                        className="text-xs text-white bg-red-600 hover:bg-red-700 px-2.5 py-0.5 rounded-lg shadow"
                      >
                        شاهد الآن
                      </button>
                    </div>
                  ) : (
                    /* User Prediction for finished or general matches */
                    <div className="w-full flex items-center justify-between gap-1 text-[10px] text-slate-400">
                      <span>توقع الجمهور:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleVote(match.id, 'home')}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            userVotes[match.id] === 'home' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 border-slate-700 hover:text-white'
                          }`}
                        >
                          فوز {match.homeTeam}
                        </button>
                        <button
                          onClick={() => handleVote(match.id, 'draw')}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            userVotes[match.id] === 'draw' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 border-slate-700 hover:text-white'
                          }`}
                        >
                          تعادل
                        </button>
                        <button
                          onClick={() => handleVote(match.id, 'away')}
                          className={`px-2 py-0.5 rounded border transition-colors ${
                            userVotes[match.id] === 'away' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 border-slate-700 hover:text-white'
                          }`}
                        >
                          فوز {match.awayTeam}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
