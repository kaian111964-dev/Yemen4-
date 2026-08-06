export type PageView = 'home' | 'live' | 'article' | 'category' | 'program' | 'admin' | 'profile' | 'videos' | 'schedule' | 'about' | 'contact' | 'frequencies' | 'privacy' | 'cookies' | 'rss';

export interface ScheduleItem {
  id: string;
  programId: string;
  title: string;
  host: string;
  hostImage: string;
  startTime: string; // e.g. "21:00"
  endTime: string;   // e.g. "22:00"
  day: string;       // e.g. "اليوم" | "السبت" | "الأحد" ...
  category: string;
  description: string;
  isLiveNow?: boolean;
  progressPercentage?: number;
  guestName?: string;
  episodeTitle?: string;
  thumbnailUrl?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  views: string;
  thumbnail: string;
  videoUrl: string;
  category?: string;
  publishDate?: string;
  description?: string;
  likesCount?: number;
}

export interface Comment {
  id: string;
  articleId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  userLiked?: boolean;
  replies?: Comment[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  categoryColor?: string;
  imageUrl: string;
  publishDate: string;
  isoDate?: string; // YYYY-MM-DD format for interactive calendar lookup
  timeAgo: string;
  viewsCount: number;
  isHero?: boolean;
  isBreaking?: boolean;
  isLatest?: boolean;
  inTicker?: boolean;
  priority?: number; // Importance priority for custom sorting (e.g. 1 = highest)
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  tags: string[];
}

export interface Program {
  id: string;
  title: string;
  host: string;
  hostImage: string;
  airTime: string;
  description: string;
  category: string;
  latestEpisodeUrl?: string;
}

export interface CurrencyRate {
  currency: string;
  code: string;
  buyRate: number;
  sellRate: number;
  change: number; // percentage change e.g. +0.12 or -0.05
  flag: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: string;
  direction: string;
  forecast: {
    day: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
  }[];
}

export interface UserPermissions {
  canAddArticles?: boolean;
  canEditArticles?: boolean;
  canDeleteArticles?: boolean;
  canManageTicker?: boolean;
  canManageMatches?: boolean;
  canManageLiveStream?: boolean;
  canManageLayout?: boolean;
  canManageCurrencies?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  savedArticles: string[]; // array of article IDs
  joinedDate: string;
  role: 'user' | 'editor' | 'admin' | string;
  isAdmin?: boolean;
  password?: string;
  permissions?: UserPermissions;
  notificationsEnabled?: boolean; // toggle smart breaking toast alerts
  soundEnabled?: boolean;         // toggle audio chime for breaking alerts
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'breaking' | 'live' | 'system' | 'comment';
  isRead: boolean;
  linkArticleId?: string;
  soundPlayed?: boolean;
}

export interface MatchItem {
  id: string;
  homeTeam: string;
  homeLogo: string;
  homeScore?: number;
  awayTeam: string;
  awayLogo: string;
  awayScore?: number;
  tournament: string;
  date: string;
  time: string;
  status: 'live' | 'upcoming' | 'finished';
  minute?: string;
  channel?: string;
  stadium?: string;
}

export interface SiteLayoutSettings {
  sliderAutoPlay: boolean;
  sliderInterval: number; // in seconds (e.g. 5)
  sliderPauseOnHover: boolean;
  heroSectionTitle: string;
  breakingSectionTitle: string;
  latestSectionTitle: string;
  videosSectionTitle: string;
  matchesSectionTitle: string;
  categoriesSectionTitle: string;
  borderRadius: 'rounded-none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  showHeroSlider: boolean;
  showBreakingTicker: boolean;
  showBreakingTimeline: boolean;
  showMatchesBar: boolean;
  showLatestGrid: boolean;
  showCategorySections: boolean;
  showVideosSection: boolean;
  accentTheme: 'red' | 'gold' | 'blue' | 'emerald';
  // Advanced Layout & Styling Controls
  sectionHeaderColor?: string; // hex or tailwind class e.g. '#ef4444'
  sectionTitleSize?: 'text-lg' | 'text-xl' | 'text-2xl' | 'text-3xl';
  bodyTextSize?: 'text-xs' | 'text-sm' | 'text-base';
  containerPadding?: 'p-2' | 'p-4' | 'p-6' | 'p-8';
  sectionSpacing?: 'py-3' | 'py-6' | 'py-10';
  cardShadow?: 'shadow-none' | 'shadow-md' | 'shadow-xl' | 'shadow-2xl';
  newsSortBy?: 'date' | 'priority' | 'views'; // Sorting mode for slider & news sections
  liveStreamUrl?: string;
  liveStreamPosterUrl?: string;
  radioStreamUrl?: string;
}

export interface PollOption {
  id: number;
  label: string;
  votes: number;
  percent?: number;
}

export interface PollData {
  id: string;
  question: string;
  totalVotes: number;
  options: PollOption[];
}

export interface CMSData {
  tickerText: string[];
  liveStreamUrl: string;
  liveStreamPosterUrl?: string;
  radioStreamUrl?: string;
  liveViewersCount: number;
  isLiveNow: boolean;
  articles: Article[];
  programs: Program[];
  currencies: CurrencyRate[];
  weather: WeatherData;
  photos: { id: string; url: string; caption: string }[];
  videos: VideoItem[];
  schedule: ScheduleItem[];
  matches?: MatchItem[];
  siteSettings?: SiteLayoutSettings;
  poll?: PollData;
  registeredUsers?: UserProfile[];
}
