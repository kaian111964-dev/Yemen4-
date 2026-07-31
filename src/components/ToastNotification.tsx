import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Zap, Radio, MessageSquare, Info, X, Volume2, VolumeX, ExternalLink, Sparkles } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toast, user, navigateToArticle } = useApp();
  const [isVisible, setIsVisible] = useState(false);
  const [soundMuted, setSoundMuted] = useState(false);

  // Check if user has explicitly disabled breaking toast notifications
  const isEnabled = user?.notificationsEnabled !== false;

  useEffect(() => {
    if (toast && isEnabled) {
      setIsVisible(true);

      // Synthesize a gentle non-intrusive notification chime for breaking news
      if (toast.type === 'breaking' && !soundMuted && (user?.soundEnabled !== false)) {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
            osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.45);
          }
        } catch {
          // Ignore audio errors if blocked by browser autoplay policy
        }
      }

      // Auto dismiss after 6 seconds unless user dismisses earlier
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 6000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [toast, isEnabled, user?.soundEnabled, soundMuted]);

  if (!toast || !isVisible || !isEnabled) return null;

  const handleArticleClick = () => {
    setIsVisible(false);
    if (toast.linkArticleId) {
      navigateToArticle(toast.linkArticleId);
    } else {
      // Default to first breaking article if available
      navigateToArticle('art-1');
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full animate-slideUp transition-all duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl relative overflow-hidden flex flex-col gap-3 ${
        toast.type === 'breaking'
          ? 'bg-[#0f0d1a]/95 border-red-500/60 shadow-red-600/30 text-white'
          : toast.type === 'live'
            ? 'bg-[#0b1716]/95 border-emerald-500/60 shadow-emerald-600/30 text-white'
            : 'bg-[#0e1726]/95 border-slate-700 text-white shadow-black/50'
      }`}>
        {/* Glow accent */}
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
          toast.type === 'breaking' ? 'bg-red-600/20' : toast.type === 'live' ? 'bg-emerald-500/20' : 'bg-sky-500/10'
        }`}></div>

        {/* Top Header Row */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl flex items-center justify-center border ${
              toast.type === 'breaking'
                ? 'bg-red-600 text-white border-red-400 shadow-md animate-pulse'
                : toast.type === 'live'
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : 'bg-slate-800 text-sky-400 border-slate-700'
            }`}>
              {toast.type === 'breaking' ? (
                <Zap className="w-4 h-4 fill-white" />
              ) : toast.type === 'live' ? (
                <Radio className="w-4 h-4 animate-ping" />
              ) : toast.type === 'comment' ? (
                <MessageSquare className="w-4 h-4" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
            </div>

            <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-wider ${
                toast.type === 'breaking' ? 'text-red-400' : toast.type === 'live' ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {toast.type === 'breaking' ? 'تنبيه خبر عاجل 🔴' : toast.type === 'live' ? 'بث حي مباشر 📺' : 'إشعار النظام'}
              </span>
              <h4 className="font-black text-xs text-white line-clamp-1">{toast.title}</h4>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              title={soundMuted ? 'كتم الصوت' : 'تفعيل الصوت'}
            >
              {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-500" /> : <Volume2 className="w-3.5 h-3.5 text-slate-300" />}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
              title="إغلاق التنبيه"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Body */}
        <p className="text-xs text-slate-200 leading-snug line-clamp-2 relative z-10 px-0.5">
          {toast.message}
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 relative z-10">
          <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>يمن 4 HD التفاعلي</span>
          </span>

          <button
            onClick={handleArticleClick}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow ${
              toast.type === 'breaking'
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <span>التفاصيل</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
