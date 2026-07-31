import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Calendar, Play, Tv } from 'lucide-react';
import { InteractiveScheduleSection } from './InteractiveScheduleSection';

export const ProgramsPage: React.FC = () => {
  const { cmsData, setCurrentView, isDarkMode } = useApp();

  return (
    <div className={`min-h-screen py-6 px-4 animate-fadeIn transition-colors ${
      isDarkMode ? 'bg-[#070b14] text-slate-100' : 'bg-[#f4f6f9] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header Navigation */}
        <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all border ${
              isDarkMode ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800' : 'text-slate-800 hover:text-red-600 bg-white border-slate-200 shadow-sm'
            }`}
          >
            <ArrowRight className="w-4 h-4 text-red-500" />
            <span>العودة للرئيسية</span>
          </button>

          <h1 className={`text-xl sm:text-2xl font-black flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            <Tv className="w-6 h-6 text-red-500" />
            <span>دليل البرامج والجدول اليومي - يمن 4 HD</span>
          </h1>
        </div>

        {/* Interactive Schedule Component */}
        <InteractiveScheduleSection />

        {/* All Programs Roster Header */}
        <div className="pt-6">
          <div className={`flex items-center justify-between border-b pb-3 mb-6 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <h2 className={`text-xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              <span className="w-2.5 h-5 bg-red-600 rounded-sm"></span>
              <span>جميع برامج القناة وإعلامييها</span>
            </h2>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cmsData.programs.map((prog) => (
              <div
                key={prog.id}
                className={`border rounded-2xl p-6 shadow-xl flex flex-col items-center text-center justify-between transition-all group ${
                  isDarkMode ? 'bg-[#0e1726] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-red-300 shadow-md'
                }`}
              >
                <div className="flex flex-col items-center">
                  <img
                    src={prog.hostImage}
                    alt={prog.host}
                    className="w-24 h-24 rounded-full object-cover border-4 border-red-600/50 shadow-xl mb-4 group-hover:scale-105 transition-transform"
                  />
                  <span className="bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 font-extrabold text-[10px] px-3 py-1 rounded-full border border-red-200 dark:border-red-900 mb-2">
                    {prog.category}
                  </span>
                  <h3 className={`font-extrabold text-lg transition-colors ${
                    isDarkMode ? 'text-slate-100 group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
                  }`}>
                    {prog.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-bold mb-3">تقديم الإعلامي / {prog.host}</span>
                  <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{prog.description}</p>
                </div>

                <div className={`w-full space-y-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div className={`text-xs font-bold p-2.5 rounded-xl border flex items-center justify-center gap-1.5 ${
                    isDarkMode ? 'text-slate-300 bg-slate-900 border-slate-800' : 'text-slate-800 bg-slate-100 border-slate-200'
                  }`}>
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    <span>{prog.airTime}</span>
                  </div>

                  <button
                    onClick={() => setCurrentView('videos')}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>شاهد مقاطع وحلقات البرنامج</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
