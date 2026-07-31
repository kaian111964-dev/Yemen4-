import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoItem } from '../types';
import { Play, Eye, Clock, Share2, ThumbsUp, Bookmark, Filter, Search, ArrowRight, Video, Sparkles, Check, MessageSquare, CornerDownLeft, Volume2 } from 'lucide-react';

export const VideosPage: React.FC = () => {
  const { cmsData, setCurrentView, triggerToast, isDarkMode, user } = useApp();
  
  const videoList = cmsData.videos || [];
  const [activeVideo, setActiveVideo] = useState<VideoItem>(videoList[0] || {
    id: 'v1',
    title: 'عملية نوعية للقوات المسلحة وتغطية حصرية من البحر الأحمر',
    duration: '03:45',
    views: '124,200',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCyemen4tv_official',
    category: 'أخبار عاجلة',
    publishDate: 'منذ ساعتين',
    description: 'تغطية ميدانية خاصة ومباشرة لتطورات الأحداث العسكرية وتداعياتها الإقليمية عبر شاشة يمن 4 HD.',
    likesCount: 4520
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likesCountMap, setLikesCountMap] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    videoList.forEach(v => {
      initial[v.id] = v.likesCount || 1200;
    });
    return initial;
  });

  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);

  // Video comments
  const [videoComments, setVideoComments] = useState<Record<string, Array<{ id: string; name: string; avatar: string; text: string; time: string }>>>({
    'v1': [
      { id: 'vc1', name: 'علي الريمي', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', text: 'تغطية استثنائية ممتازة وتوضيح دقيق لمجريات الأحداث شكراً يمن 4.', time: 'منذ 15 دقيقة' },
      { id: 'vc2', name: 'د. فاطمة الصنعاني', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', text: 'تصوير بدقة عالية وتقارير مهنية دائماً في قلب الحدث.', time: 'منذ ساعة' }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');

  const categories = ['الكل', 'أخبار عاجلة', 'سياسة', 'اقتصاد', 'رياضة', 'برامج حوارية', 'وثائقيات'];

  const filteredVideos = videoList.filter(vid => {
    const matchesCategory = selectedCategory === 'الكل' || vid.category === selectedCategory || vid.category?.includes(selectedCategory);
    const matchesSearch = searchQuery === '' || 
      vid.title.includes(searchQuery) || 
      (vid.description && vid.description.includes(searchQuery));

    return matchesCategory && matchesSearch;
  });

  const handleLikeVideo = (vidId: string) => {
    const isCurrentlyLiked = !!likedMap[vidId];
    setLikedMap(prev => ({ ...prev, [vidId]: !isCurrentlyLiked }));
    setLikesCountMap(prev => ({
      ...prev,
      [vidId]: (prev[vidId] || 100) + (isCurrentlyLiked ? -1 : 1)
    }));

    if (!isCurrentlyLiked) {
      triggerToast('تم الإعجاب بالفيديو', 'شكراً لمشاركتك انطباعك الإيجابي.', 'system');
    }
  };

  const handleToggleBookmark = (vidId: string) => {
    const updated = !bookmarkedMap[vidId];
    setBookmarkedMap(prev => ({ ...prev, [vidId]: updated }));
    if (updated) {
      triggerToast('تمت الإضافة للمفضلة', 'تم حفظ الفيديو في قائمتك المفضلة.', 'system');
    }
  };

  const handleShareVideo = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    triggerToast('تم نسخ رابط الفيديو', 'يمكنك الآن مشاركته عبر منصات التواصل الاجتماعي.', 'system');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComm = {
      id: `vc-${Date.now()}`,
      name: user?.name || 'متابع القناة',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80',
      text: newCommentText.trim(),
      time: 'الآن'
    };

    setVideoComments(prev => ({
      ...prev,
      [activeVideo.id]: [newComm, ...(prev[activeVideo.id] || [])]
    }));

    setNewCommentText('');
    triggerToast('تم نشر تعليقك', 'تعليقك أصلح ظاهراً على الفيديو الآن.', 'comment');
  };

  return (
    <div className={`min-h-screen py-6 px-4 animate-fadeIn transition-colors ${
      isDarkMode ? 'bg-[#070b14] text-slate-100' : 'bg-[#f4f6f9] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header Controls */}
        <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
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
            <Video className="w-6 h-6 text-red-500" />
            <h1 className={`text-xl sm:text-2xl font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              مكتبة الفيديوهات والتغطيات المرئية
            </h1>
          </div>
        </div>

        {/* Main Section: Video Player Cinema + Playlist Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column (8 cols): Main Featured Video Player */}
          <div className="lg:col-span-8 space-y-5">
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative group">
              {/* Embed Youtube or Stream Player */}
              <div className="aspect-video w-full bg-black relative">
                {activeVideo.videoUrl.includes('youtube.com') || activeVideo.videoUrl.includes('youtu.be') ? (
                  <iframe
                    src={activeVideo.videoUrl.includes('?') ? activeVideo.videoUrl : `${activeVideo.videoUrl}?autoplay=1&rel=0`}
                    title={activeVideo.title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <img src={activeVideo.thumbnail} alt="" className="w-full h-full object-cover brightness-75" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform cursor-pointer">
                        <Play className="w-8 h-8 fill-white ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Details Card */}
            <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="bg-red-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
                  {activeVideo.category || 'تغطية مرئية'}
                </span>

                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>{activeVideo.views} مشاهدة</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-red-500" />
                    <span>{activeVideo.publishDate || 'منذ ساعات'}</span>
                  </span>
                </div>
              </div>

              <h2 className={`text-xl sm:text-2xl font-extrabold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {activeVideo.title}
              </h2>

              <p className={`text-xs sm:text-sm leading-relaxed p-4 rounded-2xl border ${
                isDarkMode ? 'bg-slate-900/80 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                {activeVideo.description || 'تغطية شاملة ومصورة عبر مراسلي قناة يمن 4 HD.'}
              </p>

              {/* Action Buttons: Like, Bookmark, Share */}
              <div className={`flex flex-wrap items-center justify-between gap-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLikeVideo(activeVideo.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black border transition-all ${
                      likedMap[activeVideo.id]
                        ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                        : isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-red-500/50' : 'bg-slate-100 text-slate-800 border-slate-200 hover:border-red-500'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>إعجاب ({(likesCountMap[activeVideo.id] || 1200).toLocaleString('ar-YE')})</span>
                  </button>

                  <button
                    onClick={() => handleToggleBookmark(activeVideo.id)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      bookmarkedMap[activeVideo.id]
                        ? 'bg-amber-600/20 text-amber-500 border-amber-500/50'
                        : isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-500/50' : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-500'
                    }`}
                    title="حفظ الفيديو"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleShareVideo}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800 hover:text-sky-400' : 'bg-slate-100 text-slate-800 border-slate-200 hover:text-sky-600'
                  }`}
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-sky-500" />}
                  <span>{copiedLink ? 'تم نسخ الرابط' : 'مشاركة الفيديو'}</span>
                </button>
              </div>
            </div>

            {/* Video Interactive Comments Section */}
            <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
              isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
            }`}>
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-500" />
                <span>التعليقات والملاحظات ({(videoComments[activeVideo.id] || []).length})</span>
              </h3>

              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب تعليقك حول هذا الفيديو..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className={`flex-1 text-xs rounded-xl p-3 border focus:outline-none focus:border-red-500 ${
                    isDarkMode ? 'bg-slate-900 text-slate-100 border-slate-800 placeholder-slate-500' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-400'
                  }`}
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shrink-0 transition-all shadow-md"
                >
                  إرسال
                </button>
              </form>

              <div className="space-y-3 pt-2">
                {(videoComments[activeVideo.id] || []).map((c) => (
                  <div key={c.id} className={`p-3 rounded-2xl border text-xs space-y-1 ${
                    isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img src={c.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-extrabold text-slate-200">{c.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">{c.time}</span>
                    </div>
                    <p className={`text-xs pr-8 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Playlist / Category Filter / Search */}
          <div className="lg:col-span-4 space-y-4">

            {/* Filter & Search Bar */}
            <div className={`p-5 rounded-3xl border shadow-xl space-y-4 ${
              isDarkMode ? 'bg-[#0e1726] border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="بحث في الفيديوهات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full text-xs rounded-xl pl-3 pr-9 py-2.5 border focus:outline-none focus:border-red-500 ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold shrink-0 transition-all ${
                      selectedCategory === cat
                        ? 'bg-red-600 text-white shadow-md'
                        : isDarkMode ? 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Playlist Grid */}
            <div className="space-y-3">
              <h3 className={`font-black text-sm px-1 flex items-center justify-between ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                <span>قائمة الفيديوهات المتاحة ({filteredVideos.length})</span>
                <Sparkles className="w-4 h-4 text-red-500" />
              </h3>

              {filteredVideos.length === 0 ? (
                <div className={`p-8 text-center rounded-2xl border text-xs font-bold ${
                  isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                }`}>
                  لا توجد فيديوهات مطابقة للبحث
                </div>
              ) : (
                filteredVideos.map((vid) => {
                  const isActive = activeVideo.id === vid.id;

                  return (
                    <div
                      key={vid.id}
                      onClick={() => setActiveVideo(vid)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 group ${
                        isActive
                          ? 'bg-red-950/40 border-red-500/80 shadow-lg'
                          : isDarkMode ? 'bg-[#0e1726] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-red-300 shadow-sm'
                      }`}
                    >
                      <div className="relative w-28 aspect-video rounded-xl overflow-hidden shrink-0 bg-black">
                        <img src={vid.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-6 h-6 fill-white text-white" />
                        </div>
                        <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] text-white font-mono px-1.5 py-0.5 rounded">
                          {vid.duration}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <h4 className={`text-xs font-extrabold line-clamp-2 leading-snug transition-colors ${
                          isActive
                            ? 'text-red-400'
                            : isDarkMode ? 'text-slate-100 group-hover:text-red-400' : 'text-slate-900 group-hover:text-red-600'
                        }`}>
                          {vid.title}
                        </h4>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                          <span className="font-semibold text-red-500">{vid.category || 'فيديو'}</span>
                          <span className="flex items-center gap-1"><Eye className="w-2.5 h-2.5" /> {vid.views}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
