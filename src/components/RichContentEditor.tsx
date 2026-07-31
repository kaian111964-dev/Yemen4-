import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Eye,
  Edit3,
  Bold,
  Italic,
  Quote,
  List,
  ListOrdered,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Flame,
  FileText,
  CheckCircle2,
  HardDrive,
  BookOpen
} from 'lucide-react';
import { YEMEN4_LOGO_URL } from '../data/initialData';

interface RichContentEditorProps {
  content: string;
  setContent: (val: string) => void;
  excerpt: string;
  setExcerpt: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  category?: string;
  authorName?: string;
  authorRole?: string;
  imageUrl?: string;
  editorId: string;
  onOpenDriveModal?: () => void;
}

export const RichContentEditor: React.FC<RichContentEditorProps> = ({
  content,
  setContent,
  excerpt,
  setExcerpt,
  title,
  setTitle,
  category = 'محلي',
  authorName = 'محرر صحفي',
  authorRole = 'يمن 4 HD',
  imageUrl,
  editorId,
  onOpenDriveModal
}) => {
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [subImageUrl, setSubImageUrl] = useState('');
  const [subImageCaption, setSubImageCaption] = useState('');
  const [showSubImageModal, setShowSubImageModal] = useState(false);
  const [headlineIdeas, setHeadlineIdeas] = useState<string[]>([]);
  const [showHeadlinesModal, setShowHeadlinesModal] = useState(false);

  // Helper for inserting formatting tags into the textarea
  const insertFormatting = (prefix: string, suffix: string = '', defaultText: string = '') => {
    const el = document.getElementById(editorId) as HTMLTextAreaElement | null;
    if (!el) {
      setContent(content + '\n' + prefix + defaultText + suffix);
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;
    const replacement = prefix + selectedText + suffix;
    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Helper for inserting sub-image markdown
  const handleInsertSubImage = () => {
    if (!subImageUrl.trim()) return;
    const captionText = subImageCaption.trim() ? ` "${subImageCaption.trim()}"` : '';
    const imgMarkdown = `\n\n![${subImageCaption.trim() || 'صورة من التغطية'}](${subImageUrl.trim()}${captionText})\n\n`;
    setContent(content + imgMarkdown);
    setSubImageUrl('');
    setSubImageCaption('');
    setShowSubImageModal(false);
  };

  // Press Templates
  const applyTemplate = (templateType: string) => {
    if (!templateType) return;
    let templateText = '';
    if (templateType === 'breaking') {
      templateText = `أفادت مصادر ميدانية وحكومية لقناة يمن 4 HD بتطورات متسارعة ومهمة جرت قبل قليل...

## تفاصيل التطورات الميدانية
وأوضحت المصادر أن المستجدات الأخيرة شملت عدة اتجاهات رئيسية، وسط متابعة حثيثة من الجهات المعنية لتأمين الأوضاع وتسهيل حركة المواطنين.

> 🔴 [خبر عاجل]: مصادر رسمية تؤكد استقرار الأوضاع الميدانية والبدء بتنفيذ الحزمة الأولى من التدابير العاجلة.

## أبرز محاور التتقرير:
- النقطة الأولى: تقييم الوضع الميداني العام.
- النقطة الثانية: إجراءات السلامة المتبعة والتنسيق بين مختلف القطاعات.
- النقطة الثالثة: الموعد المرتقب لصدور المؤتمر الصحفي الرسمي.`;
    } else if (templateType === 'report') {
      templateText = `في ظل التطورات الاقتصادية والسياسية الأخيرة، يُسلط هذا التتقرير من قناة يمن 4 HD الضوء على الأبعاد الرئيسية وتأثيرها المباشر على الحياة اليومية للمواطنين.

## القراءة السياسية والإستراتيجية
يرى خبراء ومحللون صحفيون أن القراءات الأوليّة تشير إلى توجه عام نحو تعزيز الاستقرار واستكمال المشاريع الحيوية المفصلية.

> "تصريح خبير اقتصادي: الخطوات المتخذة تمثل ركيزة أساسية للنهوض بالقطاعات الخدمية والمصرفية خلال المرحلة المقبلة."

---

## أبرز التوقعات المستقبلية:
1. استقرار ملحوظ في مؤشرات الأداء الخدمي.
2. فتح آفاق جديدة للتعاون والشراكات التنموية.
3. معالجة التحديات الميدانية وفق جدول زمني محدد.`;
    } else if (templateType === 'statement') {
      templateText = `أصدرت الجهات المختصة بياناً رسمياً حصلت قناة يمن 4 HD على نسخة منه، تناول عدداً من القضايا الوطنية والخدمية الهامة.

> "نص البيان الرسمي: نؤكد للرأي العام التزامنا الكامل بكافة الضوابط والمعايير المتبعة، والعمل المستمر على تقديم أفضل الخدمات لكافة المواطنين في مختلف المناطق."

ودعا البيان كافة وسائل الإعلام والمواطنين إلى استقاء الأنباء والمعلومات من مصادرها الرسمية المعتمدة وتجنب الشائعات.`;
    } else if (templateType === 'interview') {
      templateText = `في حوار خاص وحصري لقناة يمن 4 HD، كشف ضيف الحلقة عن تفاصيل ومستجدات هامة تُعلن لأول مرة.

## س: ما هي أبرز الخطط والإنجازات التي تم تحقيقها خلال الفترة الماضية؟
ج: جرى التركيز بشكل مكثف على تطوير البنية التحتية، وتجاوز العقبات الميدانية بفضل التنسيق المستمر والعمل الجاد.

## س: كيف تتعاملون مع التحديات الطارئة والمطالب الشعبية؟
> "إجابة الضيف: نحن نضع تطلعات المواطن في مقدمة الأولويات، وسنواصل العمل ليل نهار لتحقيق الأهداف المنشودة."`;
    }

    if (templateText) {
      if (content.trim() && !window.confirm('هل تريد استبدال النص الحالي بالقالب المحدد؟')) {
        return;
      }
      setContent(templateText);
      setSelectedTemplate('');
    }
  };

  // Smart Beautifier & Formatter
  const handleBeautifyContent = () => {
    if (!content.trim()) return;
    const beautified = content
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/ {2,}/g, ' ')
      .trim();

    setContent(beautified);
  };

  // Auto-generate Excerpt
  const handleAutoExcerpt = () => {
    if (!content.trim()) return;
    const cleanText = content
      .replace(/[#>*!\[\]\(\)\-]/g, '')
      .replace(/\n+/g, ' ')
      .trim();
    const generatedExcerpt = cleanText.slice(0, 180) + (cleanText.length > 180 ? '...' : '');
    setExcerpt(generatedExcerpt);
  };

  // Generate Headline Ideas based on content
  const handleGenerateHeadlines = () => {
    if (!content.trim()) return;
    const ideas = [
      `تفاصيل حصرية: ${title || 'مستجدات مهمة'} وتداعياتها المرتقبة`,
      `مصادر يمن 4 HD تكشف كواليس: ${title || 'الحدث البارز'}`,
      `تغطية خاصة | أبرز ما جاء في التقرير الرسمي حول ${title || 'التطورات الأخيرة'}`
    ];
    setHeadlineIdeas(ideas);
    setShowHeadlinesModal(true);
  };

  // Metrics calculation
  const wordsCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charsCount = content.length;
  const paragraphsCount = content.trim() ? content.trim().split(/\n+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordsCount / 160));

  return (
    <div className="space-y-3 bg-[#090e1a] p-4 sm:p-5 rounded-2xl border border-slate-800 shadow-2xl">
      {/* Section Title & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-500" />
          <h4 className="text-xs sm:text-sm font-extrabold text-slate-100">
            محرر تفاصيل ومحتوى الخبر الكامل (Rich Journalistic Editor)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('edit')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'edit'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تحرير وتنسيق النص</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                viewMode === 'preview'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>المعاينة الحية للخبر</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'edit' ? (
        <>
          {/* 1. JOURNALISTIC TOOLBAR */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 ml-1">تنسيقات صحفية:</span>

              {/* H2 Heading */}
              <button
                type="button"
                onClick={() => insertFormatting('## ', '', 'عنوان فرعي رئيسي')}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-amber-300 font-extrabold flex items-center gap-1 transition-all"
                title="عنوان فرعي كبير (H2)"
              >
                <Heading1 className="w-3.5 h-3.5 text-amber-400" />
                <span>عنوان كبير</span>
              </button>

              {/* H3 Heading */}
              <button
                type="button"
                onClick={() => insertFormatting('### ', '', 'عنوان فرعي جانبي')}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-amber-200 font-bold flex items-center gap-1 transition-all"
                title="عنوان فرعي (H3)"
              >
                <Heading2 className="w-3.5 h-3.5 text-amber-300" />
                <span>عنوان فرعي</span>
              </button>

              <div className="h-4 w-px bg-slate-800 my-auto mx-1"></div>

              {/* Bold */}
              <button
                type="button"
                onClick={() => insertFormatting('**', '**', 'نص عريض')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-200 font-black transition-all"
                title="نص عريض (Bold)"
              >
                <span><b>B</b> عريض</span>
              </button>

              {/* Italic */}
              <button
                type="button"
                onClick={() => insertFormatting('*', '*', 'نص مائل')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-200 italic transition-all"
                title="نص مائل (Italic)"
              >
                <span><i>I</i> مائل</span>
              </button>

              <div className="h-4 w-px bg-slate-800 my-auto mx-1"></div>

              {/* Press Quote */}
              <button
                type="button"
                onClick={() => insertFormatting('> "', '" - تصريح مسؤول رفيع', 'نص التصريح الصحفي أو الاقتباس الرسمـي...')}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-sky-300 font-bold flex items-center gap-1 transition-all"
                title="اقتباس / تصريح صحفي"
              >
                <Quote className="w-3.5 h-3.5 text-sky-400" />
                <span>اقتباس صحفي</span>
              </button>

              {/* Breaking Callout */}
              <button
                type="button"
                onClick={() => insertFormatting('> 🔴 [تنويه عاجل]: ', '', 'نص التنويه أو الخبر العاجل الميداني...')}
                className="px-2.5 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-800/60 rounded-lg text-xs text-red-300 font-extrabold flex items-center gap-1 transition-all"
                title="مربع خبر عاجل / تنبيه"
              >
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>مربع عاجل</span>
              </button>

              <div className="h-4 w-px bg-slate-800 my-auto mx-1"></div>

              {/* Bullet List */}
              <button
                type="button"
                onClick={() => insertFormatting('- ', '', 'النقطة الأولى')}
                className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-200 transition-all"
                title="قائمة نقطية"
              >
                <List className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              {/* Numbered List */}
              <button
                type="button"
                onClick={() => insertFormatting('1. ', '', 'العنصر الأول')}
                className="p-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-200 transition-all"
                title="قائمة رقمية"
              >
                <ListOrdered className="w-3.5 h-3.5 text-emerald-400" />
              </button>

              {/* Sub Image */}
              <button
                type="button"
                onClick={() => setShowSubImageModal(true)}
                className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-emerald-300 font-bold flex items-center gap-1 transition-all"
                title="إدراج صورة فرعية داخل نص المقال"
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ صورة داخل المقال</span>
              </button>

              {/* Divider */}
              <button
                type="button"
                onClick={() => setContent(content + '\n\n---\n\n')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs text-slate-400 font-mono transition-all"
                title="فاصل موضوعي (---)"
              >
                <span>— فاصل</span>
              </button>
            </div>

            {/* SECOND ROW: TEMPLATES & SMART AI ASSISTANT */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
              {/* Journalistic Templates */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400">قوالب صحفية:</span>
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    applyTemplate(e.target.value);
                  }}
                  className="bg-slate-950 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-800 focus:outline-none focus:border-red-500 font-bold"
                >
                  <option value="">اختر قالب صحفي جاهز...</option>
                  <option value="breaking">⚡ قالب تغطية عاجلة وميدانية</option>
                  <option value="report">📊 قالب تقرير صحفي وتحليلي</option>
                  <option value="statement">📜 قالب بيان رسمي أو تصريح</option>
                  <option value="interview">🎙️ قالب حوار / مقابلة صحفية</option>
                </select>
              </div>

              {/* Smart AI / Helper Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Auto Summarize */}
                <button
                  type="button"
                  onClick={handleAutoExcerpt}
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  title="توليد ملخص تلقائي ووضعه في خانة الملخص"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>توليد ملخص تلقائي</span>
                </button>

                {/* Beautify */}
                <button
                  type="button"
                  onClick={handleBeautifyContent}
                  className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  title="تنظيف وتنسيق الفقرات والمسافات تلقائياً"
                >
                  <Wand2 className="w-3 h-3 text-purple-400" />
                  <span>تنسيق الفقرات</span>
                </button>

                {/* Headline Suggestions */}
                <button
                  type="button"
                  onClick={handleGenerateHeadlines}
                  className="bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all"
                  title="اقتراح عناوين صحفية جذابة"
                >
                  <BookOpen className="w-3 h-3 text-sky-400" />
                  <span>اقتراح عناوين</span>
                </button>
              </div>
            </div>
          </div>

          {/* TEXTAREA INPUT */}
          <div className="relative">
            <textarea
              id={editorId}
              rows={10}
              required
              placeholder="اكتب أو الصق تفاصيل ومحتوى الخبر الكامل هنا... استخدم شريط الأدوات أعلاه لإدراج عناوين فرعية، اقتباسات صحفية، تنويهات عاجلة، وقوائم."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl p-4 border border-slate-800 focus:outline-none focus:border-red-500 font-['Cairo',sans-serif] leading-relaxed shadow-inner"
            ></textarea>
          </div>

          {/* WRITING METRICS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] font-bold text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-300">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span>عدد الكلمات:</span>
                <span className="text-white font-mono font-extrabold">{wordsCount.toLocaleString('ar-YE')}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>الأحرف:</span>
                <span className="text-slate-300 font-mono">{charsCount.toLocaleString('ar-YE')}</span>
              </span>
              <span className="flex items-center gap-1">
                <span>الفقرات:</span>
                <span className="text-slate-300 font-mono">{paragraphsCount}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-amber-400">
              <span>⏱️ وقت القراءة المتوقع:</span>
              <span className="font-extrabold text-white bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/60">
                {readTimeMinutes} {readTimeMinutes === 1 ? 'دقيقة واحدة' : readTimeMinutes === 2 ? 'دقيقتان' : `${readTimeMinutes} دقائق`}
              </span>
            </div>
          </div>
        </>
      ) : (
        /* 2. LIVE ARTICLE PREVIEW MODE */
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-md">
                {category}
              </span>
              <span className="text-xs text-slate-400">معاينة شكل الخبر لدى الزوار في الموقع</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>معاينة حية وتفاعلية</span>
            </span>
          </div>

          {/* Article Title */}
          <h2 className="text-lg sm:text-2xl font-black text-white leading-snug">
            {title || 'عنوان الخبر سيظهر هنا...'}
          </h2>

          {/* Author Badge */}
          <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
            <img
              src={YEMEN4_LOGO_URL}
              alt="Yemen 4 HD"
              className="w-10 h-10 rounded-full object-cover border border-red-500/40 bg-black p-1"
            />
            <div>
              <div className="font-extrabold text-xs text-slate-200">{authorName || 'محرر صحفي'}</div>
              <div className="text-[11px] text-slate-400">{authorRole || 'قناة يمن 4 HD'}</div>
            </div>
          </div>

          {/* Excerpt Box */}
          {excerpt && (
            <p className="font-bold text-sm text-slate-200 border-r-4 border-red-600 pr-4 py-2 bg-red-950/30 rounded-l-xl leading-relaxed">
              {excerpt}
            </p>
          )}

          {/* Article Main Image */}
          {imageUrl && (
            <div className="rounded-xl overflow-hidden aspect-video border border-slate-800 bg-black">
              <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Formatted Content Body Renderer */}
          <div className="space-y-4 font-['Cairo',sans-serif] text-xs sm:text-sm text-slate-200 leading-relaxed pt-2">
            {!content.trim() ? (
              <p className="text-slate-500 text-center py-6 italic">لم يتم إدخال تفاصيل ومحتوى الخبر بعد...</p>
            ) : (
              content.split('\n\n').map((paragraph, pIdx) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;

                // Heading H2
                if (trimmed.startsWith('## ')) {
                  return (
                    <h3 key={pIdx} className="text-sm sm:text-base font-extrabold text-amber-300 border-r-4 border-amber-500 pr-3 py-1 my-3 bg-amber-950/20 rounded-l-lg">
                      {trimmed.replace('## ', '')}
                    </h3>
                  );
                }

                // Heading H3
                if (trimmed.startsWith('### ')) {
                  return (
                    <h4 key={pIdx} className="text-xs sm:text-sm font-bold text-slate-100 my-2 pt-2 border-t border-slate-800/60">
                      {trimmed.replace('### ', '')}
                    </h4>
                  );
                }

                // Callout / Breaking box
                if (trimmed.includes('🔴') || trimmed.startsWith('> 🔴') || trimmed.includes('[عاجل]')) {
                  return (
                    <div key={pIdx} className="bg-gradient-to-r from-red-950/80 via-red-900/40 to-slate-900 border-r-4 border-red-500 p-3.5 rounded-l-xl text-red-200 font-bold my-3 shadow-md flex items-start gap-2">
                      <Flame className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1">{trimmed.replace(/^>\s*/, '')}</div>
                    </div>
                  );
                }

                // Blockquote
                if (trimmed.startsWith('> ')) {
                  return (
                    <blockquote key={pIdx} className="bg-slate-900 border-r-4 border-sky-500 p-3.5 rounded-l-xl text-sky-200 font-medium my-3 italic flex items-start gap-2 shadow">
                      <Quote className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <div className="flex-1">{trimmed.replace('> ', '')}</div>
                    </blockquote>
                  );
                }

                // Embedded Sub Image markdown: ![alt](url "caption")
                const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
                if (imgMatch) {
                  const [, altText, imgUrl, caption] = imgMatch;
                  return (
                    <figure key={pIdx} className="my-4 space-y-1.5 text-center">
                      <img src={imgUrl} alt={altText} className="w-full max-h-96 object-cover rounded-xl border border-slate-800 shadow-lg mx-auto" />
                      {(caption || altText) && (
                        <figcaption className="text-[11px] text-slate-400 font-bold bg-slate-900/60 inline-block px-3 py-1 rounded-full border border-slate-800">
                          📷 {caption || altText}
                        </figcaption>
                      )}
                    </figure>
                  );
                }

                // Divider
                if (trimmed === '---') {
                  return <hr key={pIdx} className="border-slate-800 my-4" />;
                }

                // Regular Paragraph
                return (
                  <p key={pIdx} className="text-slate-200 text-justify leading-relaxed">
                    {trimmed}
                  </p>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* MODAL: SUB-IMAGE INSERTER */}
      {showSubImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1726] border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold text-emerald-400 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span>إدراج صورة فرعية داخل محتوى الخبر</span>
              </h3>
              <button onClick={() => setShowSubImageModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">رابط الصورة (URL)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={subImageUrl}
                  onChange={(e) => setSubImageUrl(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">وصف الصورة / التعليق الصحفي</label>
                <input
                  type="text"
                  placeholder="مثال: الجانب المستهدف خلال الزيارة الميدانية..."
                  value={subImageCaption}
                  onChange={(e) => setSubImageCaption(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-3 border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {onOpenDriveModal && (
                <button
                  type="button"
                  onClick={() => {
                    setShowSubImageModal(false);
                    onOpenDriveModal();
                  }}
                  className="w-full bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-bold p-2.5 rounded-xl border border-blue-500/30 flex items-center justify-center gap-2 transition-all"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>اختيار الصورة من Google Drive</span>
                </button>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowSubImageModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl font-bold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleInsertSubImage}
                disabled={!subImageUrl.trim()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs rounded-xl font-bold shadow"
              >
                إدراج في المقال
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: HEADLINE SUGGESTIONS */}
      {showHeadlinesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1726] border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-extrabold text-sky-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>مقترحات عناوين صحفية جذابة</span>
              </h3>
              <button onClick={() => setShowHeadlinesModal(false)} className="text-slate-400 hover:text-white font-bold text-sm">
                ✕
              </button>
            </div>

            <div className="space-y-2">
              {headlineIdeas.map((idea, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setTitle(idea);
                    setShowHeadlinesModal(false);
                  }}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500 rounded-xl cursor-pointer text-xs font-bold text-slate-200 transition-all flex items-center justify-between gap-2"
                >
                  <span>{idea}</span>
                  <span className="text-[10px] bg-sky-950 text-sky-400 px-2 py-0.5 rounded border border-sky-800 shrink-0">
                    استخدام العنوان
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowHeadlinesModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
