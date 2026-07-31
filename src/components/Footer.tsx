import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { YEMEN4_LOGO_URL } from '../data/initialData';
import { Mail, Phone, Globe, Facebook, Twitter, Instagram, Send, Youtube, Radio, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, navigateToCategory, triggerToast, isDarkMode } = useApp();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    triggerToast('تم الاشتراك بنجاح', 'شكراً لاشتراكك في النشارة البريدية لقناة يمن 4 HD.', 'system');
    setEmail('');
  };

  return (
    <footer className={`border-t pt-12 pb-6 px-4 mt-12 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-[#070c16] text-slate-300 border-slate-800/80' 
        : 'bg-[#0f172a] text-slate-200 border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

        {/* Col 1: Brand Info & Satellite */}
        <div className="space-y-4">
          <img src={YEMEN4_LOGO_URL} alt="يمن 4 HD" className="h-16 w-auto object-contain" />
          <p className="text-xs text-slate-400 leading-relaxed">
            قناة إخبارية يمنية مستقلة تقدم تغطية إخبارية شاملة بمصداقية وحيادية من قلب اليمن والعالم.
          </p>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <div className="font-bold text-red-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5" />
              <span>معلومات البث الفضائي</span>
            </div>
            <div className="text-slate-300 text-[11px]">النايل سات: Nilesat 11603 H</div>
            <div className="text-slate-400 text-[10px]">معدل الترميز: 27500 - معامل التصحيح: 5/6</div>
          </div>
        </div>

        {/* Col 2: Quick Links & Contact */}
        <div>
          <h4 className="font-black text-sm text-slate-100 border-b border-red-600/60 pb-2 mb-4 inline-block">
            روابط سريعة
          </h4>
          <ul className="space-y-2 text-xs text-slate-400 font-semibold">
            <li>
              <button onClick={() => setCurrentView('home')} className="hover:text-red-400 transition-colors">
                الرئيسية
              </button>
            </li>
            <li>
              <button onClick={() => navigateToCategory('الأخبار')} className="hover:text-red-400 transition-colors">
                الأخبار العاجلة
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('live')} className="hover:text-red-400 transition-colors flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                <span>البث المباشر</span>
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('program')} className="hover:text-red-400 transition-colors">
                جدول البرامج
              </button>
            </li>
            <li>
              <button onClick={() => setCurrentView('videos')} className="hover:text-red-400 transition-colors">
                مكتبة الفيديوهات
              </button>
            </li>
            <li className="pt-2 text-[11px] text-slate-400 space-y-1 border-t border-slate-800">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-red-500" />
                <span>info@yemen4.tv</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-red-500" />
                <span>+967 770 123 456</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div>
          <h4 className="font-black text-sm text-slate-100 border-b border-red-600/60 pb-2 mb-4 inline-block">
            الأقسام الرئيسية
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-semibold">
            {['السياسة', 'الاقتصاد', 'الرياضة', 'التكنولوجيا', 'المحافظات', 'العالم', 'الصحة', 'ثقافة وفن'].map((cat) => (
              <button
                key={cat}
                onClick={() => navigateToCategory(cat)}
                className="text-right hover:text-red-400 transition-colors py-1"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Col 4: Newsletter Subscription */}
        <div>
          <h4 className="font-black text-sm text-slate-100 border-b border-red-600/60 pb-2 mb-4 inline-block">
            النشرة البريدية
          </h4>
          <p className="text-xs text-slate-400 mb-3">
            اشترك ليصلك آخر الأخبار والتقارير الحصرية مباشرة إلى بريدك الإلكتروني.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <input
              type="email"
              placeholder="البريد الإلكتروني..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              {subscribed ? <Check className="w-4 h-4" /> : null}
              <span>{subscribed ? 'تم الاشتراك' : 'اشترك الآن'}</span>
            </button>
          </form>

          {/* Socials */}
          <div className="flex items-center gap-3 mt-5 pt-3 border-t border-slate-800 text-slate-400">
            <a href="#youtube" className="hover:text-red-500 transition-colors"><Youtube className="w-4 h-4" /></a>
            <a href="#telegram" className="hover:text-sky-400 transition-colors"><Send className="w-4 h-4" /></a>
            <a href="#instagram" className="hover:text-pink-400 transition-colors"><Instagram className="w-4 h-4" /></a>
            <a href="#x" className="hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#facebook" className="hover:text-blue-500 transition-colors"><Facebook className="w-4 h-4" /></a>
          </div>
        </div>

      </div>

        {/* Bottom Bar & Informational Pages Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs font-bold text-slate-400 gap-3 pt-6 border-t border-slate-800/80">
          <div>جميع الحقوق محفوظة © شبكة وقناة يمن 4 HD - 2026</div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button onClick={() => setCurrentView('about')} className="hover:text-red-400 transition-colors">
              من نحن
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setCurrentView('contact')} className="hover:text-red-400 transition-colors">
              اتصل بنا
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setCurrentView('frequencies')} className="hover:text-red-400 transition-colors">
              ترددات القناة
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setCurrentView('privacy')} className="hover:text-red-400 transition-colors">
              سياسة الخصوصية
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setCurrentView('cookies')} className="hover:text-red-400 transition-colors">
              تفضيلات الكوكيز
            </button>
            <span className="text-slate-700">•</span>
            <button onClick={() => setCurrentView('rss')} className="hover:text-red-400 transition-colors flex items-center gap-1 text-amber-400">
              <span>خلاصة RSS</span>
            </button>
          </div>
        </div>
    </footer>
  );
};
