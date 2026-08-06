import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Radio, Server, Users, MessageSquare, Send, Calendar, Heart, Flame, ThumbsUp, Sparkles, ArrowRight, ShieldCheck, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { YEMEN4_LOGO_URL, DEFAULT_LIVE_POSTER_URL } from '../data/initialData';
import Hls from 'hls.js';

export const LiveStreamModalPage: React.FC = () => {
  const { cmsData, setCurrentView, user, setIsLoginModalOpen, isDarkMode } = useApp();
  const [selectedServer, setSelectedServer] = useState<'main' | 'backup' | 'audio'>('main');
  const [selectedQuality, setSelectedQuality] = useState('1080p HD');
  const [viewerCount, setViewerCount] = useState(cmsData.liveViewersCount || 125430);
  const [isPlaying, setIsPlaying] = useState(false);

  // Active stream URL and poster image URL from CMS Data
  const activeStreamUrl = cmsData.liveStreamUrl || '';
  const posterUrl = cmsData.liveStreamPosterUrl ?? cmsData.siteSettings?.liveStreamPosterUrl ?? DEFAULT_LIVE_POSTER_URL;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reactions counters
  const [reactions, setReactions] = useState({
    heart: 12450,
    flame: 8920,
    thumbsUp: 22100,
  });

  // Live Chat messages
  const [chatMessages, setChatMessages] = useState([
    { id: 'm1', user: 'أحمد المفلحي', text: 'السلام عليكم ورحمة الله تغطية ممتازة لقناة يمن 4 HD', time: '14:32' },
    { id: 'm2', user: 'فاطمة صنعاء', text: 'متابعين معكم البث المباشر بدقة ممتازة وبدون تقطيع!', time: '14:33' },
    { id: 'm3', user: 'محمد علي', text: 'تحية لكادر القناة ولجميع المتابعين في الداخل والخارج', time: '14:34' },
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Handle HLS playback via hls.js or native video
  useEffect(() => {
    if (!activeStreamUrl || selectedServer === 'audio') return;

    const lower = activeStreamUrl.toLowerCase();
    const isHls = lower.includes('.m3u8') || lower.includes('3u8m') || lower.includes('.m3u');

    if (isHls && videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(activeStreamUrl);
        hls.attachMedia(videoRef.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(() => {});
        });
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            console.warn('HLS Fatal Error:', data.type);
          }
        });
        return () => {
          hls.destroy();
        };
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        videoRef.current.src = activeStreamUrl;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeStreamUrl, selectedServer]);

  // Fluctuating viewers simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const msg = {
      id: `chat-${Date.now()}`,
      user: user.name,
      text: newChatMessage.trim(),
      time: new Date().toLocaleTimeString('ar-YE', { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, msg]);
    setNewChatMessage('');
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReaction = (key: keyof typeof reactions) => {
    setReactions(prev => ({ ...prev, [key]: prev[key] + 1 }));
  };

  // Helper to detect stream type
  const isHlsStream = activeStreamUrl.toLowerCase().includes('.m3u8') || 
                      activeStreamUrl.toLowerCase().includes('3u8m') || 
                      activeStreamUrl.toLowerCase().includes('.m3u');

  const getEmbedYouTubeUrl = (url: string) => {
    if (!url) return 'https://www.youtube.com/embed/live_stream';
    if (url.includes('embed/')) return url;

    // YouTube live link: /live/
    if (url.includes('/live/')) {
      const parts = url.split('/live/');
      const videoId = parts[1]?.split('?')[0]?.split('&')[0] || '';
      if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1`;
    }

    // YouTube watch link: v=
    if (url.includes('v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0] || '';
      if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1`;
    }

    // Short link: youtu.be/
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      if (videoId) return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&controls=1`;
    }

    // Channel handle: @
    if (url.includes('@')) {
      const channelName = url.split('@')[1]?.split('/')[0] || '';
      if (channelName) return `https://www.youtube.com/embed/live_stream?channel=${channelName}`;
    }

    return url;
  };

  return (
    <div className={`min-h-screen py-6 px-4 animate-fadeIn transition-colors ${
      isDarkMode ? 'bg-[#070b14] text-slate-100' : 'bg-[#f4f6f9] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header Navigation */}
        <div className={`flex flex-wrap items-center justify-between border-b pb-4 gap-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all border ${
              isDarkMode ? 'text-slate-300 hover:text-white bg-slate-900 border-slate-800' : 'text-slate-800 hover:text-red-600 bg-white border-slate-200 shadow-sm'
            }`}
          >
            <ArrowRight className="w-4 h-4 text-red-500" />
            <span>العودة للرئيسية</span>
          </button>

          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-500 animate-pulse" />
            <h1 className={`text-lg sm:text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              البث المباشر - قناة يمن 4 HD
            </h1>
          </div>
        </div>

        {/* Grid: Player (8 cols) + Live Chat (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Player & Controls Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4">

            {/* Video Player Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border-2 border-slate-800 shadow-2xl group">
              {!isPlaying ? (
                /* Poster / Cover Image Overlay before playback */
                <div 
                  onClick={() => setIsPlaying(true)}
                  className="relative w-full h-full bg-slate-950 overflow-hidden cursor-pointer group/poster flex items-center justify-center select-none"
                >
                  {posterUrl ? (
                    <img
                      src={posterUrl}
                      alt="غلاف البث المباشر - قناة يمن 4 HD"
                      className="w-full h-full object-contain bg-slate-950 transition-transform duration-700 group-hover/poster:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 flex flex-col items-center justify-center p-6 text-center">
                      <img src={YEMEN4_LOGO_URL} alt="Yemen 4 HD" className="h-16 sm:h-20 w-auto mb-4 object-contain animate-pulse" />
                      <h3 className="text-lg sm:text-xl font-black text-white">قناة يمن 4 HD - البث المباشر</h3>
                      <p className="text-xs text-slate-400 mt-2">انقر على زِر التشغيل أدناه لبدء المشاهدة</p>
                    </div>
                  )}

                  {/* Dark gradient overlay & Play Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50 flex flex-col items-center justify-center p-4 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlaying(true);
                      }}
                      className="group/btn relative inline-flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border border-red-400/50"
                    >
                      <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white text-red-600 flex items-center justify-center shadow-lg group-hover/btn:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5 text-red-600" />
                      </span>
                      <span>اضغط هنا لتشغيل البث المباشر</span>
                    </button>
                    <p className="text-[10px] sm:text-xs text-slate-200 font-bold mt-3 bg-black/70 px-4 py-1.5 rounded-full border border-slate-700/60 backdrop-blur">
                      🔴 بث حي مباشر عالي الدقة (1080p HD) • تغطية حصرية
                    </p>
                  </div>
                </div>
              ) : selectedServer === 'audio' ? (
                <div className="w-full h-full bg-gradient-to-br from-slate-950 via-red-950/40 to-slate-950 flex flex-col items-center justify-center p-6 text-center select-none">
                  <div className="relative mb-3">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center shadow-2xl animate-pulse">
                      <Radio className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full border border-red-400 shadow">
                      94.5 FM
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-black text-white">راديو يمن 4 - البث الإذاعي المباشر</h3>
                  <p className="text-xs text-slate-300 font-bold mt-1">تغطية صوتية حية لمختلف المحافظات اليمنية • استهلاك خفيف جداً للبيانات</p>

                  {/* Equalizer animation */}
                  <div className="flex items-center gap-1.5 h-6 sm:h-8 my-3">
                    <span className="w-1.5 h-full bg-red-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-3/4 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1/2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span className="w-1.5 h-full bg-red-500 rounded-full animate-bounce [animation-delay:0.1s]"></span>
                    <span className="w-1.5 h-2/3 bg-red-400 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </div>

                  <audio
                    controls
                    autoPlay
                    src={cmsData.radioStreamUrl || cmsData.siteSettings?.radioStreamUrl || 'https://stream.zeno.fm/f3v6288y88ruv'}
                    className="w-full max-w-md accent-red-600 shadow-xl rounded-xl border border-slate-700 bg-slate-900/80"
                  />
                </div>
              ) : isHlsStream ? (
                /* Native / HLS.js Video Element for streams */
                <video
                  ref={videoRef}
                  poster={posterUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                >
                  متصفحك لا يدعم تشغيل هذا البث المباشر.
                </video>
              ) : (
                /* YouTube or Iframe Embed Player */
                <iframe
                  src={getEmbedYouTubeUrl(activeStreamUrl || 'https://www.youtube.com/embed/live_stream')}
                  title="يمن 4 HD البث المباشر"
                  className="w-full h-full object-cover"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}

              {/* Watermark Logo */}
              <img
                src={YEMEN4_LOGO_URL}
                alt="Yemen 4"
                className="absolute top-4 right-4 h-9 sm:h-10 w-auto object-contain bg-black/60 p-1.5 rounded-lg backdrop-blur pointer-events-none z-10"
              />

              {/* Top Live Badge */}
              <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full live-pulse"></span>
                  مباشر الآن
                </span>
                <span className="bg-black/70 backdrop-blur text-slate-200 font-bold text-xs px-3 py-1 rounded-full border border-slate-700/60 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-red-400" />
                  <span>{viewerCount.toLocaleString('ar-YE')} مشاهد</span>
                </span>
                {isPlaying && (
                  <button
                    onClick={() => setIsPlaying(false)}
                    className="bg-black/80 hover:bg-red-950 backdrop-blur text-slate-200 hover:text-white font-bold text-[11px] px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1 transition-all"
                    title="عرض صورة الغلاف مجدداً"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-red-400" />
                    <span className="hidden sm:inline">الغلاف</span>
                  </button>
                )}
              </div>
            </div>

            {/* Server Selector & Controls Bar */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              {/* Servers */}
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-slate-300">السيرفر:</span>
                <button
                  onClick={() => setSelectedServer('main')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedServer === 'main' ? 'bg-red-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  السيرفر الرئيسي HD
                </button>
                <button
                  onClick={() => setSelectedServer('backup')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedServer === 'backup' ? 'bg-red-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  احتياطي SD
                </button>
                <button
                  onClick={() => setSelectedServer('audio')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedServer === 'audio' ? 'bg-red-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  بث صوتي
                </button>
              </div>

              {/* Quality Switcher */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">الجودة:</span>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="bg-slate-900 text-slate-200 text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-red-500"
                >
                  <option value="1080p HD">1080p HD (ممتازة)</option>
                  <option value="720p HD">720p HD (متوسطة)</option>
                  <option value="480p">480p (توفير البيانات)</option>
                  <option value="360p">360p (ضعيفة)</option>
                </select>
              </div>
            </div>

            {/* Reactions Bar */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" /> تفاعل مع البث:
              </span>

              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={() => handleReaction('heart')}
                  className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-800/80 hover:bg-rose-900/80 text-rose-400 px-3 py-1.5 rounded-xl font-bold text-xs transition-transform active:scale-125"
                >
                  <Heart className="w-4 h-4 fill-rose-400" />
                  <span>{reactions.heart.toLocaleString('ar-YE')}</span>
                </button>

                <button
                  onClick={() => handleReaction('flame')}
                  className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-800/80 hover:bg-amber-900/80 text-amber-400 px-3 py-1.5 rounded-xl font-bold text-xs transition-transform active:scale-125"
                >
                  <Flame className="w-4 h-4 fill-amber-400" />
                  <span>{reactions.flame.toLocaleString('ar-YE')}</span>
                </button>

                <button
                  onClick={() => handleReaction('thumbsUp')}
                  className="flex items-center gap-1.5 bg-blue-950/60 border border-blue-800/80 hover:bg-blue-900/80 text-blue-400 px-3 py-1.5 rounded-xl font-bold text-xs transition-transform active:scale-125"
                >
                  <ThumbsUp className="w-4 h-4 fill-blue-400" />
                  <span>{reactions.thumbsUp.toLocaleString('ar-YE')}</span>
                </button>
              </div>
            </div>

            {/* EPG Program Guide */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" />
                  <span>جدول البث المباشر والبرامج اليومية</span>
                </h3>
                <span className="text-xs text-slate-400">الأحد 25 مايو 2025</span>
              </div>

              <div className="space-y-2.5">
                {cmsData.programs.map((prog, idx) => (
                  <div
                    key={prog.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-colors ${
                      idx === 0
                        ? 'bg-red-950/30 border-red-600/60 text-white'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={prog.hostImage} alt="" className="w-10 h-10 rounded-full object-cover border border-red-500/40" />
                      <div>
                        <div className="font-bold text-xs">{prog.title}</div>
                        <div className="text-[10px] text-slate-400">مع الإعلامي {prog.host}</div>
                      </div>
                    </div>

                    <div className="text-left shrink-0">
                      <span className="text-[11px] font-bold text-red-400 block">{prog.airTime}</span>
                      {idx === 0 && (
                        <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full inline-block mt-0.5">
                          يعرض الآن
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Live Chat Column (4 cols) */}
          <div className="lg:col-span-4 bg-[#0e1726] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xl h-[650px] lg:h-auto">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-500" />
                <h3 className="font-extrabold text-sm text-slate-100">الشات المباشر</h3>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                تفاعل حي مع المشاهدين
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-400 text-[11px]">{msg.user}</span>
                    <span className="text-[9px] text-slate-500">{msg.time}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Box */}
            <form onSubmit={handleSendChat} className="pt-3 border-t border-slate-800">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder={user ? "اكتب تعليقك في الشات الحي..." : "سجل الدخول للمشاركة في الشات المباشر..."}
                  value={newChatMessage}
                  onChange={(e) => setNewChatMessage(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl py-2.5 pl-10 pr-3 border border-slate-800 focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  className="absolute left-1.5 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

