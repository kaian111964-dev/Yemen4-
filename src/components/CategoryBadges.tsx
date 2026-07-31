import React from 'react';
import { useApp } from '../context/AppContext';
import { Globe, TrendingUp, Trophy, Cpu, HeartPulse, Building2, Palette, Sparkles } from 'lucide-react';

export const CategoryBadges: React.FC = () => {
  const { navigateToCategory, isDarkMode } = useApp();

  const categories = [
    {
      name: 'ثقافة وفن',
      icon: Palette,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
      gradient: 'from-amber-600/90 to-red-900/90'
    },
    {
      name: 'العالم',
      icon: Globe,
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
      gradient: 'from-blue-600/90 to-indigo-900/90'
    },
    {
      name: 'المحافظات',
      icon: Building2,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80',
      gradient: 'from-cyan-600/90 to-slate-900/90'
    },
    {
      name: 'الصحة',
      icon: HeartPulse,
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=80',
      gradient: 'from-rose-600/90 to-pink-900/90'
    },
    {
      name: 'التكنولوجيا',
      icon: Cpu,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80',
      gradient: 'from-purple-600/90 to-blue-900/90'
    },
    {
      name: 'الرياضة',
      icon: Trophy,
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
      gradient: 'from-emerald-600/90 to-teal-900/90'
    },
    {
      name: 'الاقتصاد',
      icon: TrendingUp,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
      gradient: 'from-blue-700/90 to-cyan-950/90'
    },
    {
      name: 'السياسة',
      icon: Sparkles,
      image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=400&q=80',
      gradient: 'from-red-600/90 to-slate-950/90'
    },
  ];

  return (
    <section className="py-6 px-4 max-w-7xl mx-auto">
      <div className={`flex items-center justify-between mb-4 border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        <h2 className={`text-xl font-black flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
          <span className="w-2.5 h-6 bg-red-600 rounded-sm"></span>
          <span>الأقسام الرئيسية</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              onClick={() => navigateToCategory(cat.name)}
              className="relative aspect-square rounded-2xl overflow-hidden cursor-pointer group shadow-xl border border-slate-800 hover:border-slate-600 transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-90"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient} opacity-80 group-hover:opacity-90 transition-opacity flex flex-col items-center justify-center p-2 text-center`}>
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-md mb-1.5 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm font-black text-white drop-shadow-md">
                  {cat.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
