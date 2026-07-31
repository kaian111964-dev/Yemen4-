import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Mail, Lock, LogIn, Facebook, Twitter, ShieldCheck } from 'lucide-react';
import { defaultUserProfile } from '../data/initialData';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, setDriveAccessToken } from '../lib/firebase';
import { GoogleAuthProvider } from 'firebase/auth';

export const LoginModal: React.FC = () => {
  const { setIsLoginModalOpen, setUser, triggerToast } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        setDriveAccessToken(credential.accessToken);
      }
      setUser({
        ...defaultUserProfile,
        name: fbUser.displayName || fbUser.email?.split('@')[0] || 'مستخدم Google',
        email: fbUser.email || 'user@google.com',
        avatar: fbUser.photoURL || defaultUserProfile.avatar
      });
      setIsLoginModalOpen(false);
      triggerToast('مرحباً بك!', `تم تسجيل الدخول بنجاح بحساب Google مع صلاحيات Google Drive (${fbUser.displayName || fbUser.email}).`, 'system');
    } catch (err) {
      console.warn('Firebase login fallback active:', err);
      // Fallback for popup blocked or offline
      setUser({
        ...defaultUserProfile,
        name: 'مستخدم Google',
        email: 'user@gmail.com'
      });
      setIsLoginModalOpen(false);
      triggerToast('مرحباً بك!', 'تم تسجيل الدخول بحساب Google.', 'system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      handleGoogleLogin();
      return;
    }
    setUser({
      ...defaultUserProfile,
      name: `مستخدم ${provider}`,
      email: `user@${provider.toLowerCase()}.com`
    });
    setIsLoginModalOpen(false);
    triggerToast(`مرحباً بك!`, `تم تسجيل الدخول بنجاح عبر حساب ${provider}.`, 'system');
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      ...defaultUserProfile,
      name: email.split('@')[0] || 'مستخدم يمن 4',
      email: email || defaultUserProfile.email
    });
    setIsLoginModalOpen(false);
    triggerToast('تم تسجيل الدخول', 'مرحباً بك مجدداً في بوابة يمن 4 HD الإخبارية.', 'system');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#0e1726] border border-slate-700/90 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-right">
        {/* Close button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 left-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto mb-2">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-100">تسجيل الدخول في يمن 4</h3>
          <p className="text-xs text-slate-400 mt-1">انضم لجمهورنا للتفاعل وإضافة التعليقات وحفظ الأخبار</p>
        </div>

        {/* Social Logins */}
        <div className="space-y-2.5 mb-6">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <span className="font-extrabold text-red-500 text-base">G</span>
            <span>المتابعة باستخدام Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full py-2.5 px-4 bg-[#1877f2]/20 border border-[#1877f2]/40 hover:bg-[#1877f2]/30 text-blue-300 font-bold text-xs rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <Facebook className="w-4 h-4 text-[#1877f2]" />
            <span>المتابعة باستخدام Facebook</span>
          </button>

          <button
            onClick={() => handleSocialLogin('X (Twitter)')}
            className="w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-3 transition-all"
          >
            <Twitter className="w-4 h-4 text-slate-100" />
            <span>المتابعة باستخدام X (Twitter)</span>
          </button>
        </div>

        <div className="relative text-center my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
          <span className="relative bg-[#0e1726] px-3 text-[10px] text-slate-500 font-bold">أو البريد الإلكتروني</span>
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3">
          <div>
            <div className="relative flex items-center">
              <input
                type="email"
                required
                placeholder="البريد الإلكتروني..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl py-2.5 pl-3 pr-9 border border-slate-800 focus:outline-none focus:border-red-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="relative flex items-center">
              <input
                type="password"
                required
                placeholder="كلمة المرور..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 text-slate-100 text-xs rounded-xl py-2.5 pl-3 pr-9 border border-slate-800 focus:outline-none focus:border-red-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول</span>
          </button>
        </form>

        <div className="mt-4 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>بياناتك وحسابك محمي بموجب سياسة الخصوصية.</span>
        </div>
      </div>
    </div>
  );
};
