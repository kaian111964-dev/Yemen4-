import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Edit2, Trash2, Save, FileText, Zap, Radio, DollarSign, ArrowRight, Check, Trophy, Bell, Send, Sparkles, Sliders, Flame, Star, Image as ImageIcon, ArrowUp, ArrowDown, Layout, Palette, Clock, Layers, Eye, HardDrive, RotateCcw, Play } from 'lucide-react';
import { Article, SiteLayoutSettings } from '../types';
import { saveSiteSettingsToFirestore } from '../lib/firebase';
import { GoogleDriveModal } from './GoogleDriveModal';
import { DEFAULT_LIVE_POSTER_URL } from '../data/initialData';
import { RichContentEditor } from './RichContentEditor';

export const AdminCMSModal: React.FC = () => {
  const { cmsData, setCmsData, updateTicker, addArticle, updateArticle, deleteArticle, addMatch, updateMatch, deleteMatch, setCurrentView, triggerToast } = useApp();
  const [activeTab, setActiveTab] = useState<'articles' | 'slider' | 'breaking' | 'latest' | 'layout' | 'matches' | 'ticker' | 'live' | 'currencies' | 'notifications'>('articles');
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);

  // Site Layout Settings state
  const [siteLayout, setSiteLayout] = useState<SiteLayoutSettings>(cmsData.siteSettings || {
    sliderAutoPlay: true,
    sliderInterval: 5,
    sliderPauseOnHover: true,
    heroSectionTitle: 'السلايدر الإخباري الرئيسي',
    breakingSectionTitle: 'أهم الأخبار الآن',
    latestSectionTitle: 'آخر الأخبار والتغطيات',
    videosSectionTitle: 'فيديوهات وتقارير مصورة',
    matchesSectionTitle: 'جدول المباريات والتغطية الرياضية',
    categoriesSectionTitle: 'أقسام القناة والأخبار',
    borderRadius: 'rounded-2xl',
    showHeroSlider: true,
    showBreakingTicker: true,
    showBreakingTimeline: true,
    showMatchesBar: true,
    showLatestGrid: true,
    showCategorySections: true,
    showVideosSection: true,
    accentTheme: 'red',
  });

  // New Article Form state
  const [isAddingArticle, setIsAddingArticle] = useState(false);
  const [artTitle, setArtTitle] = useState('');
  const [artExcerpt, setArtExcerpt] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState('محلي');
  const [artImage, setArtImage] = useState('');
  const [artAuthorName, setArtAuthorName] = useState('');
  const [artAuthorRole, setArtAuthorRole] = useState('');
  const [artPriority, setArtPriority] = useState<number>(1);
  const [addToSlider, setAddToSlider] = useState(true);
  const [addToBreaking, setAddToBreaking] = useState(true);
  const [addToLatest, setAddToLatest] = useState(true);
  const [addToTicker, setAddToTicker] = useState(false);
  const [sendToastOnCreate, setSendToastOnCreate] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('الكل');

  // Edit Article Form state
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [editArtTitle, setEditArtTitle] = useState('');
  const [editArtExcerpt, setEditArtExcerpt] = useState('');
  const [editArtContent, setEditArtContent] = useState('');
  const [editArtCategory, setEditArtCategory] = useState('محلي');
  const [editArtImage, setEditArtImage] = useState('');
  const [editArtAuthorName, setEditArtAuthorName] = useState('');
  const [editArtAuthorRole, setEditArtAuthorRole] = useState('');
  const [editArtPriority, setEditArtPriority] = useState<number>(1);
  const [editAddToSlider, setEditAddToSlider] = useState(false);
  const [editAddToBreaking, setEditAddToBreaking] = useState(false);
  const [editAddToLatest, setEditAddToLatest] = useState(true);
  const [editAddToTicker, setEditAddToTicker] = useState(false);

  const handleOpenEditModal = (art: Article) => {
    setEditingArticle(art);
    setEditArtTitle(art.title);
    setEditArtCategory(art.category || 'محلي');
    setEditArtAuthorName(art.author?.name || '');
    setEditArtAuthorRole(art.author?.role || '');
    setEditArtExcerpt(art.excerpt || '');
    setEditArtImage(art.imageUrl || '');
    setEditArtPriority(art.priority || 1);
    setEditArtContent(art.content || '');
    setEditAddToSlider(!!art.isHero);
    setEditAddToBreaking(!!art.isBreaking);
    setEditAddToLatest(art.isLatest !== false);
    setEditAddToTicker(!!art.inTicker);
  };

  const handleSaveEditArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle || !editArtTitle.trim()) return;

    updateArticle(editingArticle.id, {
      title: editArtTitle,
      category: editArtCategory,
      excerpt: editArtExcerpt,
      content: editArtContent,
      imageUrl: editArtImage,
      priority: Number(editArtPriority) || 1,
      isHero: editAddToSlider,
      isBreaking: editAddToBreaking,
      isLatest: editAddToLatest,
      inTicker: editAddToTicker,
      author: editArtAuthorName ? {
        name: editArtAuthorName,
        avatar: editingArticle.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: editArtAuthorRole || 'محرر صحفي'
      } : undefined
    });

    triggerToast('تم تحديث الخبر بنجاح', `تم حفظ وتحديث محتوى الخبر "${editArtTitle.slice(0, 30)}..."`, 'system');
    setEditingArticle(null);
  };

  // Custom Notification Broadcast Form state
  const [notifTitleInput, setNotifTitleInput] = useState('');
  const [notifMsgInput, setNotifMsgInput] = useState('');
  const [notifTypeInput, setNotifTypeInput] = useState<'breaking' | 'live' | 'system' | 'comment'>('breaking');

  // New Match Form state
  const [isAddingMatch, setIsAddingMatch] = useState(false);
  const [mHomeTeam, setMHomeTeam] = useState('');
  const [mHomeLogo, setMHomeLogo] = useState('');
  const [mHomeScore, setMHomeScore] = useState<number>(0);
  const [mAwayTeam, setMAwayTeam] = useState('');
  const [mAwayLogo, setMAwayLogo] = useState('');
  const [mAwayScore, setMAwayScore] = useState<number>(0);
  const [mTournament, setMTournament] = useState('الدوري اليمني الممتاز');
  const [mDate, setMDate] = useState('اليوم');
  const [mTime, setMTime] = useState('20:00');
  const [mStatus, setMStatus] = useState<'live' | 'upcoming' | 'finished'>('upcoming');
  const [mMinute, setMMinute] = useState("65'");
  const [mChannel, setMChannel] = useState('يمن 4 HD');
  const [mStadium, setMStadium] = useState('استاد المريسي - صنعاء');

  // Ticker items state
  const [tickerItems, setTickerItems] = useState<string[]>(cmsData.tickerText);
  const [newTickerInput, setNewTickerInput] = useState('');

  // Live Stream & Poster Image state
  const [liveUrl, setLiveUrl] = useState(cmsData.liveStreamUrl);
  const [livePosterUrl, setLivePosterUrl] = useState(cmsData.liveStreamPosterUrl ?? cmsData.siteSettings?.liveStreamPosterUrl ?? DEFAULT_LIVE_POSTER_URL);
  const [driveTarget, setDriveTarget] = useState<'article' | 'livePoster'>('article');

  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim()) return;

    const newArtId = `art-${Date.now()}`;

    addArticle({
      id: newArtId,
      title: artTitle,
      excerpt: artExcerpt,
      content: artContent,
      category: artCategory,
      imageUrl: artImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      isHero: addToSlider,
      isBreaking: addToBreaking,
      isLatest: addToLatest,
      inTicker: addToTicker,
      priority: Number(artPriority) || 1,
      author: artAuthorName ? {
        name: artAuthorName,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: artAuthorRole || 'محرر صحفي'
      } : undefined
    });

    if (sendToastOnCreate) {
      triggerToast(
        `خبر عاجل: ${artCategory}`,
        artTitle,
        'breaking'
      );
    }

    setArtTitle('');
    setArtExcerpt('');
    setArtContent('');
    setArtAuthorName('');
    setArtAuthorRole('');
    setIsAddingArticle(false);
  };

  const handleCreateMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mHomeTeam.trim() || !mAwayTeam.trim()) return;

    addMatch({
      homeTeam: mHomeTeam,
      homeLogo: mHomeLogo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      homeScore: Number(mHomeScore),
      awayTeam: mAwayTeam,
      awayLogo: mAwayLogo || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=120&q=80',
      awayScore: Number(mAwayScore),
      tournament: mTournament,
      date: mDate,
      time: mTime,
      status: mStatus,
      minute: mStatus === 'live' ? mMinute : undefined,
      channel: mChannel,
      stadium: mStadium
    });

    setMHomeTeam('');
    setMAwayTeam('');
    setIsAddingMatch(false);
  };

  const handleSaveTicker = () => {
    updateTicker(tickerItems);
  };

  const handleAddTickerItem = () => {
    if (!newTickerInput.trim()) return;
    setTickerItems(prev => [...prev, newTickerInput.trim()]);
    setNewTickerInput('');
  };

  const handleRemoveTickerItem = (index: number) => {
    setTickerItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveLiveSettings = () => {
    const updatedSiteSettings = {
      ...(cmsData.siteSettings || {}),
      liveStreamUrl: liveUrl,
      liveStreamPosterUrl: livePosterUrl
    };

    setCmsData(prev => ({
      ...prev,
      liveStreamUrl: liveUrl,
      liveStreamPosterUrl: livePosterUrl,
      siteSettings: updatedSiteSettings as SiteLayoutSettings
    }));

    saveSiteSettingsToFirestore(updatedSiteSettings as SiteLayoutSettings);
    triggerToast('تم حفظ إعدادات البث وصورة المشغل', 'تم تحديث رابط البث الحي وصورة الغلاف في مشغل القناة بنجاح.', 'live');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-6 px-4 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Bar Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl transition-all"
          >
            <ArrowRight className="w-4 h-4 text-red-500" />
            <span>العودة للموقع</span>
          </button>

          <div className="text-right">
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-600 rounded-sm"></span>
              <span>لوحة تحكم إدارة المحتوى (Yemen 4 CMS)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">نظام إدارة محتوى مرن، سريع، ومحدث فورياً</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'articles' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>الأخبار والمقالات ({cmsData.articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('slider')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'slider' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>إدارة السلايدر ({(cmsData.articles.filter(a => a.isHero) || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('breaking')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'breaking' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-4 h-4 text-red-500" />
            <span>أهم الأخبار الآن ({(cmsData.articles.filter(a => a.isBreaking) || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('latest')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'latest' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-400" />
            <span>قسم آخر الأخبار ({(cmsData.articles.filter(a => a.isLatest !== false) || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('layout')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'layout' ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layout className="w-4 h-4 text-amber-300" />
            <span>⚙️ أداة ضبط وتنسيق الواجهة والأقسام</span>
          </button>

          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'matches' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>جدول المباريات ({(cmsData.matches || []).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ticker')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'ticker' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>الشريط العاجل</span>
          </button>

          <button
            onClick={() => setActiveTab('live')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'live' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>إعدادات البث المباشر</span>
          </button>

          <button
            onClick={() => setActiveTab('currencies')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'currencies' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>أسعار العملات والطقس</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'notifications' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-4 h-4 text-amber-300" />
            <span>إطلاق الإشعار الذكي (Toast)</span>
          </button>
        </div>

        {/* TAB 1: ARTICLES MANAGEMENT */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-200">قائمة الأخبار والمقالات المنشورة</h2>
              <button
                onClick={() => setIsAddingArticle(!isAddingArticle)}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة خبر جديد</span>
              </button>
            </div>

            {/* Create New Article Drawer / Form */}
            {isAddingArticle && (
              <form onSubmit={handleCreateArticleSubmit} className="bg-[#0e1726] border border-slate-700 p-6 rounded-2xl space-y-4 shadow-2xl">
                <h3 className="font-extrabold text-sm text-red-400 border-b border-slate-800 pb-2">
                  بيانات الخبر الجديد
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">عنوان الخبر</label>
                    <input
                      type="text"
                      required
                      placeholder="عنوان الخبر الرئيسي..."
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">القسم / التصنيف</label>
                    <select
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                    >
                      <option value="محلي">محلي (أخبار اليمن والمحافظات)</option>
                      <option value="دولي">دولي (أخبار العالم والإقليم)</option>
                      <option value="تقارير">تقارير وتحقيقات</option>
                      <option value="كتابات">كتابات وآراء</option>
                      <option value="رياضة">رياضة محلي ودولي</option>
                      <option value="سياسة">سياسة</option>
                      <option value="اقتصاد">اقتصاد</option>
                      <option value="تكنولوجيا">تكنولوجيا</option>
                      <option value="المحافظات">المحافظات</option>
                      <option value="خبر اليوم">خبر اليوم</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">اسم الكاتب / المحرر (اختياري)</label>
                    <input
                      type="text"
                      placeholder="مثال: د. عبدالرحمن الشامي..."
                      value={artAuthorName}
                      onChange={(e) => setArtAuthorName(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">الصفة / الصفة المهنية</label>
                    <input
                      type="text"
                      placeholder="مثال: أستاذ العلوم السياسية..."
                      value={artAuthorRole}
                      onChange={(e) => setArtAuthorRole(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">الملخص الموجز</label>
                  <input
                    type="text"
                    placeholder="موجز سريع عن الخبر..."
                    value={artExcerpt}
                    onChange={(e) => setArtExcerpt(e.target.value)}
                    className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">رابط الصورة</label>
                      <button
                        type="button"
                        onClick={() => setIsDriveModalOpen(true)}
                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-lg border border-blue-500/30 transition-all"
                      >
                        <HardDrive className="w-3 h-3" />
                        <span>اختيار من Google Drive</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={artImage}
                      onChange={(e) => setArtImage(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-amber-300 block mb-1">درجة الأهمية / الترتيب (Priority)</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={artPriority}
                      onChange={(e) => setArtPriority(Number(e.target.value))}
                      className="w-full bg-slate-900 text-amber-300 font-bold text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Rich Content Editor for New Article */}
                <RichContentEditor
                  editorId="new-article-content-area"
                  content={artContent}
                  setContent={setArtContent}
                  excerpt={artExcerpt}
                  setExcerpt={setArtExcerpt}
                  title={artTitle}
                  setTitle={setArtTitle}
                  category={artCategory}
                  authorName={artAuthorName}
                  authorRole={artAuthorRole}
                  imageUrl={artImage}
                  onOpenDriveModal={() => {
                    setDriveTarget('article');
                    setIsDriveModalOpen(true);
                  }}
                />

                {/* Placement & Distribution Toggles (مكان العرض والنشر) */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-extrabold text-red-400 block border-b border-slate-800 pb-2">
                    تحديد أماكن عرض الخبر فور النشر:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-red-500/50 transition-all">
                      <input
                        type="checkbox"
                        checked={addToSlider}
                        onChange={(e) => setAddToSlider(e.target.checked)}
                        className="w-4 h-4 accent-red-600 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>السلايدر الرئيسي</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-red-500/50 transition-all">
                      <input
                        type="checkbox"
                        checked={addToBreaking}
                        onChange={(e) => setAddToBreaking(e.target.checked)}
                        className="w-4 h-4 accent-red-600 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        <span>أهم الأخبار الآن</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-red-500/50 transition-all">
                      <input
                        type="checkbox"
                        checked={addToLatest}
                        onChange={(e) => setAddToLatest(e.target.checked)}
                        className="w-4 h-4 accent-red-600 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        <span>قسم آخر الأخبار</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-red-500/50 transition-all">
                      <input
                        type="checkbox"
                        checked={addToTicker}
                        onChange={(e) => setAddToTicker(e.target.checked)}
                        className="w-4 h-4 accent-red-600 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>الشريط العاجل</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer hover:border-red-500/50 transition-all">
                      <input
                        type="checkbox"
                        checked={sendToastOnCreate}
                        onChange={(e) => setSendToastOnCreate(e.target.checked)}
                        className="w-4 h-4 accent-red-600 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Bell className="w-3.5 h-3.5 text-emerald-400" />
                        <span>بث Toast</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingArticle(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    حفظ ونشر الخبر
                  </button>
                </div>
              </form>
            )}

            {/* Category Filter Bar */}
            <div className="flex items-center justify-between gap-3 bg-[#0e1726] p-3.5 rounded-2xl border border-slate-800 overflow-x-auto">
              <span className="text-xs font-bold text-slate-300 shrink-0">تصفية حسب القسم:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
                {['الكل', 'محلي', 'دولي', 'تقارير', 'كتابات', 'رياضة', 'سياسة', 'اقتصاد', 'تكنولوجيا'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      categoryFilter === cat ? 'bg-red-600 text-white shadow' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Table */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <th className="p-3 font-bold">الصورة والعنوان</th>
                      <th className="p-3 font-bold">القسم</th>
                      <th className="p-3 font-bold text-center">أماكن العرض (سلايدر / عاجل)</th>
                      <th className="p-3 font-bold">تاريخ النشر</th>
                      <th className="p-3 font-bold">المشاهدات</th>
                      <th className="p-3 font-bold text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {cmsData.articles
                      .filter(art => categoryFilter === 'الكل' || art.category === categoryFilter || art.category?.includes(categoryFilter))
                      .map((art) => (
                      <tr key={art.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img src={art.imageUrl} alt="" className="w-12 h-10 rounded object-cover border border-slate-800 shrink-0" />
                          <div className="font-bold text-slate-200 line-clamp-1 max-w-md">{art.title}</div>
                        </td>
                        <td className="p-3 font-semibold text-red-400">{art.category}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {/* Toggle Slider */}
                            <button
                              type="button"
                              onClick={() => {
                                updateArticle(art.id, { isHero: !art.isHero });
                                triggerToast(
                                  art.isHero ? 'تم الإزالة من السلايدر' : 'تم الإضافة للسلايدر',
                                  art.isHero ? `تم استبعاد "${art.title.slice(0, 25)}..." من السلايدر` : `سيظهر "${art.title.slice(0, 25)}..." في السلايدر الرئيسي الآن`,
                                  'system'
                                );
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                                art.isHero
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                                  : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                              }`}
                              title={art.isHero ? 'انقر للإزالة من السلايدر' : 'انقر للعرض في السلايدر'}
                            >
                              <Sliders className="w-3 h-3" />
                              <span>{art.isHero ? 'السلايدر 🎠' : '+ سلايدر'}</span>
                            </button>

                            {/* Toggle Breaking */}
                            <button
                              type="button"
                              onClick={() => {
                                updateArticle(art.id, { isBreaking: !art.isBreaking });
                                triggerToast(
                                  art.isBreaking ? 'تم الإزالة من أهم الأخبار' : 'تم الإضافة لأهم الأخبار',
                                  art.isBreaking ? 'تم تغيير تصنيف الخبر' : 'سيظهر الخبر في قسم أهم الأخبار الآن',
                                  'breaking'
                                );
                              }}
                              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                                art.isBreaking
                                  ? 'bg-red-600/20 text-red-400 border border-red-500/40 shadow-sm'
                                  : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                              }`}
                              title={art.isBreaking ? 'انقر للإزالة من أهم الأخبار' : 'انقر للعرض في أهم الأخبار'}
                            >
                              <Flame className="w-3 h-3" />
                              <span>{art.isBreaking ? 'أهم الأخبار 🔴' : '+ أهم الأخبار'}</span>
                            </button>

                            {/* Toggle Latest */}
                            <button
                              type="button"
                              onClick={() => {
                                updateArticle(art.id, { isLatest: art.isLatest === false ? true : false });
                                triggerToast(
                                  art.isLatest !== false ? 'تم الإزالة من آخر الأخبار' : 'تم الإضافة لآخر الأخبار',
                                  art.isLatest !== false ? 'تم استبعاد الخبر من الشبكة' : 'سيظهر الخبر في قسم آخر الأخبار',
                                  'system'
                                );
                              }}
                              className={`px-2 py-1 rounded-lg text-[11px] font-extrabold flex items-center gap-1 transition-all ${
                                art.isLatest !== false
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm'
                                  : 'bg-slate-900 text-slate-500 hover:text-slate-300 border border-slate-800'
                              }`}
                              title={art.isLatest !== false ? 'انقر للإزالة من آخر الأخبار' : 'انقر للعرض في آخر الأخبار'}
                            >
                              <Sparkles className="w-3 h-3" />
                              <span>{art.isLatest !== false ? 'آخر الأخبار 📰' : '+ آخر الأخبار'}</span>
                            </button>
                          </div>
                        </td>
                        <td className="p-3 text-slate-400">{art.publishDate}</td>
                        <td className="p-3 text-slate-300 font-mono">{art.viewsCount.toLocaleString('ar-YE')}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(art)}
                              className="p-1.5 bg-blue-950/60 text-blue-400 hover:bg-blue-900 rounded-lg transition-colors border border-blue-800/40"
                              title="تعديل تفاصيل ومحتوى الخبر"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteArticle(art.id)}
                              className="p-1.5 bg-red-950/60 text-red-400 hover:bg-red-900 rounded-lg transition-colors border border-red-800/40"
                              title="حذف المقال"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO SLIDER MANAGEMENT */}
        {activeTab === 'slider' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0e1726] border border-amber-500/30 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-400" />
                  <span>مركز السيطرة والتحكم بسلايدر الأخبار الرئيسي (Hero Slider Manager)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  التحكم المباشر في الأخبار البارزة التي تظهر في الواجهة العليا للموقع مع خيارات الترتيب والإضافة والإزالة بضغطة زر.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>عدد شرائح السلايدر النشطة: {(cmsData.articles.filter(a => a.isHero) || []).length}</span>
                </span>
              </div>
            </div>

            {/* SECTION A: ACTIVE SLIDER ARTICLES */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-amber-400 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span>الأخبار المعروضة حالياً في شريحة العرض الرئيسية</span>
                </h3>
                <span className="text-[11px] text-slate-400">تظهر للزوار في السلايدر المتحرك تلقائياً</span>
              </div>

              {cmsData.articles.filter(a => a.isHero).length === 0 ? (
                <div className="text-center py-8 bg-slate-950/60 rounded-xl border border-slate-800/80 p-6 space-y-2">
                  <p className="text-xs text-slate-400 font-bold">لا يوجد أي خبر محدد للسلايدر حالياً.</p>
                  <p className="text-[11px] text-slate-500">اختر أخباراً من القائمة أدناه لإضافتها للسلايدر بضغطة زر واحدة.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cmsData.articles.filter(a => a.isHero).map((art, idx) => (
                    <div
                      key={art.id}
                      className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 flex gap-3 shadow-lg hover:border-amber-500 transition-all group"
                    >
                      <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-800 bg-slate-900">
                        <img src={art.imageUrl} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-1 right-1 bg-amber-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${art.categoryColor || 'bg-red-600'}`}>
                              {art.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{art.viewsCount.toLocaleString('ar-YE')} مشاهدة</span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                            {art.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2 gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const heroArts = cmsData.articles.filter(a => a.isHero);
                                if (idx > 0) {
                                  const prevArt = heroArts[idx - 1];
                                  const newArticles = [...cmsData.articles];
                                  const idxA = newArticles.findIndex(a => a.id === art.id);
                                  const idxB = newArticles.findIndex(a => a.id === prevArt.id);
                                  const temp = newArticles[idxA];
                                  newArticles[idxA] = newArticles[idxB];
                                  newArticles[idxB] = temp;
                                  setCmsData(prev => ({ ...prev, articles: newArticles }));
                                  triggerToast('تعديل الترتيب', 'تم رفع ترتيب الخبر بالسلايدر', 'system');
                                }
                              }}
                              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30"
                              title="رفع للأعلى ⬆️"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={idx === cmsData.articles.filter(a => a.isHero).length - 1}
                              onClick={() => {
                                const heroArts = cmsData.articles.filter(a => a.isHero);
                                if (idx < heroArts.length - 1) {
                                  const nextArt = heroArts[idx + 1];
                                  const newArticles = [...cmsData.articles];
                                  const idxA = newArticles.findIndex(a => a.id === art.id);
                                  const idxB = newArticles.findIndex(a => a.id === nextArt.id);
                                  const temp = newArticles[idxA];
                                  newArticles[idxA] = newArticles[idxB];
                                  newArticles[idxB] = temp;
                                  setCmsData(prev => ({ ...prev, articles: newArticles }));
                                  triggerToast('تعديل الترتيب', 'تم إنزال ترتيب الخبر بالسلايدر', 'system');
                                }
                              }}
                              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30"
                              title="تنزيل للأسفل ⬇️"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const otherArticles = cmsData.articles.filter(a => a.id !== art.id);
                                setCmsData(prev => ({
                                  ...prev,
                                  articles: [art, ...otherArticles]
                                }));
                                triggerToast('ترقية الترتيب', `تم جعل "${art.title.slice(0, 15)}..." الأول`, 'system');
                              }}
                              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800"
                            >
                              الأول 🔝
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              updateArticle(art.id, { isHero: false });
                              triggerToast('إزالة من السلايدر', `تم استبعاد المقال من السلايدر بنجاح`, 'system');
                            }}
                            className="text-[11px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1 bg-red-950/40 border border-red-900/50 px-2 py-1 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>إزالة</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECTION B: AVAILABLE ARTICLES TO ADD TO SLIDER */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-400" />
                  <span>أخبار ومقالات متاحة للإضافة للسلايدر</span>
                </h3>
                <span className="text-[11px] text-slate-400">انقر "+ إضافة للسلايدر" لضم أي خبر فوراً</span>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
                {cmsData.articles.filter(a => !a.isHero).map((art) => (
                  <div key={art.id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-900/50 px-2 rounded-xl transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={art.imageUrl} alt="" className="w-12 h-10 rounded object-cover border border-slate-800 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-red-400">{art.category}</span>
                          <span className="text-[10px] text-slate-500">• {art.publishDate}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 truncate max-w-lg">{art.title}</h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateArticle(art.id, { isHero: true });
                        triggerToast('تمت الإضافة للسلايدر', `تمت إضافة "${art.title.slice(0, 25)}..." إلى السلايدر الرئيسي بنجاح`, 'system');
                      }}
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ إضافة للسلايدر</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BREAKING & TOP STORIES MANAGEMENT */}
        {activeTab === 'breaking' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0e1726] border border-red-500/30 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-500" />
                  <span>لوحة التحكم لقسم "أهم الأخبار الآن" (Breaking / Top Stories)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  التحكم في الشريط الزمني والأخبار الهامة المعروضة بجانب البث المباشر في الصفحة الرئيسية.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-red-600/20 text-red-300 border border-red-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  <span>الأخبار المحددة كعاجلة: {(cmsData.articles.filter(a => a.isBreaking) || []).length}</span>
                </span>
              </div>
            </div>

            {/* ACTIVE BREAKING STORIES */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-red-400 flex items-center gap-2">
                  <Flame className="w-4 h-4 fill-current" />
                  <span>الأخبار المنشورة حالياً في قسم "أهم الأخبار الآن"</span>
                </h3>
                <span className="text-[11px] text-slate-400">تظهر للزوار فوراً بجانب نافذة البث</span>
              </div>

              {cmsData.articles.filter(a => a.isBreaking).length === 0 ? (
                <div className="text-center py-8 bg-slate-950/60 rounded-xl border border-slate-800/80 p-6 space-y-2">
                  <p className="text-xs text-slate-400 font-bold">لا يوجد أي خبر محدد كخبر عاجل حالياً.</p>
                  <p className="text-[11px] text-slate-500">قم باختيار أخبار من القائمة أدناه لإضافتها لقسم أهم الأخبار الآن.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cmsData.articles.filter(a => a.isBreaking).map((art, idx) => (
                    <div
                      key={art.id}
                      className="bg-slate-950 border border-red-500/30 rounded-xl p-4 flex gap-3 shadow-lg hover:border-red-500 transition-all group"
                    >
                      <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-800 bg-slate-900">
                        <img src={art.imageUrl} alt="" className="w-full h-full object-cover" />
                        <span className="absolute top-1 right-1 bg-red-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                          #{idx + 1}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded text-white ${art.categoryColor || 'bg-red-600'}`}>
                              {art.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{art.publishDate}</span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                            {art.title}
                          </h4>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 mt-2 gap-2">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const breakingArts = cmsData.articles.filter(a => a.isBreaking);
                                if (idx > 0) {
                                  const prevArt = breakingArts[idx - 1];
                                  const newArticles = [...cmsData.articles];
                                  const idxA = newArticles.findIndex(a => a.id === art.id);
                                  const idxB = newArticles.findIndex(a => a.id === prevArt.id);
                                  const temp = newArticles[idxA];
                                  newArticles[idxA] = newArticles[idxB];
                                  newArticles[idxB] = temp;
                                  setCmsData(prev => ({ ...prev, articles: newArticles }));
                                  triggerToast('تعديل الترتيب', 'تم رفع ترتيب الخبر العاجل', 'breaking');
                                }
                              }}
                              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-red-400 disabled:opacity-30"
                              title="رفع للأعلى ⬆️"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              disabled={idx === cmsData.articles.filter(a => a.isBreaking).length - 1}
                              onClick={() => {
                                const breakingArts = cmsData.articles.filter(a => a.isBreaking);
                                if (idx < breakingArts.length - 1) {
                                  const nextArt = breakingArts[idx + 1];
                                  const newArticles = [...cmsData.articles];
                                  const idxA = newArticles.findIndex(a => a.id === art.id);
                                  const idxB = newArticles.findIndex(a => a.id === nextArt.id);
                                  const temp = newArticles[idxA];
                                  newArticles[idxA] = newArticles[idxB];
                                  newArticles[idxB] = temp;
                                  setCmsData(prev => ({ ...prev, articles: newArticles }));
                                  triggerToast('تعديل الترتيب', 'تم إنزال ترتيب الخبر العاجل', 'breaking');
                                }
                              }}
                              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:text-red-400 disabled:opacity-30"
                              title="تنزيل للأسفل ⬇️"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const otherArticles = cmsData.articles.filter(a => a.id !== art.id);
                                setCmsData(prev => ({
                                  ...prev,
                                  articles: [art, ...otherArticles]
                                }));
                                triggerToast('ترقية الترتيب', `تم جعل "${art.title.slice(0, 15)}..." الأول في عاجل`, 'breaking');
                              }}
                              className="text-[11px] text-red-400 hover:text-red-300 font-bold px-2 py-1 rounded bg-slate-900 border border-slate-800"
                            >
                              الأول 🔝
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              updateArticle(art.id, { isBreaking: false });
                              triggerToast('إزالة من أهم الأخبار', `تم استبعاد المقال بنجاح`, 'system');
                            }}
                            className="text-[11px] text-slate-400 hover:text-red-400 font-bold flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>إزالة</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AVAILABLE TO ADD TO BREAKING */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-slate-400" />
                  <span>أخبار أخرى متاحة للإضافة لقسم "أهم الأخبار الآن"</span>
                </h3>
                <span className="text-[11px] text-slate-400">انقر "+ إضافة لأهم الأخبار"</span>
              </div>

              <div className="divide-y divide-slate-800/80 max-h-96 overflow-y-auto">
                {cmsData.articles.filter(a => !a.isBreaking).map((art) => (
                  <div key={art.id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-900/50 px-2 rounded-xl transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={art.imageUrl} alt="" className="w-12 h-10 rounded object-cover border border-slate-800 shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-red-400">{art.category}</span>
                          <span className="text-[10px] text-slate-500">• {art.publishDate}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-200 truncate max-w-lg">{art.title}</h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        updateArticle(art.id, { isBreaking: true });
                        triggerToast('تمت الإضافة', `تمت إضافة "${art.title.slice(0, 25)}..." إلى قسم أهم الأخبار الآن`, 'breaking');
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ إضافة لأهم الأخبار</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LATEST NEWS GRID MANAGEMENT */}
        {activeTab === 'latest' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-[#0e1726] border border-sky-500/30 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  <span>لوحة التحكم لقسم "آخر الأخبار" (Latest News Manager)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  تحديد الأخبار التي تظهر في الشبكة الرئيسية لآخر الأخبار المنشورة على الواجهة مع إمكانية التثبيت والإخفاء.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الأخبار المعروضة في آخر الأخبار: {(cmsData.articles.filter(a => a.isLatest !== false) || []).length}</span>
                </span>
              </div>
            </div>

            {/* ACTIVE LATEST NEWS */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-sky-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>المقالات المعروضة في شبكة آخر الأخبار</span>
                </h3>
                <span className="text-[11px] text-slate-400">تظهر في منتصف الصفحة الرئيسية</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cmsData.articles.filter(a => a.isLatest !== false).map((art) => (
                  <div
                    key={art.id}
                    className="bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl p-3.5 flex flex-col justify-between shadow-lg transition-all"
                  >
                    <div className="flex gap-3">
                      <img src={art.imageUrl} alt="" className="w-20 h-16 rounded-lg object-cover border border-slate-800 shrink-0 bg-slate-900" />
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold text-red-400 block mb-0.5">{art.category}</span>
                        <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">{art.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-3">
                      <button
                        type="button"
                        onClick={() => {
                          const otherArticles = cmsData.articles.filter(a => a.id !== art.id);
                          setCmsData(prev => ({
                            ...prev,
                            articles: [art, ...otherArticles]
                          }));
                          triggerToast('تثبيت المقال', `تم تثبيت "${art.title.slice(0, 20)}..." في بداية آخر الأخبار`, 'system');
                        }}
                        className="text-[11px] text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                        <span>تثبيت بالأعلى 📌</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          updateArticle(art.id, { isLatest: false });
                          triggerToast('إخفاء المقال', 'تم استبعاد المقال من شبكة آخر الأخبار', 'system');
                        }}
                        className="text-[11px] text-slate-500 hover:text-red-400 font-bold px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 transition-all"
                      >
                        إخفاء من آخر الأخبار
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* HIDDEN / EXCLUDED FROM LATEST NEWS */}
            {cmsData.articles.filter(a => a.isLatest === false).length > 0 && (
              <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-extrabold text-sm text-slate-400 flex items-center gap-2">
                    <span>أخبار مستبعدة من قسم "آخر الأخبار"</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">يمكنك إعادة إظهارها بأي وقت</span>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {cmsData.articles.filter(a => a.isLatest === false).map((art) => (
                    <div key={art.id} className="py-2.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={art.imageUrl} alt="" className="w-10 h-8 rounded object-cover border border-slate-800 shrink-0" />
                        <h4 className="text-xs font-bold text-slate-400 truncate max-w-md">{art.title}</h4>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          updateArticle(art.id, { isLatest: true });
                          triggerToast('إعادة إظهار', 'تمت إعادة المقال إلى شبكة آخر الأخبار', 'system');
                        }}
                        className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-3 py-1 rounded-lg transition-all shrink-0"
                      >
                        + إظهار في آخر الأخبار
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: SITE LAYOUT & APPEARANCE CONTROL TOOL */}
        {activeTab === 'layout' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-gradient-to-r from-[#0e1726] via-[#121d33] to-[#0e1726] border border-amber-500/40 rounded-2xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-amber-400" />
                  <span>أداة التحكم والتنسيق الشاملة للواجهة الرئيسية والأقسام</span>
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  تحكم حقيقي كامل بمظهر الأقسام، سرعة السلايدر، العناوين، درجة استدارة الحواف، وإظهار أو إخفاء أي عنصر على المباشر.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCmsData(prev => ({
                    ...prev,
                    siteSettings: siteLayout
                  }));
                  triggerToast('تم حفظ التنسيقات العامة', 'تم تطبيق إعدادات الواجهة وعناوين الأقسام بنجاح!', 'system');
                }}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs px-6 py-3 rounded-xl shadow-xl transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ كافة التنسيقات الآن</span>
              </button>
            </div>

            {/* SECTION 1: SLIDER AUTO-PLAY & INTERVAL */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Clock className="w-4 h-4" />
                <span>إعدادات حركة وسرعة السلايدر الإخباري الرئيسي</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">التمرير التلقائي للسلايدر</label>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">حركة تلقائية بين الشرائح</span>
                    <button
                      type="button"
                      onClick={() => setSiteLayout(prev => ({ ...prev, sliderAutoPlay: !prev.sliderAutoPlay }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        siteLayout.sliderAutoPlay ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        siteLayout.sliderAutoPlay ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">مدّة عرض الخبر (بالثواني)</label>
                  <select
                    value={siteLayout.sliderInterval || 5}
                    onChange={(e) => setSiteLayout(prev => ({ ...prev, sliderInterval: Number(e.target.value) }))}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700 focus:outline-none focus:border-amber-400"
                  >
                    <option value={3}>3 ثواني (سريع جداً)</option>
                    <option value={5}>5 ثواني (معياري - مستحسن)</option>
                    <option value={7}>7 ثواني (مريح للقراءة)</option>
                    <option value={10}>10 ثواني (بطيء)</option>
                  </select>
                </div>

                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">التوقف عند وضع الماوس فوق الخبر</label>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">تجميد التمرير أثناء التصفح</span>
                    <button
                      type="button"
                      onClick={() => setSiteLayout(prev => ({ ...prev, sliderPauseOnHover: !prev.sliderPauseOnHover }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        siteLayout.sliderPauseOnHover ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        siteLayout.sliderPauseOnHover ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1.5: NEWS SORTING MODE CONTROL */}
            <div className="bg-[#0e1726] border border-amber-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>خيار ترتيب جلب الأخبار تلقائياً من Firestore (News Sorting Mode)</span>
              </h3>
              <p className="text-xs text-slate-400">
                اختر معيار ترتيب الأخبار لعرضها تلقائياً في السلايدر الرئيسي، عمود أهم الأخبار، وشبكة آخر الأخبار:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'date', label: '🕒 حسب تاريخ النشر (الأحدث أولاً)', desc: 'عرض الأخبار المنشورة مؤخراً في مقدمة الموقع تلقائياً' },
                  { id: 'priority', label: '⭐ حسب الأهمية والترتيب اليدوي', desc: 'ترتيب الأخبار تنازلياً حسب رقم الأهمية المحدد من المحرر' },
                  { id: 'views', label: '🔥 حسب الأكثر قراءة ومشاهدة', desc: 'إبراز الأخبار التي تحظى بأعلى نسب قراءة وتفاعل' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSiteLayout(prev => ({ ...prev, newsSortBy: m.id as any }))}
                    className={`p-4 border rounded-2xl text-right transition-all flex flex-col justify-between gap-2 ${
                      (siteLayout.newsSortBy || 'date') === m.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-xl ring-2 ring-amber-500/30'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-black block">{m.label}</span>
                    <span className="text-[11px] text-slate-400 leading-relaxed block">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 2: BORDER RADIUS, SPACING, PADDING & TYPOGRAPHY */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
              <h3 className="text-sm font-extrabold text-sky-400 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Palette className="w-4 h-4" />
                <span>ضبط التنسيق، الهوامش، أحجام الخطوط، وألوان الواجهة (Design & Typography)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Border Radius */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 block">استدارة الحواف والبطاقات (Border Radius)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'rounded-none', label: 'حادة (0px)' },
                      { id: 'rounded-lg', label: 'ناعمة (8px)' },
                      { id: 'rounded-xl', label: 'متناسقة (12px)' },
                      { id: 'rounded-2xl', label: 'عصرية (16px)' },
                      { id: 'rounded-3xl', label: 'كبسولية (24px)' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSiteLayout(prev => ({ ...prev, borderRadius: r.id as any }))}
                        className={`p-2 border text-[11px] font-bold transition-all text-center ${r.id} ${
                          siteLayout.borderRadius === r.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section Spacing / Vertical Margins */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 block">الهوامش والمسافات الرأسية بين الأقسام (Spacing)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'py-3', label: 'مدمج (12px)' },
                      { id: 'py-6', label: 'قياسي (24px)' },
                      { id: 'py-10', label: 'متباعد (40px)' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSiteLayout(prev => ({ ...prev, sectionSpacing: s.id as any }))}
                        className={`p-2 border rounded-xl text-[11px] font-bold transition-all text-center ${
                          (siteLayout.sectionSpacing || 'py-6') === s.id
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Heading Font Size */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 block">حجم خط عناوين الأقسام الرئيسية (Title Size)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'text-lg', label: 'صغير (18px)' },
                      { id: 'text-xl', label: 'قياسي (20px)' },
                      { id: 'text-2xl', label: 'كبير (24px)' },
                      { id: 'text-3xl', label: 'بارز جداً (30px)' },
                    ].map((ts) => (
                      <button
                        key={ts.id}
                        type="button"
                        onClick={() => setSiteLayout(prev => ({ ...prev, sectionTitleSize: ts.id as any }))}
                        className={`p-2 border rounded-xl text-[11px] font-bold transition-all text-center ${
                          (siteLayout.sectionTitleSize || 'text-xl') === ts.id
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {ts.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Container Internal Padding */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 block">حشوة الصناديق والبطاقات الداخلية (Padding)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'p-3', label: 'ضيق' },
                      { id: 'p-4', label: 'قياسي' },
                      { id: 'p-6', label: 'واسع' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSiteLayout(prev => ({ ...prev, containerPadding: p.id as any }))}
                        className={`p-2 border rounded-xl text-[11px] font-bold transition-all text-center ${
                          (siteLayout.containerPadding || 'p-4') === p.id
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Section Header Color Picker / Presets */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 block">لون عناوين وشعارات الأقسام (Header Color)</label>
                  <div className="flex items-center gap-2">
                    {[
                      { color: '#ef4444', label: 'أحمر' },
                      { color: '#f59e0b', label: 'ذهبي' },
                      { color: '#3b82f6', label: 'أزرق' },
                      { color: '#10b981', label: 'زمردي' },
                      { color: '#8b5cf6', label: 'بنفسجي' },
                      { color: '#f8fafc', label: 'أبيض' },
                    ].map((hc) => (
                      <button
                        key={hc.color}
                        type="button"
                        onClick={() => setSiteLayout(prev => ({ ...prev, sectionHeaderColor: hc.color }))}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          (siteLayout.sectionHeaderColor || '#ef4444') === hc.color ? 'scale-125 border-amber-400 shadow-lg' : 'border-slate-700 hover:scale-110'
                        }`}
                        style={{ backgroundColor: hc.color }}
                        title={hc.label}
                      />
                    ))}
                    <input
                      type="color"
                      value={siteLayout.sectionHeaderColor || '#ef4444'}
                      onChange={(e) => setSiteLayout(prev => ({ ...prev, sectionHeaderColor: e.target.value }))}
                      className="w-8 h-8 rounded-lg cursor-pointer bg-slate-900 border border-slate-700"
                    />
                  </div>
                </div>

                {/* Card Shadow Levels */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-200 block">درجة الظلال والعمق (Card Shadows)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'shadow-none', label: 'مسطح (بدون ظل)' },
                      { id: 'shadow-md', label: 'خفيف (Medium)' },
                      { id: 'shadow-xl', label: 'بارز (Extra Large)' },
                      { id: 'shadow-2xl', label: 'سينمائي عميق' },
                    ].map((sh) => (
                      <button
                        key={sh.id}
                        type="button"
                        onClick={() => setSiteLayout(prev => ({ ...prev, cardShadow: sh.id as any }))}
                        className={`p-2 border rounded-xl text-[11px] font-bold transition-all text-center ${
                          (siteLayout.cardShadow || 'shadow-xl') === sh.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {sh.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: SECTION TITLES CONTROL */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-emerald-400 flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4" />
                <span>تعديل نصوص وعناوين أقسام الواجهة الرئيسية</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 block">عنوان السلايدر الإخباري</label>
                  <input
                    type="text"
                    value={siteLayout.heroSectionTitle || ''}
                    onChange={(e) => setSiteLayout(prev => ({ ...prev, heroSectionTitle: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>

                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 block">عنوان عمود أهم الأخبار الآن</label>
                  <input
                    type="text"
                    value={siteLayout.breakingSectionTitle || ''}
                    onChange={(e) => setSiteLayout(prev => ({ ...prev, breakingSectionTitle: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>

                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 block">عنوان شبكة آخر الأخبار</label>
                  <input
                    type="text"
                    value={siteLayout.latestSectionTitle || ''}
                    onChange={(e) => setSiteLayout(prev => ({ ...prev, latestSectionTitle: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>

                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 block">عنوان الفيديوهات والتقارير</label>
                  <input
                    type="text"
                    value={siteLayout.videosSectionTitle || ''}
                    onChange={(e) => setSiteLayout(prev => ({ ...prev, videosSectionTitle: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>

                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 block">عنوان جدول وتغطية المباريات</label>
                  <input
                    type="text"
                    value={siteLayout.matchesSectionTitle || ''}
                    onChange={(e) => setSiteLayout(prev => ({ ...prev, matchesSectionTitle: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>

                <div className="space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 block">عنوان أقسام وتصنيفات القناة</label>
                  <input
                    type="text"
                    value={siteLayout.categoriesSectionTitle || ''}
                    onChange={(e) => setSiteLayout(prev => ({ ...prev, categoriesSectionTitle: e.target.value }))}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-lg p-2 border border-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: SHOW/HIDE ALL SECTIONS */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h3 className="text-sm font-extrabold text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-3">
                <Eye className="w-4 h-4" />
                <span>إظهار أو إخفاء أي قسم في الواجهة الرئيسية بالكامل</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { key: 'showHeroSlider', label: 'السلايدر الإخباري الرئيسي' },
                  { key: 'showBreakingTicker', label: 'الشريط العاجل المتحرك' },
                  { key: 'showBreakingTimeline', label: 'عمود أهم الأخبار الآن' },
                  { key: 'showLatestGrid', label: 'شبكة آخر الأخبار' },
                  { key: 'showMatchesBar', label: 'شريط وجدول المباريات' },
                  { key: 'showCategorySections', label: 'أقسام القناة الأخبارية' },
                  { key: 'showVideosSection', label: 'قسم الفيديو والبرامج' },
                ].map((item) => {
                  const val = (siteLayout as any)[item.key] !== false;
                  return (
                    <div key={item.key} className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{item.label}</span>
                      <button
                        type="button"
                        onClick={() => setSiteLayout(prev => ({ ...prev, [item.key]: !val }))}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          val ? 'bg-emerald-600' : 'bg-slate-700'
                        }`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          val ? 'translate-x-4' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setCmsData(prev => ({
                    ...prev,
                    siteSettings: siteLayout
                  }));
                  saveSiteSettingsToFirestore(siteLayout);
                  triggerToast('تم حفظ كافة التنسيقات في Firebase', 'تم تحديث ألوان وخطوط وهوامش الواجهة وتطبيقها لحظياً عبر Firestore.', 'system');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-xl transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التنسيقات وتحديث Firebase لحظياً</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: MATCHES SCHEDULE MANAGEMENT */}
        {activeTab === 'matches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-200">إدارة جدول نتائج ومواعيد المباريات</h2>
                <p className="text-xs text-slate-400 mt-0.5">تحكم كامل بالنتائج الحية، مواعيد الانطلاق، القنوات الناقلة وأسماء الملاعب</p>
              </div>
              <button
                onClick={() => setIsAddingMatch(!isAddingMatch)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-2 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة مباراة جديدة</span>
              </button>
            </div>

            {/* Add New Match Form */}
            {isAddingMatch && (
              <form onSubmit={handleCreateMatchSubmit} className="bg-[#0e1726] border border-emerald-500/40 p-6 rounded-2xl space-y-4 shadow-2xl">
                <h3 className="font-extrabold text-sm text-emerald-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span>تفاصيل المباراة الجديدة</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Home Team */}
                  <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <label className="text-xs font-extrabold text-emerald-400 block">الفريق المضيف (صاحب الأرض)</label>
                    <input
                      type="text"
                      placeholder="اسم الفريق (مثال: اليمن، أهلي صنعاء)..."
                      value={mHomeTeam}
                      onChange={(e) => setMHomeTeam(e.target.value)}
                      required
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-emerald-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="رابط اللوجو (اختياري)..."
                        value={mHomeLogo}
                        onChange={(e) => setMHomeLogo(e.target.value)}
                        className="bg-slate-900 text-slate-100 text-xs rounded-xl p-2 border border-slate-800"
                      />
                      <input
                        type="number"
                        placeholder="الأهداف"
                        value={mHomeScore}
                        onChange={(e) => setMHomeScore(parseInt(e.target.value) || 0)}
                        className="bg-slate-900 text-slate-100 text-xs rounded-xl p-2 border border-slate-800 font-mono"
                      />
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="space-y-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <label className="text-xs font-extrabold text-teal-400 block">الفريق الضيف (الزائر)</label>
                    <input
                      type="text"
                      placeholder="اسم الفريق (مثال: فيتنام، وحدة صنعاء)..."
                      value={mAwayTeam}
                      onChange={(e) => setMAwayTeam(e.target.value)}
                      required
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-700 focus:outline-none focus:border-teal-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="رابط اللوجو (اختياري)..."
                        value={mAwayLogo}
                        onChange={(e) => setMAwayLogo(e.target.value)}
                        className="bg-slate-900 text-slate-100 text-xs rounded-xl p-2 border border-slate-800"
                      />
                      <input
                        type="number"
                        placeholder="الأهداف"
                        value={mAwayScore}
                        onChange={(e) => setMAwayScore(parseInt(e.target.value) || 0)}
                        className="bg-slate-900 text-slate-100 text-xs rounded-xl p-2 border border-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">اسم البطولة / المسابقة</label>
                    <select
                      value={mTournament}
                      onChange={(e) => setMTournament(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-800"
                    >
                      <option value="الدوري اليمني الممتاز">الدوري اليمني الممتاز 🇾🇪</option>
                      <option value="تصفيات كأس آسيا 2027">تصفيات كأس آسيا 2027 🏆</option>
                      <option value="دوري أبطال أوروبا">دوري أبطال أوروبا ⭐</option>
                      <option value="الدوري الإسباني">الدوري الإسباني</option>
                      <option value="الدوري الإنجليزي">الدوري الإنجليزي</option>
                      <option value="كأس الخليج">كأس الخليج</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">حالة المباراة</label>
                    <select
                      value={mStatus}
                      onChange={(e) => setMStatus(e.target.value as any)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-800 font-bold"
                    >
                      <option value="upcoming">قادمة (لم تبدأ)</option>
                      <option value="live">جارية الآن 🔴 (بث مباشر)</option>
                      <option value="finished">انتهت (نتيجة نهائية)</option>
                    </select>
                  </div>

                  {mStatus === 'live' ? (
                    <div>
                      <label className="text-xs font-bold text-red-400 block mb-1">الدقيقة الحالية</label>
                      <input
                        type="text"
                        placeholder="مثال: 68' أو الشوط الثاني"
                        value={mMinute}
                        onChange={(e) => setMMinute(e.target.value)}
                        className="w-full bg-slate-900 text-red-400 font-black text-xs rounded-xl p-2.5 border border-red-500/50"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">التاريخ والوقت</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="مثال: اليوم"
                          value={mDate}
                          onChange={(e) => setMDate(e.target.value)}
                          className="bg-slate-900 text-slate-100 text-xs rounded-xl p-2 border border-slate-800"
                        />
                        <input
                          type="text"
                          placeholder="مثال: 21:00"
                          value={mTime}
                          onChange={(e) => setMTime(e.target.value)}
                          className="bg-slate-900 text-slate-100 text-xs rounded-xl p-2 border border-slate-800 font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">القناة الناقلة</label>
                    <input
                      type="text"
                      placeholder="مثال: يمن 4 HD / beIN Sports 1"
                      value={mChannel}
                      onChange={(e) => setMChannel(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">الملعب / مكان المباراة</label>
                    <input
                      type="text"
                      placeholder="مثال: ملعب المريسي - صنعاء"
                      value={mStadium}
                      onChange={(e) => setMStadium(e.target.value)}
                      className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl p-2.5 border border-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddingMatch(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow"
                  >
                    حفظ وإضافة المباراة
                  </button>
                </div>
              </form>
            )}

            {/* Matches List Table */}
            <div className="bg-[#0e1726] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right">
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                      <th className="p-3 font-bold">طرفا المباراة</th>
                      <th className="p-3 font-bold text-center">النتيجة الحالية</th>
                      <th className="p-3 font-bold">الحالة</th>
                      <th className="p-3 font-bold">البطولة والموعد</th>
                      <th className="p-3 font-bold">الملعب والقناة</th>
                      <th className="p-3 font-bold text-center">الإجراءات والتحكم</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {(cmsData.matches || []).map((match) => (
                      <tr key={match.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2 font-black text-slate-100">
                            <span>{match.homeTeam}</span>
                            <span className="text-slate-500 font-normal">ضد</span>
                            <span>{match.awayTeam}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center">
                          <div className="inline-flex items-center gap-2 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 font-mono font-black text-sm">
                            <button
                              onClick={() => updateMatch(match.id, { homeScore: Math.max(0, (match.homeScore || 0) - 1) })}
                              className="text-slate-500 hover:text-white px-1"
                              title="إنقاص"
                            >
                              -
                            </button>
                            <span className="text-emerald-400">{match.homeScore ?? 0}</span>
                            <span className="text-slate-600">:</span>
                            <span className="text-emerald-400">{match.awayScore ?? 0}</span>
                            <button
                              onClick={() => updateMatch(match.id, { homeScore: (match.homeScore || 0) + 1 })}
                              className="text-slate-500 hover:text-white px-1"
                              title="زيادة هدف"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-3">
                          <select
                            value={match.status}
                            onChange={(e) => updateMatch(match.id, { status: e.target.value as any })}
                            className={`px-2.5 py-1 rounded-lg font-black text-[11px] border bg-slate-900 ${
                              match.status === 'live' ? 'text-red-400 border-red-500/50' : match.status === 'upcoming' ? 'text-amber-400 border-amber-500/30' : 'text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="upcoming">قادمة</option>
                            <option value="live">جارية الآن 🔴</option>
                            <option value="finished">انتهت FT</option>
                          </select>
                        </td>
                        <td className="p-3 text-slate-300">
                          <div className="font-bold text-emerald-400">{match.tournament}</div>
                          <div className="text-[10px] text-slate-400">{match.date} • {match.time}</div>
                        </td>
                        <td className="p-3 text-slate-300">
                          <div className="font-semibold truncate max-w-[150px]">{match.stadium}</div>
                          <div className="text-[10px] text-teal-400">{match.channel}</div>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => deleteMatch(match.id)}
                            className="p-1.5 bg-red-950/60 text-red-400 hover:bg-red-900 rounded-lg transition-colors"
                            title="حذف المباراة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TICKER MANAGEMENT */}
        {activeTab === 'ticker' && (
          <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <h2 className="text-base font-extrabold text-slate-200 border-b border-slate-800 pb-3">
              إدارة شريط الأخبار العاجلة
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="أضف خبر عاجل جديد إلى الشريط المتحرك..."
                value={newTickerInput}
                onChange={(e) => setNewTickerInput(e.target.value)}
                className="flex-1 bg-slate-900 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
              />
              <button
                onClick={handleAddTickerItem}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition-all shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة للشريط</span>
              </button>
            </div>

            <div className="space-y-3">
              {tickerItems.map((item, idx) => (
                <div key={idx} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-red-600 text-white font-black text-[11px] flex items-center justify-center shrink-0 shadow">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 font-semibold truncate">{item}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const updated = [...tickerItems];
                        const temp = updated[idx];
                        updated[idx] = updated[idx - 1];
                        updated[idx - 1] = temp;
                        setTickerItems(updated);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 transition-all"
                      title="رفع للأعلى ⬆️"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={idx === tickerItems.length - 1}
                      onClick={() => {
                        const updated = [...tickerItems];
                        const temp = updated[idx];
                        updated[idx] = updated[idx + 1];
                        updated[idx + 1] = temp;
                        setTickerItems(updated);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-amber-400 disabled:opacity-30 transition-all"
                      title="تنزيل للأسفل ⬇️"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveTickerItem(idx)}
                      className="text-red-400 hover:text-red-300 p-1.5 rounded-lg bg-slate-800 hover:bg-red-950/50 transition-all"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSaveTicker}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حفظ شريط الأخبار</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: LIVE STREAM & PLAYER COVER SETTINGS */}
        {activeTab === 'live' && (
          <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-200 flex items-center gap-2">
                  <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                  <span>إعدادات البث المباشر وصورة غلاف المشغل (Yemen 4 Player)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">التحكم الكامل برابط البث وصورة البوستر المعروضة للمشاهدين قبل الضغط على التشغيل</p>
              </div>
              <span className="bg-red-950/80 text-red-400 text-[11px] px-3 py-1 rounded-full font-bold border border-red-800/50">
                مزامنة فورية مع Firestore
              </span>
            </div>

            {/* 1. Live Stream URL */}
            <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>رابط البث المباشر للقناة (يدعم M3U8، HLS، YouTube وروابط البث المباشر)</span>
              </label>
              <input
                type="text"
                placeholder="أدخل رابط البث المباشر..."
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500 font-mono"
              />
              <p className="text-[11px] text-slate-400">
                * عند حفظ الرابط، يتم تحديث المشغل لدى جميع المشاهدين في الوقت الفعلي.
              </p>
            </div>

            {/* 2. Live Player Poster / Cover Image */}
            <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-red-400" />
                  <span>صورة غلاف المشغل (تظهر قبل الضغط على التشغيل ومتجاوبة مع كافة الشاشات)</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDriveTarget('livePoster');
                      setIsDriveModalOpen(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>Google Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLivePosterUrl(DEFAULT_LIVE_POSTER_URL)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                    title="استعادة الصورة الأصلية لقناة يمن 4 HD"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                    <span>الصورة الافتراضية</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLivePosterUrl('')}
                    className="bg-red-950/80 hover:bg-red-900 text-red-400 font-bold text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 border border-red-800/50"
                    title="حذف الصورة تماماً"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>حذف الصورة</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="رابط صورة الغلاف (URL)..."
                  value={livePosterUrl}
                  onChange={(e) => setLivePosterUrl(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500 font-mono"
                />
                <p className="text-[11px] text-slate-400">
                  تظهر هذه الصورة متجاوبة بوضوح على الهواتف والأجهزة اللوحية والحواسيب داخل مشغل البث المباشر.
                </p>
              </div>

              {/* Responsive Live Preview Box */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-extrabold text-slate-300 block">
                  معاينة مظهر الغلاف داخل المشغل قبل الحفظ:
                </span>
                <div className="relative aspect-video max-w-2xl mx-auto rounded-xl overflow-hidden bg-black border border-slate-700 shadow-xl group">
                  {livePosterUrl ? (
                    <img
                      src={livePosterUrl}
                      alt="معاينة الغلاف"
                      className="w-full h-full object-contain bg-slate-950"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
                      <Radio className="w-12 h-12 text-slate-600 mb-2" />
                      <p className="text-xs text-slate-500 font-bold">لا توجد صورة غلاف محددة (سيتم إظهار خلفية الشعار الافتراضية)</p>
                    </div>
                  )}

                  {/* Play Overlay Mock */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center pointer-events-none p-3 text-center">
                    <div className="bg-red-600 text-white font-black text-xs px-5 py-2 rounded-xl shadow-xl flex items-center gap-2 border border-red-400/40">
                      <Play className="w-4 h-4 fill-current" />
                      <span>اضغط هنا لتشغيل البث المباشر</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                onClick={handleSaveLiveSettings}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-8 py-3.5 rounded-xl shadow-xl flex items-center gap-2 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>حفظ وتطبيق إعدادات البث والغلاف</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: CURRENCIES & WEATHER */}
        {activeTab === 'currencies' && (
          <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <h2 className="text-base font-extrabold text-slate-200 border-b border-slate-800 pb-3">
              تعديل أسعار العملات في السوق اليمني
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cmsData.currencies.map((curr, idx) => (
                <div key={curr.code} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="font-extrabold text-xs text-amber-400 flex items-center gap-2">
                    <span>{curr.flag}</span>
                    <span>{curr.currency} ({curr.code})</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400">سعر الشراء</span>
                      <input
                        type="number"
                        value={curr.buyRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          const updated = [...cmsData.currencies];
                          updated[idx].buyRate = val;
                          setCmsData({ ...cmsData, currencies: updated });
                        }}
                        className="w-full bg-slate-950 text-slate-100 text-xs p-2 rounded border border-slate-800 mt-1 font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400">سعر البيع</span>
                      <input
                        type="number"
                        value={curr.sellRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          const updated = [...cmsData.currencies];
                          updated[idx].sellRate = val;
                          setCmsData({ ...cmsData, currencies: updated });
                        }}
                        className="w-full bg-slate-950 text-slate-100 text-xs p-2 rounded border border-slate-800 mt-1 font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => triggerToast('تم حفظ أسعار العملات', 'تم تحديث الجدول المالي بنجاح.', 'system')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>حفظ أسعار العملات</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 6: NOTIFICATIONS BROADCAST MANAGEMENT */}
        {activeTab === 'notifications' && (
          <div className="bg-[#0e1726] border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  <span>إدارة وبث الإشعارات العاجلة (Toast Broadcaster)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  أرسل تنبيهات Toast فورية تظهر لجميع زوار موقع قناة يمن 4 HD في الأسفل
                </p>
              </div>

              <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>نظام البث المباشر</span>
              </span>
            </div>

            {/* Quick Broadcast Presets */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">قوالب وتنبيهات سريعة جاهزة للبث:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setNotifTitleInput('خبر عاجل: بيان عسكري للقوات المسلحة');
                    setNotifMsgInput('بيان عسكري مهم للقوات المسلحة بشأن العمليات الأخيرة في البحر الأحمر بعد قليل على قناة يمن 4 HD');
                    setNotifTypeInput('breaking');
                  }}
                  className="p-3 bg-slate-900 border border-slate-800 hover:border-red-500 text-right rounded-xl transition-all"
                >
                  <span className="text-xs font-black text-red-400 block">🔴 خبر عاجل عسكري</span>
                  <span className="text-[11px] text-slate-300 line-clamp-1">بيان عسكري مهم للقوات المسلحة...</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNotifTitleInput('بث حي مباشر الآن');
                    setNotifMsgInput('بدء البث المباشر للمؤتمر الصحفي واجتماع مجلس الوزراء عبر الشاشة الرسمية');
                    setNotifTypeInput('live');
                  }}
                  className="p-3 bg-slate-900 border border-slate-800 hover:border-emerald-500 text-right rounded-xl transition-all"
                >
                  <span className="text-xs font-black text-emerald-400 block">📺 بث مباشر حي</span>
                  <span className="text-[11px] text-slate-300 line-clamp-1">بدء البث المباشر للمؤتمر الصحفي...</span>
                </button>
              </div>
            </div>

            {/* Custom Notification Broadcast Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!notifTitleInput.trim() || !notifMsgInput.trim()) return;
                triggerToast(notifTitleInput, notifMsgInput, notifTypeInput);
                setNotifTitleInput('');
                setNotifMsgInput('');
              }}
              className="space-y-4 pt-4 border-t border-slate-800"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">عنوان التنبيه العاجل</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: خبر عاجل من العاصمة صنعاء"
                    value={notifTitleInput}
                    onChange={(e) => setNotifTitleInput(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">نوع التنبيه</label>
                  <select
                    value={notifTypeInput}
                    onChange={(e) => setNotifTypeInput(e.target.value as any)}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                  >
                    <option value="breaking">خبر عاجل (أحمر 🔴 مع صوت نغمة)</option>
                    <option value="live">بث حي مباشر (أخضر 📺)</option>
                    <option value="system">إشعار عام / نظام (أزرق ⚙️)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">نص الخبر العاجل أو تفاصيل التنبيه</label>
                <textarea
                  rows={3}
                  required
                  placeholder="أدخل تفاصيل النص العاجل الذي سيظهر للجمهور في نافذة Toast..."
                  value={notifMsgInput}
                  onChange={(e) => setNotifMsgInput(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-red-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  سيصل هذا الإشعار للزوار المفعّلين للتنبيهات فوراً مع صوت النغمة
                </span>

                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-xl transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>إطلاق وبث الإشعار الذكي للجمهور الآن</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal: Edit Existing Article with Rich Editor */}
        {editingArticle && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#0e1726] border border-slate-700 my-8 max-w-4xl w-full p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-amber-400 flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-amber-500" />
                    <span>تعديل تفاصيل ومحتوى الخبر ({editingArticle.id})</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">تعديل كافة بيانات ونصوص الخبر واستخدام المحرر الصحفي المتقدم</p>
                </div>
                <button
                  onClick={() => setEditingArticle(null)}
                  className="p-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl border border-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditArticleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">عنوان الخبر الرئيسي</label>
                    <input
                      type="text"
                      required
                      value={editArtTitle}
                      onChange={(e) => setEditArtTitle(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">القسم / التصنيف</label>
                    <select
                      value={editArtCategory}
                      onChange={(e) => setEditArtCategory(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500 font-bold"
                    >
                      <option value="محلي">محلي (أخبار اليمن والمحافظات)</option>
                      <option value="دولي">دولي (أخبار العالم والإقليم)</option>
                      <option value="تقارير">تقارير وتحقيقات</option>
                      <option value="كتابات">كتابات وآراء</option>
                      <option value="رياضة">رياضة محلي ودولي</option>
                      <option value="سياسة">سياسة</option>
                      <option value="اقتصاد">اقتصاد</option>
                      <option value="تكنولوجيا">تكنولوجيا</option>
                      <option value="المحافظات">المحافظات</option>
                      <option value="خبر اليوم">خبر اليوم</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">اسم الكاتب / المحرر</label>
                    <input
                      type="text"
                      value={editArtAuthorName}
                      onChange={(e) => setEditArtAuthorName(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">الصفة المهنية</label>
                    <input
                      type="text"
                      value={editArtAuthorRole}
                      onChange={(e) => setEditArtAuthorRole(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">الملخص الموجز</label>
                  <input
                    type="text"
                    value={editArtExcerpt}
                    onChange={(e) => setEditArtExcerpt(e.target.value)}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-300">رابط صورة الخبر الرئيسية</label>
                      <button
                        type="button"
                        onClick={() => {
                          setDriveTarget('article');
                          setIsDriveModalOpen(true);
                        }}
                        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/30"
                      >
                        <HardDrive className="w-3 h-3" />
                        <span>Google Drive</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={editArtImage}
                      onChange={(e) => setEditArtImage(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-amber-300 block mb-1">الترتيب / Priority</label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={editArtPriority}
                      onChange={(e) => setEditArtPriority(Number(e.target.value))}
                      className="w-full bg-slate-950 text-amber-300 font-bold text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Rich Content Editor for Editing Article */}
                <RichContentEditor
                  editorId="edit-article-content-area"
                  content={editArtContent}
                  setContent={setEditArtContent}
                  excerpt={editArtExcerpt}
                  setExcerpt={setEditArtExcerpt}
                  title={editArtTitle}
                  setTitle={setEditArtTitle}
                  category={editArtCategory}
                  authorName={editArtAuthorName}
                  authorRole={editArtAuthorRole}
                  imageUrl={editArtImage}
                  onOpenDriveModal={() => {
                    setDriveTarget('article');
                    setIsDriveModalOpen(true);
                  }}
                />

                {/* Toggles */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <span className="text-xs font-extrabold text-amber-400 block border-b border-slate-800 pb-2">
                    أماكن العرض والنشر للخبر التفاعلي:
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editAddToSlider}
                        onChange={(e) => setEditAddToSlider(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>السلايدر الرئيسي</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editAddToBreaking}
                        onChange={(e) => setEditAddToBreaking(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        <span>أهم الأخبار الآن</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editAddToLatest}
                        onChange={(e) => setEditAddToLatest(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        <span>قسم آخر الأخبار</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editAddToTicker}
                        onChange={(e) => setEditAddToTicker(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded"
                      />
                      <div className="text-[11px] font-bold text-slate-200 flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>الشريط العاجل</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="px-5 py-2.5 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    إلغاء التعديل
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ التعديلات والتحديث</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Google Drive Integration Modal */}
        <GoogleDriveModal
          isOpen={isDriveModalOpen}
          onClose={() => setIsDriveModalOpen(false)}
          onSelectImage={(url) => {
            if (driveTarget === 'livePoster') {
              setLivePosterUrl(url);
            } else if (editingArticle) {
              setEditArtImage(url);
            } else {
              setArtImage(url);
            }
          }}
        />
      </div>
    </div>
  );
};
