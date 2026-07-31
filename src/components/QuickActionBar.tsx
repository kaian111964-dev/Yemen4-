import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Archive, MessageSquareHeart, BellRing, Smartphone, Tv } from 'lucide-react';
import { PollsModal } from './PollsModal';

export const QuickActionBar: React.FC = () => {
  const { setCurrentView, triggerToast, isDarkMode } = useApp();
  const [isPollOpen, setIsPollOpen] = useState(false);

  const actions = [
    {
      id: 'archive',
      title: 'أرشيف الأخبار',
      subtitle: 'ابحث في أرشيفنا',
      icon: Archive,
      color: 'from-blue-600/30 to-indigo-900/40 border-blue-500/30 text-blue-400',
      onClick: () => setCurrentView('category')
    },
    {
      id: 'polls',
      title: 'شاركنا رأيك',
      subtitle: 'تواصل معنا واستطلاعات',
      icon: MessageSquareHeart,
      color: 'from-pink-600/30 to-rose-900/40 border-pink-500/30 text-pink-400',
      onClick: () => setIsPollOpen(true)
    },
    {
      id: 'notifications',
      title: 'إشعارات فورية',
      subtitle: 'أهم الأخبار لحظة بلحظة',
      icon: BellRing,
      color: 'from-amber-600/30 to-amber-900/40 border-amber-500/30 text-amber-400',
      onClick: () => triggerToast('تم تفعيل الإشعارات الفورية', 'ستصلك تنبيهات الأخبار العاجلة على متصفحك مباشرة.', 'breaking')
    },
    {
      id: 'app',
      title: 'تطبيق الجوال',
      subtitle: 'حمل تطبيقاتنا الآن',
      icon: Smartphone,
      color: 'from-emerald-600/30 to-teal-900/40 border-emerald-500/30 text-emerald-400',
      onClick: () => triggerToast('تطبيق يمن 4 HD', 'يتوفر قريباً على Google Play و App Store.', 'system')
    },
    {
      id: 'live',
      title: 'البث المباشر',
      subtitle: 'شاهد البث بجودة عالية',
      icon: Tv,
      color: 'from-red-600/30 to-red-950/40 border-red-500/30 text-red-400',
      onClick: () => setCurrentView('live')
    }
  ];

  return (
    <>
      <section className="py-6 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <div
                key={act.id}
                onClick={act.onClick}
                className={`bg-gradient-to-br ${act.color} border rounded-2xl p-4 shadow-xl hover:scale-[1.02] cursor-pointer transition-all duration-300 flex items-center gap-3.5 group ${
                  isDarkMode ? 'bg-[#0e1726]' : 'bg-white shadow-md'
                }`}
              >
                <div className={`p-3 rounded-xl border shadow group-hover:scale-110 transition-transform shrink-0 ${
                  isDarkMode ? 'bg-slate-900/80 border-slate-700/60' : 'bg-slate-100 border-slate-200'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className={`font-extrabold text-xs sm:text-sm transition-colors truncate ${
                    isDarkMode ? 'text-slate-100 group-hover:text-white' : 'text-slate-900 group-hover:text-black'
                  }`}>
                    {act.title}
                  </h4>
                  <p className={`text-[10px] sm:text-xs truncate mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {act.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Polls Modal */}
      {isPollOpen && <PollsModal onClose={() => setIsPollOpen(false)} />}
    </>
  );
};
