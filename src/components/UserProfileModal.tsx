import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Bookmark, Save, ArrowRight, LogOut, Check, Sparkles, MessageSquare, Bell, Volume2, ShieldCheck } from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { user, setUser, cmsData, setCurrentView, navigateToArticle, triggerToast } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.notificationsEnabled !== false);
  const [soundEnabled, setSoundEnabled] = useState(user?.soundEnabled !== false);

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setUser({
      ...user,
      name,
      bio,
      avatar,
      notificationsEnabled,
      soundEnabled
    });
    triggerToast('تم تحديث الملف الشخصي والتنبيهات', 'تم حفظ التفضيلات والإعدادات الذكية بنجاح.', 'system');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    triggerToast('تم تسجيل الخروج', 'نأمل رؤيتك مجدداً في بوابة يمن 4 HD.', 'system');
  };

  const savedArticlesList = user
    ? cmsData.articles.filter(a => user.savedArticles.includes(a.id))
    : [];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-6 px-4 animate-fadeIn">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowRight className="w-4 h-4 text-red-500" />
            <span>العودة للرئيسية</span>
          </button>

          <h1 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
            <User className="w-6 h-6 text-red-500" />
            <span>تخصيص الملف الشخصي للمستخدم</span>
          </h1>
        </div>

        {/* Main Grid: Edit Form (6 cols) + Saved Articles (6 cols) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Profile Edit Column (6 cols) */}
          <div className="md:col-span-6 bg-[#0e1726] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>بيانات المستخدم</span>
              </h3>

              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>

            {/* Current Avatar */}
            <div className="flex flex-col items-center gap-3">
              <img src={avatar} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-red-600/50 shadow-xl" />

              <span className="text-xs text-slate-400 font-bold">اختر صورة شخصية:</span>
              <div className="flex items-center gap-2">
                {avatarOptions.map((imgUrl, i) => (
                  <img
                    key={i}
                    src={imgUrl}
                    alt=""
                    onClick={() => setAvatar(imgUrl)}
                    className={`w-10 h-10 rounded-full object-cover cursor-pointer border-2 transition-transform ${
                      avatar === imgUrl ? 'border-red-500 scale-110 shadow-lg' : 'border-slate-800 opacity-60'
                    }`}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 pt-3 border-t border-slate-800">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">الاسم الكريم</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">النبذة الشخصية (Bio)</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                ></textarea>
              </div>

              {/* Smart Toast Notifications Control */}
              <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" />
                    <span>تفضيلات التنبيهات الذكية (Toast)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold">يمن 4 HD</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-200 font-bold">تنبيهات الأخبار العاجلة (Toast Alerts)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-red-600 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-sky-400" />
                    <span className="text-slate-200 font-bold">نغمة التنبيه الصوتية عند وصول خبر عاجل</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    disabled={!notificationsEnabled}
                    className="w-4 h-4 accent-red-600 cursor-pointer disabled:opacity-40"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التغييرات</span>
              </button>
            </form>
          </div>

          {/* Saved Articles & Activity (6 cols) */}
          <div className="md:col-span-6 bg-[#0e1726] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                <span>الأخبار المحفوظة ({savedArticlesList.length})</span>
              </h3>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {savedArticlesList.length > 0 ? (
                savedArticlesList.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => navigateToArticle(art.id)}
                    className="flex items-center gap-3 p-3 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all"
                  >
                    <img src={art.imageUrl} alt="" className="w-14 h-12 rounded object-cover border border-slate-800" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-red-400 font-bold block">{art.category}</span>
                      <h4 className="font-bold text-xs text-slate-200 line-clamp-1">{art.title}</h4>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">لا توجد أخبار محفوظة حتى الآن</div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
