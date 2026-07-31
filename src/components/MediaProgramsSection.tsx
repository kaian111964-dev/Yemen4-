import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Camera, Tv, Play, Clock, Eye, ChevronLeft, Calendar } from 'lucide-react';

export const MediaProgramsSection: React.FC = () => {
  const { cmsData, setCurrentView, isDarkMode } = useApp();
  const [selectedVideo, setSelectedVideo] = useState(cmsData.videos[0]);
  const [selectedPhoto, setSelectedPhoto] = useState(cmsData.photos[0]);

  const settings = cmsData.siteSettings || {};
  if (settings.showVideosSection === false) {
    return null;
  }

  const radiusClass = settings.borderRadius || 'rounded-2xl';
  const pyClass = settings.sectionSpacing || 'py-6';
  const titleSizeClass = settings.sectionTitleSize || 'text-base';
  const headerColor = settings.sectionHeaderColor || '#0284c7';

  return (
    <section className={`${pyClass} px-4 max-w-7xl mx-auto space-y-8`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Column 1: Photo Gallery (معرض الصور) - 4 cols */}
        <div className={`lg:col-span-4 border ${radiusClass} p-5 shadow-xl flex flex-col justify-between transition-colors ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-extrabold text-base flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span className="w-2.5 h-5 bg-sky-500 rounded-sm"></span>
                <span>معرض الصور</span>
              </h3>
              <Camera className="w-4 h-4 text-sky-500" />
            </div>

            {/* Main Photo Display */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden mb-3 group border border-slate-800">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <p className="text-xs font-bold text-white line-clamp-2 drop-shadow">
                  {selectedPhoto.caption}
                </p>
              </div>
            </div>

            {/* Thumbnail Grid */}
            <div className="grid grid-cols-4 gap-2">
              {cmsData.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedPhoto.id === photo.id 
                      ? 'border-sky-500 scale-105 shadow-md' 
                      : isDarkMode ? 'border-slate-800 opacity-70 hover:opacity-100' : 'border-slate-300 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <button className={`w-full mt-4 py-2 text-center text-xs font-bold border-t pt-3 flex items-center justify-center gap-1 transition-colors ${
            isDarkMode ? 'text-slate-400 hover:text-slate-200 border-slate-800' : 'text-slate-600 hover:text-slate-900 border-slate-200'
          }`}>
            <span>عرض معرض الصور</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 2: Our Programs (برامجنا) - 4 cols */}
        <div className={`lg:col-span-4 border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-colors ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-extrabold text-base flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span className="w-2.5 h-5 bg-red-600 rounded-sm"></span>
                <span>برامجنا</span>
              </h3>
              <Tv className="w-4 h-4 text-red-500" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {cmsData.programs.map((prog) => (
                <div
                  key={prog.id}
                  onClick={() => setCurrentView('program')}
                  className={`border rounded-xl p-3 cursor-pointer transition-all group flex flex-col items-center text-center ${
                    isDarkMode 
                      ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700' 
                      : 'bg-slate-50 border-slate-200 hover:border-red-300 hover:bg-slate-100'
                  }`}
                >
                  <img
                    src={prog.hostImage}
                    alt={prog.host}
                    className="w-14 h-14 rounded-full object-cover border-2 border-red-600/40 mb-2 group-hover:scale-105 transition-transform"
                  />
                  <h4 className={`font-extrabold text-xs transition-colors ${
                    isDarkMode ? 'text-slate-100 group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
                  }`}>
                    {prog.title}
                  </h4>
                  <span className="text-[10px] text-slate-500 mt-0.5">مع {prog.host}</span>
                  <div className="mt-2 text-[9px] text-red-600 font-bold bg-red-100 border border-red-200 dark:bg-red-950/60 dark:text-red-400 dark:border-red-900/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{prog.airTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('program')}
            className={`w-full mt-4 py-2 text-center text-xs font-bold border-t pt-3 flex items-center justify-center gap-1 transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-slate-200 border-slate-800' : 'text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
          >
            <span>عرض جميع البرامج</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 3: Video Highlights (فيديوهات) - 4 cols */}
        <div className={`lg:col-span-4 border rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-colors ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div>
            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
              <h3 className={`font-extrabold text-base flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                <span className="w-2.5 h-5 bg-red-600 rounded-sm"></span>
                <span>فيديوهات</span>
              </h3>
              <Play className="w-4 h-4 text-red-500 fill-red-500" />
            </div>

            {/* Main Featured Video Player */}
            <div
              onClick={() => setCurrentView('videos')}
              className="relative aspect-video rounded-xl overflow-hidden bg-black group cursor-pointer border border-slate-800 mb-3 shadow-lg"
            >
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-between p-3">
                <span className="self-end bg-black/60 text-white font-mono text-[10px] px-2 py-0.5 rounded backdrop-blur">
                  {selectedVideo.duration}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform shrink-0">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                  <h4 className="font-bold text-xs text-white line-clamp-2">
                    {selectedVideo.title}
                  </h4>
                </div>
              </div>
            </div>

            {/* List of Secondary Videos */}
            <div className="space-y-2">
              {cmsData.videos.slice(1).map((vid) => (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                    selectedVideo.id === vid.id 
                      ? isDarkMode ? 'bg-slate-800/90 border border-red-500/40' : 'bg-red-50 border border-red-300' 
                      : isDarkMode ? 'hover:bg-slate-800/60' : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="relative w-16 h-10 rounded overflow-hidden shrink-0 bg-slate-900">
                    <img src={vid.thumbnail} alt="" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] text-white px-1 rounded font-mono">
                      {vid.duration}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className={`text-[11px] font-bold line-clamp-1 transition-colors ${
                      isDarkMode ? 'text-slate-200 hover:text-red-400' : 'text-slate-800 hover:text-red-600'
                    }`}>
                      {vid.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[9px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5" /> {vid.views}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('videos')}
            className={`w-full mt-4 py-2 text-center text-xs font-bold border-t pt-3 flex items-center justify-center gap-1 transition-colors ${
              isDarkMode ? 'text-slate-400 hover:text-slate-200 border-slate-800' : 'text-slate-600 hover:text-slate-900 border-slate-200'
            }`}
          >
            <span>عرض كل الفيديوهات</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
