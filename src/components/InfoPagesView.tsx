import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { YEMEN4_LOGO_URL } from '../data/initialData';
import {
  Info, Mail, Phone, MapPin, Radio, ShieldCheck, Cookie, Rss, Globe, Tv,
  CheckCircle2, Send, Copy, Sparkles, Building2, Award, Clock, Users,
  Sliders, Lock, ShieldAlert, ChevronRight, HelpCircle, Check, FileText
} from 'lucide-react';

export const InfoPagesView: React.FC = () => {
  const { currentView, setCurrentView, isDarkMode, triggerToast } = useApp();

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('عام');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Cookie settings state
  const [necessaryCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [preferenceCookies, setPreferenceCookies] = useState(true);
  const [marketingCookies, setMarketingCookies] = useState(false);

  // RSS copy state
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    triggerToast('تم إرسال رسالتك بنجاح ✨', 'شكراً لتواصلك مع إدارة قناة يمن 4 HD. سيقوم فريقنا بالرد عليك خلال 24 ساعة.', 'system');
  };

  const handleSaveCookies = () => {
    triggerToast('تم حفظ التفضيلات 🍪', 'تم تحديث تفضيلات ملفات الكوكيز والارتباط بنجاح.', 'system');
  };

  const handleCopyRss = (url: string, title: string) => {
    navigator.clipboard.writeText(url);
    setCopiedFeed(title);
    triggerToast('تم نسخ الرابط 🔗', `تم نسخ رابط خلاصة RSS لـ (${title}) بنجاح.`, 'system');
    setTimeout(() => setCopiedFeed(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header Navigation Tabs for Information Pages */}
      <div className={`p-4 sm:p-6 rounded-3xl border shadow-xl mb-8 relative overflow-hidden transition-all ${
        isDarkMode ? 'bg-[#0a1120] border-slate-800' : 'bg-slate-900 text-white border-slate-800'
      }`}>
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center shadow-lg shadow-red-600/30 shrink-0">
              <Tv className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">شبكة ومؤسسة يمن 4 HD الإعلامية</h1>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">الصفحات الرسمية، الشفافية، معلومات البث والتواصل</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('home')}
            className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl transition-all border border-slate-700 flex items-center gap-1.5"
          >
            <ChevronRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar relative z-10">
          {[
            { id: 'about', label: 'من نحن', icon: Info },
            { id: 'contact', label: 'اتصل بنا', icon: Mail },
            { id: 'frequencies', label: 'ترددات القناة', icon: Radio },
            { id: 'privacy', label: 'سياسة الخصوصية', icon: ShieldCheck },
            { id: 'cookies', label: 'تفضيلات ملفات الارتباط', icon: Cookie },
            { id: 'rss', label: 'خلاصة الأخبار RSS', icon: Rss },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = currentView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-2 border ${
                  isActive
                    ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30 scale-105'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW 1: ABOUT US (من نحن) */}
      {currentView === 'about' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Hero Banner */}
          <div className={`p-8 sm:p-12 rounded-3xl border relative overflow-hidden text-center ${
            isDarkMode ? 'bg-[#0a1120] border-slate-800 text-white' : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white border-slate-800 shadow-2xl'
          }`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent pointer-events-none"></div>

            <span className="bg-red-600/20 text-red-400 border border-red-500/30 text-xs font-black px-4 py-1.5 rounded-full inline-flex items-center gap-2 mb-4 shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>قناة كل اليمن - صوت الحقيقة والوطن</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight max-w-4xl mx-auto">
              تغطية إخبارية حية، مصداقية مطلقة، وتوثيق نبض الشارع اليمني والعربي
            </h2>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              تأسست قناة **يمن 4 HD** كمنبر إعلامي يمني حر ومستقل، يهدف إلى تقديم الصورة الكاملة بكل أمانة ومهنية. نحن نجمع بين الأصالة الوطنية والتقنية الفضائية الرقمية الأحدث لنكون النافذة الأولى لليمنيين في الداخل والمغتربين حول العالم.
            </p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-800">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                <div className="text-2xl sm:text-3xl font-black text-red-500 font-mono">24/7</div>
                <div className="text-xs font-bold text-slate-300 mt-1">بث فضائي متواصل</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">+5,000,000</div>
                <div className="text-xs font-bold text-slate-300 mt-1">متابع عبر الشاشة والدخول الرقمي</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">14</div>
                <div className="text-xs font-bold text-slate-300 mt-1">مكتب مراسلة بالمحافظات</div>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/60">
                <div className="text-2xl sm:text-3xl font-black text-sky-400 font-mono">100%</div>
                <div className="text-xs font-bold text-slate-300 mt-1">حيادية ومهنية صحفية</div>
              </div>
            </div>
          </div>

          {/* Pillars & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">رؤيتنا الإعلامية</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                أن نكون المؤسسة الإعلامية الرائدة والموثوقة أولاً في اليمن والمنطقة العربية، من خلال تقديم محتوى إخباري وبرامجي يواكب التطور التكنولوجي ويعكس تطلعات الإنسان اليمني.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">رسالتنا للجمهور</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                إيصال الصوت اليمني الحقيقي، ونقل الحقائق من أرض الواقع بدون تزييف، وتعزيز قيم الحوار، الهوية الثقافية، ودعم قضايا المجتمع بكل أطيافه.
              </p>
            </div>

            <div className={`p-6 rounded-3xl border ${isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-md'}`}>
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">معايير الشفافية</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                نلتزم بأعلى قواعد الشرف الصحفي الدولي، وتدقيق المصادر متعدد المستويات لضمان دقة الأخبار العاجلة والتقارير الميدانية.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: CONTACT US (اتصل بنا) */}
      {currentView === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Form */}
          <div className={`lg:col-span-2 p-6 sm:p-8 rounded-3xl border ${
            isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-xl'
          }`}>
            <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">تواصل مع إدارة القناة والتحرير</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">يسعدنا استقبال آرائكم، استفساراتكم، والبلاغات الصحفية على مدار الساعة</p>
            </div>

            {contactSubmitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">تم استلام رسالتك بنجاح!</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  نشكرك على التواصل مع **يمن 4 HD**. قام فريق خدمة الجمهور وغرفة الأخبار بتسجيل طلبك برقم مرجعي وسوف يتواصلون معك قريباً.
                </p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition-all shadow"
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">الاسم الكامل *</label>
                    <input
                      type="text"
                      placeholder="مثال: عبدالله أحمد..."
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">رقم الهاتف (اختياري)</label>
                    <input
                      type="tel"
                      placeholder="+967 770 000 000"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">قسم التوجيه</label>
                    <select
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 font-bold"
                    >
                      <option value="عام">استفسار عام</option>
                      <option value="الأخبار">غرفة الأخبار والتقارير الصحفية</option>
                      <option value="البرامج">مواضيع المشاركة بالبرامج</option>
                      <option value="الإعلانات">الإعلانات والأنشطة التجارية</option>
                      <option value="البث الفضائي">مشاكل البث والترددات</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">نص الرسالة *</label>
                  <textarea
                    rows={5}
                    placeholder="اكتب تفاصيل الرسالة هنا..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-red-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>إرسال الرسالة إلى إدارة القناة</span>
                </button>
              </form>
            )}
          </div>

          {/* Contact Details Column */}
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border space-y-4 ${
              isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-xl'
            }`}>
              <h3 className="font-black text-base text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">
                المقرات والمكاتب الرئيسية
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-xl shrink-0 mt-0.5">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">المقر الرئيسي - صنعاء</strong>
                    <span className="text-slate-500 dark:text-slate-400">شارع الزبيري - المجمع الإعلامي الحديث</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">مكتب عدن الإقليمي</strong>
                    <span className="text-slate-500 dark:text-slate-400">مديرية المعلا - الشارع الرئيسي</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">البريد الإلكتروني الموحد</strong>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">news@yemen4.tv / info@yemen4.tv</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 dark:text-white">الهاتف والواتساب المباشر</strong>
                    <span className="text-slate-500 dark:text-slate-400 font-mono">+967 770 123 456 / +967 1 234567</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Preview Placeholder */}
            <div className={`p-4 rounded-3xl border text-center space-y-2 ${
              isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="h-32 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 opacity-90"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <MapPin className="w-8 h-8 text-red-500 animate-bounce mb-1" />
                  <span className="text-xs font-bold text-white">الجمهورية اليمنية - صنعاء</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CHANNEL FREQUENCIES (ترددات القناة) */}
      {currentView === 'frequencies' && (
        <div className="space-y-8 animate-fadeIn">
          {/* Header Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
            isDarkMode ? 'bg-[#0a1120] border-slate-800 text-white' : 'bg-gradient-to-r from-slate-900 to-slate-950 text-white border-slate-800 shadow-xl'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-3 py-1 rounded-full inline-block mb-2">
                  بث عالي الدقة HD 1080p
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white">جدول ترددات البث الفضائي - يمن 4 HD</h2>
                <p className="text-xs text-slate-400 mt-1">اضبط أجهزة الاستقبال الخاصة بك للتمتع بأعلى جودة للصوت والصورة</p>
              </div>

              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-4 py-2 rounded-2xl">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping"></span>
                <span className="text-xs font-bold text-emerald-400">إشارة البث: ممتازة (100%)</span>
              </div>
            </div>
          </div>

          {/* Frequencies Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nilesat */}
            <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-xl ${
              isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-xs flex items-center justify-center shadow">
                    NILE
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">قمر النايل سات (Nilesat 7° West)</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">المدار الرئيسي للشرق الأوسط وشمال أفريقيا</span>
                  </div>
                </div>
                <span className="bg-red-500/10 text-red-500 text-xs font-black px-2.5 py-1 rounded-lg">HD</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">التردد (Frequency):</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-sm">11603</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">الاستقطاب (Polarization):</span>
                  <span className="font-bold text-red-500">أفقي (H)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">معدل الترميز (Symbol Rate):</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white">27500</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">معامل تصحيح الخطأ (FEC):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">5/6</span>
                </div>
              </div>
            </div>

            {/* Badr / Arabsat */}
            <div className={`p-6 rounded-3xl border relative overflow-hidden shadow-xl ${
              isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white font-black text-xs flex items-center justify-center shadow">
                    BADR
                  </div>
                  <div>
                    <h3 className="font-black text-base text-slate-900 dark:text-white">قمر عربسات بدر (Arabsat Badr 26° East)</h3>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">تغطية كاملة للخليج العربي والشرق الأوسط</span>
                  </div>
                </div>
                <span className="bg-amber-500/10 text-amber-500 text-xs font-black px-2.5 py-1 rounded-lg">HD</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">التردد (Frequency):</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white text-sm">12520</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">الاستقطاب (Polarization):</span>
                  <span className="font-bold text-amber-500">عمودي (V)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">معدل الترميز (Symbol Rate):</span>
                  <span className="font-mono font-black text-slate-900 dark:text-white">27500</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">معامل تصحيح الخطأ (FEC):</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">3/4</span>
                </div>
              </div>
            </div>
          </div>

          {/* Setup Guide Step-by-Step */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
            <h3 className="font-black text-lg text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Tv className="w-5 h-5 text-red-500" />
              <span>خطوات برمجة القناة على جهاز الرسيفر الخاص بك</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-7 h-7 bg-red-600 text-white font-black rounded-lg flex items-center justify-center mb-2">1</span>
                <strong className="block text-slate-900 dark:text-white mb-1">القائمة الرئيسية</strong>
                <p className="text-slate-500 dark:text-slate-400">اضغط زر Menu في الريموت واختر Installation أو التركيب.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-7 h-7 bg-red-600 text-white font-black rounded-lg flex items-center justify-center mb-2">2</span>
                <strong className="block text-slate-900 dark:text-white mb-1">إضافة تردد جديد</strong>
                <p className="text-slate-500 dark:text-slate-400">اختر قائمة الترددات Transponders ثم اضغط إضافة Add (الزر الأقحواني/الأحمر).</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-7 h-7 bg-red-600 text-white font-black rounded-lg flex items-center justify-center mb-2">3</span>
                <strong className="block text-slate-900 dark:text-white mb-1">إدخال البيانات</strong>
                <p className="text-slate-500 dark:text-slate-400">أدخل التردد 11603، الاستقطاب H، ومعدل الترميز 27500.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <span className="w-7 h-7 bg-red-600 text-white font-black rounded-lg flex items-center justify-center mb-2">4</span>
                <strong className="block text-slate-900 dark:text-white mb-1">البحث والحفظ</strong>
                <p className="text-slate-500 dark:text-slate-400">اضغط بحث Search وستظهر قناة (YEMEN 4 HD) بأسفل قائمة القنوات.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: PRIVACY POLICY (سياسة الخصوصية) */}
      {currentView === 'privacy' && (
        <div className={`p-6 sm:p-10 rounded-3xl border space-y-6 animate-fadeIn ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-xl'
        }`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold text-red-500">حماية البيانات والأمان</span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1">وثيقة سياسة الخصوصية وسرية المعلومات</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">تاريخ آخر تحديث: يوليو 2026</p>
          </div>

          <div className="space-y-4 text-xs leading-relaxed">
            <section className="space-y-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-500" />
                <span>1. مقدمة واستخدام المنصة</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                تلتزم شبكة **يمن 4 HD** بحماية خصوصية كافة الزوار والمستخدمين لموقعنا الإلكتروني وتطبيقاتنا الرقمية. توضح هذه الوثيقة طبيعة المعلومات التي نجمعها وكيفية معالجتها واستخدامها وفقاً للأنظمة والمعايير الدولية لحماية حظر وتسريب البيانات.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>2. البيانات التي نجمعها</span>
              </h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>المعلومات المباشرة: مثل البريد الإلكتروني عند الاشتراك بالنشرة البريدية أو التعليق.</li>
                <li>المعلومات التقنية تلقائياً: عنوان البروتوكول (IP Address)، نوع المتصفح، ونظام التشغيل لتحسين جودة عرض البث المباشر.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                <span>3. أمان وحماية المعلومات</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                نحن نستخدم بروتوكولات تشفير عالية الأمان (SSL/TLS 256-bit) لحماية بيانات التعليقات والاستبيانات. لن نقوم ببيع أو مشاركة أو تأجير أي بيانات شخصية لأي طرف ثالث لأغراض تسويقية.
              </p>
            </section>
          </div>
        </div>
      )}

      {/* VIEW 5: COOKIES PREFERENCES (تفضيلات ملفات الارتباط) */}
      {currentView === 'cookies' && (
        <div className={`p-6 sm:p-10 rounded-3xl border space-y-6 animate-fadeIn ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Cookie className="w-6 h-6 text-amber-500" />
              <span>إدارة وتفضيلات ملفات الارتباط (Cookies)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              يمكنك تخصيص وتحديد ملفات الكوكيز التي ترغب في السماح بها لتحسين تجربتك في تصفح أخبار وبث القناة.
            </p>
          </div>

          <div className="space-y-4">
            {/* Necessary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="block text-sm font-black text-slate-900 dark:text-white">ملفات الارتباط الأساسية (ضرورية)</strong>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">مطلوبة لتشغيل البث المباشر، الأمان، والتصفح الأساسي ولا يمكن إيقافها.</p>
              </div>
              <span className="bg-emerald-500/10 text-emerald-500 text-xs font-black px-3 py-1 rounded-full border border-emerald-500/20">
                دائماً مفعلة
              </span>
            </div>

            {/* Analytics */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="block text-sm font-black text-slate-900 dark:text-white">ملفات الارتباط التحليلية والإحصائية</strong>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تساعدنا في فهم كيفية استخدام الزوار للموقع لتقديم الأخبار الأكثر ملاءمة.</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsCookies}
                onChange={(e) => setAnalyticsCookies(e.target.checked)}
                className="w-5 h-5 accent-red-600 cursor-pointer"
              />
            </div>

            {/* Preferences */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="block text-sm font-black text-slate-900 dark:text-white">ملفات الارتباط للتفضيلات والشكل</strong>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تتيح للموقع تذكر خياراتك مثل الوضع الليلي المفضل أو الفئات المختارة.</p>
              </div>
              <input
                type="checkbox"
                checked={preferenceCookies}
                onChange={(e) => setPreferenceCookies(e.target.checked)}
                className="w-5 h-5 accent-red-600 cursor-pointer"
              />
            </div>

            {/* Marketing */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <strong className="block text-sm font-black text-slate-900 dark:text-white">ملفات الارتباط الإعلانية للتسويق</strong>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">تُستخدم لعرض إعلانات مخصصة ورعايات إعلامية تهم اهتماماتك.</p>
              </div>
              <input
                type="checkbox"
                checked={marketingCookies}
                onChange={(e) => setMarketingCookies(e.target.checked)}
                className="w-5 h-5 accent-red-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleSaveCookies}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-600/20"
            >
              حفظ التفضيلات الكوكيز
            </button>
          </div>
        </div>
      )}

      {/* VIEW 6: RSS FEEDS (خلاصة الأخبار RSS) */}
      {currentView === 'rss' && (
        <div className="space-y-6 animate-fadeIn">
          <div className={`p-6 sm:p-8 rounded-3xl border ${
            isDarkMode ? 'bg-[#0a1120] border-slate-800 text-white' : 'bg-slate-900 text-white border-slate-800 shadow-xl'
          }`}>
            <div className="flex items-center gap-3 mb-2">
              <Rss className="w-8 h-8 text-amber-500" />
              <h2 className="text-2xl font-black text-white">خدمة خلاصات الأخبار الفورية (RSS Feeds)</h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              اشترك في خلاصات RSS لقناة **يمن 4 HD** للحصول على الأخبار العاجلة والتقارير فور نشرها مباشرة في قوارئ الأخبار المفضلة لديك (Feedly, Apple News, Inoreader).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'الأخبار العاجلة والرئيسية', url: 'https://yemen4.tv/rss/breaking.xml', cat: 'عاجل' },
              { title: 'أخبار اليمن والمحافظات', url: 'https://yemen4.tv/rss/local.xml', cat: 'محلي' },
              { title: 'الشؤون السياسية والدولية', url: 'https://yemen4.tv/rss/politics.xml', cat: 'سياسة' },
              { title: 'الرياضة والنتائج الحية', url: 'https://yemen4.tv/rss/sports.xml', cat: 'رياضة' },
              { title: 'تقارير وتحقيقات حصرية', url: 'https://yemen4.tv/rss/reports.xml', cat: 'تقارير' },
              { title: 'الاقتصاد وأسعار الصرف', url: 'https://yemen4.tv/rss/economy.xml', cat: 'اقتصاد' },
            ].map((rss) => (
              <div
                key={rss.title}
                className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                  isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow'
                }`}
              >
                <div className="truncate">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    <strong className="text-xs font-black text-slate-900 dark:text-white">{rss.title}</strong>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono truncate block mt-1">{rss.url}</span>
                </div>

                <button
                  onClick={() => handleCopyRss(rss.url, rss.title)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 border ${
                    copiedFeed === rss.title
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {copiedFeed === rss.title ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFeed === rss.title ? 'تم النسخ' : 'نسخ الرابط'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
