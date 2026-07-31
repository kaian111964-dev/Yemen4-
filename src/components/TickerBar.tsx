import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { YEMEN4_LOGO_URL } from '../data/initialData';
import { Zap, ChevronLeft } from 'lucide-react';

export const TickerBar: React.FC = () => {
  const { cmsData, navigateToArticle } = useApp();

  if (cmsData.siteSettings?.showBreakingTicker === false) {
    return null;
  }

  const trackRef = useRef<HTMLDivElement>(null);
  const animFrameId = useRef<number | null>(null);
  const posRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);

  const rawTickerItems =
    cmsData.tickerText && cmsData.tickerText.length > 0
      ? cmsData.tickerText
      : ['عاجل: قناة يمن 4 HD - البث المباشر والأخبار العاجلة على مدار الساعة'];

  // Duplicate items array to ensure seamless infinite looping track
  const tickerItems = [...rawTickerItems, ...rawTickerItems, ...rawTickerItems];

  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      const track = trackRef.current;
      if (track) {
        const halfWidth = track.scrollWidth / 2;

        if (!isPaused && halfWidth > 0) {
          // Smooth continuous infinite scrolling from Left to Right (من اليسار إلى اليمين)
          const speed = 45;
          posRef.current += (speed * delta) / 1000;

          if (posRef.current >= halfWidth) {
            posRef.current -= halfWidth;
          }

          // Offset ranges from -halfWidth to 0 as posRef increases, creating seamless Left-to-Right (+ direction) motion
          track.style.transform = `translate3d(${posRef.current - halfWidth}px, 0, 0)`;
        }
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isPaused, cmsData.tickerText]);

  const renderNewsList = (list: string[], prefix: string) => (
    <div className="flex items-center shrink-0">
      {list.map((item, idx) => (
        <div key={`${prefix}-${idx}`} className="inline-flex items-center shrink-0">
          <span
            onClick={() => navigateToArticle('art-1')}
            className="inline-flex items-center cursor-pointer hover:text-amber-200 transition-colors px-3 shrink-0"
          >
            <span className="whitespace-nowrap font-bold text-xs sm:text-sm text-white drop-shadow-sm">
              {item}
            </span>
          </span>

          {/* Yemen 4 Logo Divider between news items */}
          <div className="inline-flex items-center gap-2 px-3 shrink-0 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm"></span>
            <img
              src={YEMEN4_LOGO_URL}
              alt="شعار يمن 4"
              className="h-5 sm:h-6 w-auto object-contain filter drop-shadow-[0_2px_5px_rgba(0,0,0,0.6)]"
            />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-sm"></span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#8b0000] bg-gradient-to-r from-red-700 via-red-800 to-[#8b0000] text-white flex items-center shadow-inner overflow-hidden border-b border-red-900/60">
      {/* Red Pulse Badge */}
      <div className="bg-red-900/90 text-white font-extrabold px-4 py-2.5 text-xs sm:text-sm flex items-center gap-2 shadow-md z-10 shrink-0 border-l border-red-500/40 select-none">
        <Zap className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
        <span className="tracking-wide">عاجل</span>
      </div>

      {/* Marquee Ticker Track (LTR wrapper container to avoid browser RTL transform issues) */}
      <div
        className="flex-1 overflow-hidden relative py-2 text-xs sm:text-sm font-bold flex"
        dir="ltr"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div ref={trackRef} className="flex shrink-0 items-center will-change-transform" dir="rtl">
          {renderNewsList(tickerItems, 'set-1')}
          {renderNewsList(tickerItems, 'set-2')}
        </div>
      </div>

      {/* Quick View Button */}
      <button
        onClick={() => navigateToArticle('art-1')}
        className="hidden md:flex items-center gap-1 bg-black/30 hover:bg-black/50 text-white/90 text-xs px-3 py-2.5 font-bold shrink-0 transition-colors z-10 select-none"
      >
        <span>التفاصيل</span>
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
};

