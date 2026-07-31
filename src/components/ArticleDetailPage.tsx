import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Clock, Eye, Bookmark, Share2, Volume2, VolumeX, MessageSquare, ThumbsUp, Send, Facebook, Twitter, Check, Sparkles, User, CornerDownLeft, Plus, Minus } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const {
    cmsData,
    selectedArticleId,
    setCurrentView,
    navigateToArticle,
    user,
    setIsLoginModalOpen,
    comments,
    addComment,
    addReply,
    likeComment,
    toggleBookmark,
    isBookmarked,
    triggerToast,
    isDarkMode
  } = useApp();

  const article = cmsData.articles.find(a => a.id === selectedArticleId) || cmsData.articles[0];
  const articleComments = comments[article.id] || [];

  // Text size state
  const [fontSize, setFontSize] = useState<'text-sm' | 'text-base' | 'text-lg' | 'text-xl'>('text-base');

  // Audio reader simulator state
  const [isSpeaking, setIsSpeaking] = useState(false);

  // New comment state
  const [commentText, setCommentText] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Reading progress
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setReadProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAudioRead = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(article.title + '. ' + article.excerpt);
        utterance.lang = 'ar-SA';
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } else {
      triggerToast('القارئ الصوتي', 'جاري قراءة المقال بصوت المساعد ذكي...', 'system');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    triggerToast('تم نسخ الرابط', 'تم نسخ رابط الخبر إلى الحافظة بنجاح.', 'system');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(article.id, commentText.trim());
    setCommentText('');
  };

  const handlePostReply = (commentId: string) => {
    if (!replyText.trim()) return;
    addReply(article.id, commentId, replyText.trim());
    setReplyText('');
    setReplyingToId(null);
  };

  const handleShare = (platform: 'whatsapp' | 'x' | 'facebook' | 'telegram') => {
    const shareUrl = window.location.href;
    const title = article.title;
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(shareUrl);

    let url = '';
    if (platform === 'whatsapp') {
      url = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
    } else if (platform === 'x') {
      url = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    } else if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    } else if (platform === 'telegram') {
      url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
      triggerToast('تم فتح نافذة المشاركة', `جاري مشاركة الخبر عبر منصة ${platform.toUpperCase()}`, 'system');
    }
  };

  const relatedArticles = cmsData.articles.filter(a => a.id !== article.id).slice(0, 3);

  return (
    <div className={`min-h-screen py-6 px-4 animate-fadeIn transition-colors ${
      isDarkMode ? 'bg-[#070b14] text-slate-100' : 'bg-[#f4f6f9] text-slate-900'
    }`}>
      {/* Reading Progress Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50">
        <div className="h-full bg-red-600 transition-all duration-150" style={{ width: `${readProgress}%` }}></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* Top Controls & Breadcrumb */}
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

          <div className="text-xs text-slate-500 font-semibold flex items-center gap-2">
            <span>الرئيسية</span>
            <span>/</span>
            <span className="text-red-500">{article.category}</span>
          </div>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`text-white font-extrabold text-xs px-3.5 py-1.5 rounded-lg shadow-md ${article.categoryColor || 'bg-red-600'}`}>
              {article.category}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>{article.publishDate} ({article.timeAgo})</span>
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold mr-auto">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{article.viewsCount.toLocaleString('ar-YE')} مشاهدة</span>
            </span>
          </div>

          <h1 className={`text-xl sm:text-2xl lg:text-3xl font-extrabold leading-snug ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {article.title}
          </h1>

          {/* Author Card & Toolbar */}
          <div className={`border rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl ${
            isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
          }`}>
            {/* Author */}
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-red-500/40"
              />
              <div>
                <div className={`font-extrabold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{article.author.name}</div>
                <div className="text-xs text-slate-500">{article.author.role}</div>
              </div>
            </div>

            {/* Interactive Actions Toolbar */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Audio Reader */}
              <button
                onClick={handleAudioRead}
                title="استمع للمقال بصوت واضح"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isSpeaking
                    ? 'bg-red-600 text-white border-red-500 animate-pulse'
                    : isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-red-500/50' : 'bg-slate-100 text-slate-800 border-slate-200 hover:border-red-500/50'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-red-500" />}
                <span>{isSpeaking ? 'إيقاف الاستماع' : 'استمع للمقال'}</span>
              </button>

              {/* Text Size Controls */}
              <div className={`flex items-center border rounded-xl p-1 text-xs ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}>
                <button
                  onClick={() => setFontSize('text-lg')}
                  className={`p-1 hover:text-red-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                  title="تكبير الخط"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 text-[10px] text-slate-500 font-mono">الخط</span>
                <button
                  onClick={() => setFontSize('text-sm')}
                  className={`p-1 hover:text-red-500 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}
                  title="تصغير الخط"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bookmark */}
              <button
                onClick={() => toggleBookmark(article.id)}
                title="حفظ لقراءته لاحقاً"
                className={`p-2 rounded-xl border transition-all ${
                  isBookmarked(article.id)
                    ? 'bg-amber-600/20 text-amber-500 border-amber-500/50'
                    : isDarkMode ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-amber-400/40' : 'bg-slate-100 text-slate-700 border-slate-200 hover:border-amber-500'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>

              {/* Share */}
              <button
                onClick={handleCopyLink}
                title="نسخ رابط الخبر"
                className={`p-2 rounded-xl border transition-all ${
                  isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-sky-400' : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-sky-600'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden border border-slate-800 shadow-2xl aspect-[16/9] bg-slate-900">
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>

        {/* Main Article Body Text */}
        <div className={`border rounded-2xl p-6 sm:p-8 shadow-2xl leading-relaxed space-y-6 ${fontSize} ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <p className={`font-bold text-lg border-r-4 border-red-600 pr-4 py-1 rounded-l-xl ${
            isDarkMode ? 'text-slate-100 bg-red-950/20' : 'text-slate-900 bg-red-50'
          }`}>
            {article.excerpt}
          </p>

          <div className={`whitespace-pre-line space-y-4 text-justify font-['Cairo',sans-serif] font-medium leading-relaxed ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {article.content}
          </div>

          {/* Tags */}
          <div className={`flex flex-wrap items-center gap-2 pt-6 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <span className="text-xs text-slate-500 font-bold ml-2">الوسوم:</span>
            {article.tags.map((tag, idx) => (
              <span key={idx} className={`border text-xs px-3 py-1 rounded-full cursor-pointer transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-red-500/50' : 'bg-slate-100 border-slate-200 text-slate-800 hover:border-red-500'
              }`}>
                #{tag}
              </span>
            ))}
          </div>

          {/* Social Media Sharing Section (مشاركة الخبر عبر شبكات التواصل) */}
          <div className={`pt-6 border-t space-y-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-300 flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-500" />
                <span>مشاركة الخبر عبر شبكات التواصل الاجتماعي:</span>
              </span>
              <span className="text-[10px] text-slate-500 font-bold">انشر الخبر بسرعة</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#25D366] hover:bg-[#20bd5a] shadow-lg transition-all hover:scale-105"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-1.157 4.228 4.301-1.127z"/>
                </svg>
                <span>واتساب</span>
              </button>

              {/* X / Twitter */}
              <button
                onClick={() => handleShare('x')}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-slate-950 hover:bg-black border border-slate-700 shadow-lg transition-all hover:scale-105"
              >
                <Twitter className="w-4 h-4 text-sky-400" />
                <span>منصة X</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#1877F2] hover:bg-[#166fe5] shadow-lg transition-all hover:scale-105"
              >
                <Facebook className="w-4 h-4 fill-current" />
                <span>فيسبوك</span>
              </button>

              {/* Telegram */}
              <button
                onClick={() => handleShare('telegram')}
                className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#229ED9] hover:bg-[#1e8dbf] shadow-lg transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>تليجرام</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={handleCopyLink}
                className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all hover:scale-105 border ${
                  copiedLink
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg'
                    : isDarkMode
                      ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                      : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
              >
                {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Share2 className="w-4 h-4 text-amber-400" />}
                <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Comments Section (التعليقات التفاعلية) */}
        <div className={`border rounded-2xl p-6 shadow-2xl space-y-6 ${
          isDarkMode ? 'bg-[#0e1726] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}>
          <div className={`flex items-center justify-between border-b pb-4 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <h3 className={`font-black text-lg flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              <MessageSquare className="w-5 h-5 text-red-500" />
              <span>التعليقات التفاعلية ({articleComments.length})</span>
            </h3>
            <span className="text-xs text-slate-500">شاركونا آراءكم وانطباعاتكم</span>
          </div>

          {/* Comment Form */}
          <form onSubmit={handlePostComment} className="space-y-3">
            <div className="flex items-start gap-3">
              <img
                src={user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                alt=""
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div className="flex-1">
                <textarea
                  rows={3}
                  placeholder={user ? "اكتب تعليقك هنا بكل حرية واحترافية..." : "يرجى تسجيل الدخول للتعليق على هذا الخبر..."}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={`w-full text-xs rounded-xl p-3 border focus:outline-none focus:border-red-500 ${
                    isDarkMode ? 'bg-slate-900 text-slate-100 border-slate-800 placeholder-slate-500' : 'bg-slate-50 text-slate-900 border-slate-200 placeholder-slate-400'
                  }`}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال التعليق</span>
              </button>
            </div>
          </form>

          {/* Comments List Tree */}
          <div className={`space-y-4 pt-4 border-t ${isDarkMode ? 'border-slate-800/80' : 'border-slate-200'}`}>
            {articleComments.length > 0 ? (
              articleComments.map((comm) => (
                <div key={comm.id} className={`border rounded-2xl p-4 space-y-3 ${
                  isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={comm.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover border border-red-500/30" />
                      <div>
                        <span className={`font-extrabold text-xs block ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{comm.userName}</span>
                        <span className="text-[10px] text-slate-500">{comm.timestamp}</span>
                      </div>
                    </div>

                    {/* Like button */}
                    <button
                      onClick={() => likeComment(article.id, comm.id)}
                      className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        comm.userLiked 
                          ? 'bg-red-100 text-red-600 border border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800' 
                          : isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-200 text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{comm.likes}</span>
                    </button>
                  </div>

                  <p className={`text-xs leading-relaxed pr-10 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                    {comm.text}
                  </p>

                  <div className="pr-10">
                    <button
                      onClick={() => setReplyingToId(replyingToId === comm.id ? null : comm.id)}
                      className="text-[11px] text-red-500 font-bold hover:underline flex items-center gap-1"
                    >
                      <CornerDownLeft className="w-3 h-3" /> الرد على التعليق
                    </button>

                    {/* Reply Input */}
                    {replyingToId === comm.id && (
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="اكتب ردك..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className={`flex-1 text-xs rounded-xl p-2 border focus:outline-none focus:border-red-500 ${
                            isDarkMode ? 'bg-slate-950 text-slate-200 border-slate-800' : 'bg-white text-slate-900 border-slate-300'
                          }`}
                        />
                        <button
                          onClick={() => handlePostReply(comm.id)}
                          className="bg-red-600 text-white font-bold text-xs px-3 py-2 rounded-xl"
                        >
                          رد
                        </button>
                      </div>
                    )}

                    {/* Replies List */}
                    {comm.replies && comm.replies.length > 0 && (
                      <div className={`mt-3 space-y-2 border-r-2 pr-3 mr-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-300'}`}>
                        {comm.replies.map((reply) => (
                          <div key={reply.id} className={`p-3 rounded-xl border text-xs space-y-1 ${
                            isDarkMode ? 'bg-slate-950/80 border-slate-800/60' : 'bg-white border-slate-200'
                          }`}>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-red-500 text-[11px]">{reply.userName}</span>
                              <span className="text-[9px] text-slate-500">{reply.timestamp}</span>
                            </div>
                            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>{reply.text}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-xs">كن أول من يعلق على هذا الخبر!</div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        <div className="pt-6">
          <h3 className={`font-black text-xl mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            <span className="w-2.5 h-6 bg-red-600 rounded-sm"></span>
            <span>أخبار ذات صلة</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigateToArticle(rel.id)}
                className={`border rounded-2xl overflow-hidden cursor-pointer transition-all group shadow-xl ${
                  isDarkMode ? 'bg-[#0e1726] border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-red-300 shadow-md'
                }`}
              >
                <div className="aspect-video bg-slate-900 overflow-hidden">
                  <img src={rel.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] text-red-400 font-bold block mb-1">{rel.category}</span>
                  <h4 className="font-bold text-xs text-slate-100 group-hover:text-red-400 line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
