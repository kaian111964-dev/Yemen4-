import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, HardDrive, Search, UploadCloud, Trash2, ExternalLink, Image as ImageIcon, 
  FileText, Check, AlertTriangle, RefreshCw, LogIn, Lock, Sparkles, Copy 
} from 'lucide-react';
import { 
  auth, googleProvider, getDriveAccessToken, setDriveAccessToken, 
  fetchDriveFiles, uploadFileToDrive, deleteDriveFile, DriveFile 
} from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage?: (url: string) => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({ isOpen, onClose, onSelectImage }) => {
  const { user, triggerToast } = useApp();
  const [token, setToken] = useState<string | null>(getDriveAccessToken());
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // New File Upload State
  const [newFileName, setNewFileName] = useState('');
  const [newFileContent, setNewFileContent] = useState('');
  const [newFileMime, setNewFileMime] = useState('text/plain');

  // Confirmation Modal for Deletion (MANDATORY REQUIREMENT FOR MUTATION)
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);

  useEffect(() => {
    const currentToken = getDriveAccessToken();
    setToken(currentToken);
    if (isOpen && currentToken) {
      loadFiles(currentToken, searchQuery);
    }
  }, [isOpen]);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setDriveAccessToken(credential.accessToken);
        setToken(credential.accessToken);
        triggerToast('تم الاتصال بـ Google Drive', 'تم ربط حسابك في Google Drive بنجاح.', 'system');
        loadFiles(credential.accessToken, searchQuery);
      } else {
        throw new Error('لم يتم الاستحواذ على رمز الوصول (AccessToken)');
      }
    } catch (err: any) {
      console.error('Google Drive sign-in error:', err);
      triggerToast('تنبيه المصادقة', 'تعذر استكمال تسجل الدخول باستخدام Google Drive.', 'system');
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (accessToken: string, query?: string) => {
    setLoading(true);
    try {
      const driveFiles = await fetchDriveFiles(accessToken, query);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Load files error:', err);
      triggerToast('خطأ في جلب الملفات', 'فشل تحميل قائمة الملفات من Google Drive.', 'system');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      loadFiles(token, searchQuery);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!newFileName) {
      triggerToast('تنبيه', 'يرجى إدخال اسم الملف أولاً.', 'system');
      return;
    }
    setIsUploading(true);
    try {
      const uploaded = await uploadFileToDrive(token, newFileName, newFileContent, newFileMime);
      triggerToast('تم الرفع إلى Google Drive', `تم رفع الملف "${uploaded.name}" بنجاح إلى حسابك.`, 'system');
      setNewFileName('');
      setNewFileContent('');
      loadFiles(token, searchQuery);
    } catch (err: any) {
      console.error('Upload error:', err);
      triggerToast('خطأ في الرفع', 'فشل رفع الملف إلى Google Drive.', 'system');
    } finally {
      setIsUploading(false);
    }
  };

  // Explicit User Confirmation Dialog for File Deletion
  const confirmDelete = async () => {
    if (!fileToDelete || !token) return;
    setLoading(true);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      triggerToast('تم الحذف من Google Drive', `تم حذف الملف "${fileToDelete.name}" نهائياً.`, 'system');
      setFileToDelete(null);
      loadFiles(token, searchQuery);
    } catch (err: any) {
      console.error('Delete file error:', err);
      triggerToast('خطأ الحذف', 'تعذر حذف الملف من Google Drive.', 'system');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (file: DriveFile) => {
    const link = file.webContentLink || file.webViewLink || file.thumbnailLink || '';
    if (link) {
      navigator.clipboard.writeText(link);
      triggerToast('تم نسخ الرابط', 'تم نسخ رابط ملف Google Drive إلى الحافظة.', 'system');
    }
  };

  const handleSelectForCMS = (file: DriveFile) => {
    const link = file.thumbnailLink || file.webContentLink || file.webViewLink || '';
    if (onSelectImage && link) {
      onSelectImage(link);
      triggerToast('تم اختيار الصورة', 'تم ربط صورة Google Drive بالمقال.', 'system');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0e1726] border border-slate-700 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative text-right flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-100 flex items-center gap-2">
                <span>مدير ملفات Google Drive</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">مدمج مع CMS</span>
              </h3>
              <p className="text-xs text-slate-400">تصفح ورفع واستخدام وسائط Google Drive في مقالات وأخبار القناة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800 hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!token ? (
          <div className="my-auto py-12 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <HardDrive className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-slate-200 mb-2">ربط حساب Google Drive</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              قم بتسجيل الدخول باستخدام حساب Google لتتيح لنظام CMS الوصول المباشر لمستنداتك وصورك المجهزة في Google Drive.
            </p>
            
            {/* Official Google Sign-In Styled Button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full py-3 px-6 bg-slate-900 border border-slate-700 hover:border-blue-500 text-slate-100 font-bold text-xs rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all group"
            >
              <div className="w-5 h-5">
                <svg viewBox="0 0 48 48" className="w-full h-full">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              </div>
              <span>{loading ? 'جاري الاتصال...' : 'تسجيل الدخول والتفويض باستخدام Google'}</span>
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            {/* Search & Actions Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <form onSubmit={handleSearch} className="md:col-span-2 relative flex items-center">
                <input
                  type="text"
                  placeholder="بحث في ملفات Google Drive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs rounded-xl py-2.5 pl-10 pr-9 focus:outline-none focus:border-blue-500"
                />
                <Search className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute left-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg"
                >
                  بحث
                </button>
              </form>

              <button
                type="button"
                onClick={() => loadFiles(token, searchQuery)}
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>تحديث القائمة</span>
              </button>
            </div>

            {/* Quick Upload Form */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h4 className="text-xs font-black text-slate-200 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span>رفع مسودة أو تقرير إخباري سريع إلى Google Drive</span>
              </h4>
              <form onSubmit={handleUploadSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="اسم الملف (مثال: مسودة_تقرير_محلي.txt)"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    className="sm:col-span-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={newFileMime}
                    onChange={(e) => setNewFileMime(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl p-2.5 focus:outline-none"
                  >
                    <option value="text/plain">مستند نصي (Text)</option>
                    <option value="text/markdown">Markdown (MD)</option>
                    <option value="application/json">بيانات JSON</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  placeholder="محتوى التقرير أو المسودة التي تريد حفظها في Google Drive..."
                  value={newFileContent}
                  onChange={(e) => setNewFileContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-5 rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{isUploading ? 'جاري الرفع إلى Drive...' : 'حفظ الملف في Google Drive'}</span>
                </button>
              </form>
            </div>

            {/* Files List / Grid */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 mb-3 flex items-center justify-between">
                <span>الملفات المتاحة في Drive ({files.length})</span>
                {loading && <span className="text-blue-400 text-[10px] animate-pulse">جاري الاستعلام من Google Drive API...</span>}
              </h4>

              {files.length === 0 && !loading ? (
                <div className="text-center py-12 bg-slate-900/50 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-bold">لا توجد ملفات تطابق البحث في Google Drive.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {files.map((file) => {
                    const isImage = file.mimeType?.startsWith('image/') || file.thumbnailLink;
                    return (
                      <div
                        key={file.id}
                        className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-3 flex flex-col justify-between transition-all group"
                      >
                        <div>
                          {/* File Preview */}
                          <div className="h-28 bg-slate-950 rounded-xl mb-2 overflow-hidden border border-slate-800/80 flex items-center justify-center relative">
                            {file.thumbnailLink ? (
                              <img
                                src={file.thumbnailLink}
                                alt={file.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="text-slate-600 flex flex-col items-center gap-1">
                                {isImage ? <ImageIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
                                <span className="text-[9px] uppercase font-bold">{file.mimeType?.split('/')[1] || 'File'}</span>
                              </div>
                            )}
                          </div>

                          <h5 className="text-xs font-extrabold text-slate-200 line-clamp-1 dir-ltr text-right" title={file.name}>
                            {file.name}
                          </h5>
                          <p className="text-[10px] text-slate-500 mt-1">
                            {file.createdTime ? new Date(file.createdTime).toLocaleDateString('ar-EG') : 'تاريخ غير معروف'}
                          </p>
                        </div>

                        {/* File Action Controls */}
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1">
                          {onSelectImage && (
                            <button
                              type="button"
                              onClick={() => handleSelectForCMS(file)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"
                              title="استخدام هذه الصورة في المقال"
                            >
                              <Check className="w-3 h-3" />
                              <span>استخدام للمقال</span>
                            </button>
                          )}

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleCopyLink(file)}
                              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px]"
                              title="نسخ رابط الملف"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px]"
                                title="فتح في Google Drive"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {/* Explicit User Confirmation Trigger for Delete */}
                            <button
                              type="button"
                              onClick={() => setFileToDelete(file)}
                              className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-[10px]"
                              title="حذف الملف من Google Drive"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confirmation Modal for File Deletion (Mandatory Security Rule) */}
        {fileToDelete && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#111c2e] border border-red-500/40 rounded-2xl max-w-sm w-full p-5 text-right shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mb-3 mx-auto">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-slate-100 text-center mb-1">تأكيد حذف الملف من Google Drive</h4>
              <p className="text-xs text-slate-400 text-center leading-relaxed mb-4">
                هل أنت تأكد من رغبتك في حذف الملف <strong className="text-red-300 dir-ltr">{fileToDelete.name}</strong> نهائياً من حسابك في Google Drive؟
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-lg transition-all"
                >
                  نعم، حذف الملف
                </button>
                <button
                  type="button"
                  onClick={() => setFileToDelete(null)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
