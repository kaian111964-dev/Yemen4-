import React, { createContext, useContext, useState, useEffect } from 'react';
import { Article, CMSData, Comment, MatchItem, NotificationItem, PageView, UserProfile, PollData } from '../types';
import { defaultUserProfile, initialCMSData, initialComments, initialNotifications, initialPollData } from '../data/initialData';
import { 
  auth, testConnection, saveArticleToFirestore, deleteArticleFromFirestore,
  saveSiteSettingsToFirestore, subscribeToSiteSettings, subscribeToArticles,
  seedInitialDataToFirestoreIfEmpty, incrementArticleViewsInFirestore,
  saveMatchToFirestore, deleteMatchFromFirestore, subscribeToMatches,
  saveCommentsToFirestore, subscribeToAllComments,
  savePollToFirestore, subscribeToPoll
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface AppContextType {
  cmsData: CMSData;
  setCmsData: React.Dispatch<React.SetStateAction<CMSData>>;
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedProgramId: string | null;
  setSelectedProgramId: (id: string | null) => void;
  
  // User Auth & Profile
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;

  // Comments System
  comments: Record<string, Comment[]>;
  addComment: (articleId: string, text: string) => void;
  addReply: (articleId: string, commentId: string, text: string) => void;
  likeComment: (articleId: string, commentId: string) => void;

  // Poll System
  poll: PollData;
  votePoll: (optionId: number) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  triggerToast: (title: string, message: string, type?: NotificationItem['type']) => void;
  toast: { title: string; message: string; type: NotificationItem['type'] } | null;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Theme
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;

  // Navigation Helper
  navigateToArticle: (articleId: string) => void;
  navigateToCategory: (category: string) => void;

  // CMS helper actions
  updateTicker: (items: string[]) => void;
  addArticle: (newArt: Partial<Article>) => void;
  updateArticle: (articleId: string, updatedArt: Partial<Article>) => void;
  deleteArticle: (articleId: string) => void;
  addMatch: (newMatch: Partial<MatchItem>) => void;
  updateMatch: (matchId: string, updatedMatch: Partial<MatchItem>) => void;
  deleteMatch: (matchId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial CMS data from localStorage if available, or fall back to default
  const [cmsData, setCmsData] = useState<CMSData>(() => {
    try {
      const saved = localStorage.getItem('yemen4_cms_data');
      return saved ? JSON.parse(saved) : { ...initialCMSData, poll: initialPollData };
    } catch {
      return { ...initialCMSData, poll: initialPollData };
    }
  });

  const [currentView, setCurrentView] = useState<PageView>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>('art-1');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('yemen4_theme');
      return saved ? saved === 'dark' : false; // Default to Light Mode
    } catch {
      return false; // Default to Light Mode
    }
  });

  // User auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('yemen4_user');
      return saved ? JSON.parse(saved) : defaultUserProfile;
    } catch {
      return defaultUserProfile;
    }
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Comments state
  const [comments, setComments] = useState<Record<string, Comment[]>>(() => {
    try {
      const saved = localStorage.getItem('yemen4_comments');
      return saved ? JSON.parse(saved) : initialComments;
    } catch {
      return initialComments;
    }
  });

  // Poll state
  const [poll, setPoll] = useState<PollData>(() => cmsData.poll || initialPollData);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [toast, setToast] = useState<{ title: string; message: string; type: NotificationItem['type'] } | null>(null);

  // Validate connection to Firestore and setup Real-time snapshot listeners
  useEffect(() => {
    testConnection();

    // Seed initial data if Firestore is fresh/empty
    if (initialCMSData.siteSettings) {
      seedInitialDataToFirestoreIfEmpty(
        initialCMSData.siteSettings, 
        initialCMSData.articles,
        initialCMSData.matches,
        initialComments,
        initialPollData
      );
    }

    // Real-time Auth listener
    const unsubscribeAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(prev => ({
          ...defaultUserProfile,
          ...prev,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'مستخدم Google',
          email: fbUser.email || prev?.email || 'user@google.com',
          avatar: fbUser.photoURL || prev?.avatar || defaultUserProfile.avatar
        }));
      }
    });

    // Real-time Firestore Settings listener
    const unsubscribeSettings = subscribeToSiteSettings((newSettings) => {
      setCmsData(prev => ({
        ...prev,
        liveStreamUrl: newSettings.liveStreamUrl || prev.liveStreamUrl,
        liveStreamPosterUrl: newSettings.liveStreamPosterUrl !== undefined ? newSettings.liveStreamPosterUrl : prev.liveStreamPosterUrl,
        radioStreamUrl: newSettings.radioStreamUrl || prev.radioStreamUrl,
        siteSettings: {
          ...prev.siteSettings,
          ...newSettings
        }
      }));
    });

    // Real-time Firestore Articles listener
    const unsubscribeArticles = subscribeToArticles((firestoreArticles) => {
      if (firestoreArticles && firestoreArticles.length > 0) {
        setCmsData(prev => ({
          ...prev,
          articles: firestoreArticles
        }));
      }
    });

    // Real-time Firestore Matches listener
    const unsubscribeMatches = subscribeToMatches((firestoreMatches) => {
      if (firestoreMatches && firestoreMatches.length > 0) {
        setCmsData(prev => ({
          ...prev,
          matches: firestoreMatches
        }));
      }
    });

    // Real-time Firestore Comments listener
    const unsubscribeComments = subscribeToAllComments((commentsMap) => {
      if (commentsMap && Object.keys(commentsMap).length > 0) {
        setComments(commentsMap);
      }
    });

    // Real-time Firestore Poll listener
    const unsubscribePoll = subscribeToPoll((firestorePoll) => {
      if (firestorePoll) {
        setPoll(firestorePoll);
        setCmsData(prev => ({ ...prev, poll: firestorePoll }));
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSettings();
      unsubscribeArticles();
      unsubscribeMatches();
      unsubscribeComments();
      unsubscribePoll();
    };
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('yemen4_cms_data', JSON.stringify(cmsData));
    } catch (e) {
      console.error(e);
    }
  }, [cmsData]);

  useEffect(() => {
    try {
      localStorage.setItem('yemen4_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('yemen4_comments', JSON.stringify(comments));
    } catch (e) {
      console.error(e);
    }
  }, [comments]);

  useEffect(() => {
    try {
      localStorage.setItem('yemen4_theme', isDarkMode ? 'dark' : 'light');
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const toggleBookmark = (articleId: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const alreadySaved = user.savedArticles.includes(articleId);
    const updatedSaved = alreadySaved
      ? user.savedArticles.filter(id => id !== articleId)
      : [...user.savedArticles, articleId];

    setUser({ ...user, savedArticles: updatedSaved });
    triggerToast(
      alreadySaved ? 'تم الإزالة من المحفوظات' : 'تم الحفظ بنجاح',
      alreadySaved ? 'تم إزالة الخبر من قائمة قراءتك لاحقاً.' : 'يمكنك الوصول لهذا الخبر من ملفك الشخصي.',
      'system'
    );
  };

  const isBookmarked = (articleId: string) => {
    return user ? user.savedArticles.includes(articleId) : false;
  };

  const addComment = (articleId: string, text: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const newComment: Comment = {
      id: `comm-${Date.now()}`,
      articleId,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      timestamp: 'الآن',
      likes: 0,
      replies: []
    };

    setComments(prev => {
      const updatedList = [newComment, ...(prev[articleId] || [])];
      saveCommentsToFirestore(articleId, updatedList);
      return {
        ...prev,
        [articleId]: updatedList
      };
    });

    triggerToast('تم نشر تعليقك', 'تعليقك يظهر الآن في قسم التعليقات التفاعلية.', 'comment');
  };

  const addReply = (articleId: string, commentId: string, text: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      articleId,
      userName: user.name,
      userAvatar: user.avatar,
      text,
      timestamp: 'الآن',
      likes: 0
    };

    setComments(prev => {
      const artComments = prev[articleId] || [];
      const updated = artComments.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply]
          };
        }
        return c;
      });
      saveCommentsToFirestore(articleId, updated);
      return { ...prev, [articleId]: updated };
    });

    triggerToast('تم الرد على التعليق', 'تم إضافة ردك بنجاح.', 'comment');
  };

  const likeComment = (articleId: string, commentId: string) => {
    setComments(prev => {
      const artComments = prev[articleId] || [];
      const updated = artComments.map(c => {
        if (c.id === commentId) {
          const userLiked = !c.userLiked;
          return {
            ...c,
            userLiked,
            likes: userLiked ? c.likes + 1 : c.likes - 1
          };
        }
        if (c.replies) {
          const updatedReplies = c.replies.map(r => {
            if (r.id === commentId) {
              const userLiked = !r.userLiked;
              return {
                ...r,
                userLiked,
                likes: userLiked ? r.likes + 1 : r.likes - 1
              };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      });
      saveCommentsToFirestore(articleId, updated);
      return { ...prev, [articleId]: updated };
    });
  };

  const votePoll = (optionId: number) => {
    const currentPoll = poll || initialPollData;
    const newTotal = currentPoll.totalVotes + 1;
    const newOptions = currentPoll.options.map(opt => {
      const newVotes = opt.id === optionId ? opt.votes + 1 : opt.votes;
      return {
        ...opt,
        votes: newVotes,
        percent: Math.round((newVotes / newTotal) * 100)
      };
    });
    const updatedPoll: PollData = {
      ...currentPoll,
      totalVotes: newTotal,
      options: newOptions
    };
    setPoll(updatedPoll);
    setCmsData(prev => ({ ...prev, poll: updatedPoll }));
    savePollToFirestore(updatedPoll);
  };

  const triggerToast = (title: string, message: string, type: NotificationItem['type'] = 'system') => {
    setToast({ title, message, type });
    // Add to notifications
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'الآن',
      type,
      isRead: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const navigateToArticle = (articleId: string) => {
    setSelectedArticleId(articleId);
    setCurrentView('article');
    // Increment views atomically in Firestore
    incrementArticleViewsInFirestore(articleId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // CMS helpers
  const updateTicker = (items: string[]) => {
    setCmsData(prev => {
      const nextData = { ...prev, tickerText: items };
      if (nextData.siteSettings) {
        saveSiteSettingsToFirestore(nextData.siteSettings);
      }
      return nextData;
    });
    triggerToast('تم تحديث الشريط العاجل', 'يظهر الشريط الجديد للزوار فوراً.', 'breaking');
  };

  const addArticle = (newArt: Partial<Article>) => {
    const todayIso = new Date().toISOString().split('T')[0];
    const fullArticle: Article = {
      id: `art-${Date.now()}`,
      title: newArt.title || 'عنوان إخباري جديد',
      excerpt: newArt.excerpt || '',
      content: newArt.content || '',
      category: newArt.category || 'أخبار',
      categoryColor: newArt.categoryColor || 'bg-red-600',
      imageUrl: newArt.imageUrl || 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
      publishDate: 'اليوم',
      isoDate: newArt.isoDate || todayIso,
      timeAgo: 'الآن',
      viewsCount: 1,
      isHero: newArt.isHero ?? false,
      isBreaking: newArt.isBreaking ?? false,
      isLatest: newArt.isLatest ?? true,
      inTicker: newArt.inTicker ?? false,
      priority: newArt.priority ?? 10,
      author: newArt.author || {
        name: user?.name || 'محرر القناة',
        avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: 'محرر الأخبار'
      },
      tags: newArt.tags || ['أخبار', 'يمن 4']
    };

    saveArticleToFirestore(fullArticle);

    setCmsData(prev => ({
      ...prev,
      articles: [fullArticle, ...prev.articles],
      tickerText: newArt.inTicker ? [`عاجل: ${fullArticle.title}`, ...prev.tickerText] : prev.tickerText
    }));
    triggerToast('تم نشر المقال بنجاح', 'تم حفظ ونشر المقال في قاعدة البيانات.', 'system');
  };

  const updateArticle = (articleId: string, updatedArt: Partial<Article>) => {
    const existing = cmsData.articles.find(a => a.id === articleId);
    if (existing) {
      const merged = { ...existing, ...updatedArt };
      saveArticleToFirestore(merged);
    }
    setCmsData(prev => ({
      ...prev,
      articles: prev.articles.map(a => a.id === articleId ? { ...a, ...updatedArt } : a)
    }));
    triggerToast('تم حفظ التعديلات', 'تم تحديث بيانات المقال في Firestore.', 'system');
  };

  const deleteArticle = (articleId: string) => {
    deleteArticleFromFirestore(articleId);
    setCmsData(prev => ({
      ...prev,
      articles: prev.articles.filter(a => a.id !== articleId)
    }));
    triggerToast('تم حذف المقال', 'تم إزالة المقال من قاعدة البيانات.', 'system');
  };

  const addMatch = (newMatch: Partial<MatchItem>) => {
    const item: MatchItem = {
      id: `m-${Date.now()}`,
      homeTeam: newMatch.homeTeam || 'الفريق الأجنبي',
      homeLogo: newMatch.homeLogo || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      homeScore: newMatch.homeScore ?? 0,
      awayTeam: newMatch.awayTeam || 'الفريق الضيف',
      awayLogo: newMatch.awayLogo || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=120&q=80',
      awayScore: newMatch.awayScore ?? 0,
      tournament: newMatch.tournament || 'الدوري اليمني الممتاز',
      date: newMatch.date || 'اليوم',
      time: newMatch.time || '20:00',
      status: newMatch.status || 'upcoming',
      minute: newMatch.minute,
      channel: newMatch.channel || 'يمن 4 HD',
      stadium: newMatch.stadium || 'استاد الثورة الرياضي'
    };

    saveMatchToFirestore(item);

    setCmsData(prev => ({
      ...prev,
      matches: [item, ...(prev.matches || [])]
    }));
    triggerToast('تم إضافة المباراة', 'تم إضافة المباراة بنجاح إلى جدول المباريات.', 'system');
  };

  const updateMatch = (matchId: string, updatedMatch: Partial<MatchItem>) => {
    const existing = (cmsData.matches || []).find(m => m.id === matchId);
    if (existing) {
      const merged = { ...existing, ...updatedMatch };
      saveMatchToFirestore(merged);
    }
    setCmsData(prev => ({
      ...prev,
      matches: (prev.matches || []).map(m => m.id === matchId ? { ...m, ...updatedMatch } : m)
    }));
    triggerToast('تم تحديث النتيجة / المباراة', 'تم حفظ التعديلات بجدول المباريات.', 'system');
  };

  const deleteMatch = (matchId: string) => {
    deleteMatchFromFirestore(matchId);
    setCmsData(prev => ({
      ...prev,
      matches: (prev.matches || []).filter(m => m.id !== matchId)
    }));
    triggerToast('تم حذف المباراة', 'تم إزالة المباراة من الجدول.', 'system');
  };

  return (
    <AppContext.Provider
      value={{
        cmsData,
        setCmsData,
        currentView,
        setCurrentView,
        selectedArticleId,
        setSelectedArticleId,
        selectedCategory,
        setSelectedCategory,
        selectedProgramId,
        setSelectedProgramId,
        user,
        setUser,
        isLoginModalOpen,
        setIsLoginModalOpen,
        toggleBookmark,
        isBookmarked,
        comments,
        addComment,
        addReply,
        likeComment,
        poll,
        votePoll,
        notifications,
        unreadCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        triggerToast,
        toast,
        searchQuery,
        setSearchQuery,
        isDarkMode,
        setIsDarkMode,
        navigateToArticle,
        navigateToCategory,
        updateTicker,
        addArticle,
        updateArticle,
        deleteArticle,
        addMatch,
        updateMatch,
        deleteMatch
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
