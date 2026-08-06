import { CMSData, Comment, NotificationItem, UserProfile, SiteLayoutSettings, PollData } from '../types';

export const YEMEN4_LOGO_URL = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhjwI0VwFD260hw2q-gGfbRq0AE0uv_9wbenkGCQCSZWPij90Nc0uf5ZQNK7uqTaQlTNiUya46dR2arzNeeAVtemoAb4kW2GT5zmxnjmAJT-hqdCjpZztryFXkQ2cQsFfUcQWcqP8cj0hdjA1rCjreIqs_NNEq62n8l6KqpcT2co_cFHNYU1GVgcVh0zqI/s320/%D9%A2%D9%A0%D9%A2%D9%A6%D9%A0%D9%A7%D9%A2%D9%A3_%D9%A2%D9%A1%D9%A1%D9%A0%D9%A1%D9%A4.png';
export const DEFAULT_LIVE_POSTER_URL = 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimSIfH3K4jgAbw52ZQDYBhg3prQb0Ve0vdvorl8lU1jz_HRnx8jt-gK-5914WpT9BeTzquGzkvAKw5bmP99z60RibJr_A1koD_vAJc2CjJcALcbJ_CZ3uDjWksbZP54t7XOAMIGbYbgkcSYUANwES8RivlLP2xobeIYK-_jyku9UdOo8IEP2wNY2Z4j0w/s1402/file_00000000df9081fdb3570f5dd351d53a.png';

export const initialRegisteredUsers: UserProfile[] = [
  {
    id: 'usr-admin-1',
    name: 'رئيس الإدارة والتحرير',
    email: 'kaiandawoud@gmail.com',
    password: '738104363',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'رئيس مجلس الإدارة والتحرير لشبكة قناة يمن 4 HD',
    savedArticles: ['art-1'],
    joinedDate: 'يناير 2024',
    role: 'admin',
    isAdmin: true,
    permissions: {
      canAddArticles: true,
      canEditArticles: true,
      canDeleteArticles: true,
      canManageTicker: true,
      canManageMatches: true,
      canManageLiveStream: true,
      canManageLayout: true,
      canManageCurrencies: true
    }
  },
  {
    id: 'usr-editor-1',
    name: 'أحمد الحاج',
    email: 'ahmed.haj@yemen4.tv',
    password: 'editor123456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'محرر الشؤون السياسية والميدانية في قناة يمن 4',
    savedArticles: ['art-2'],
    joinedDate: 'مارس 2024',
    role: 'editor',
    isAdmin: false,
    permissions: {
      canAddArticles: true,
      canEditArticles: true,
      canDeleteArticles: false,
      canManageTicker: true,
      canManageMatches: true,
      canManageLiveStream: false,
      canManageLayout: false,
      canManageCurrencies: false
    }
  },
  {
    id: 'usr-user-1',
    name: 'مواطن يمني',
    email: 'yemeni.user@yemen4.tv',
    password: 'user123456',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'متابع مهتم بالشؤون السياسية والإقليمية والرياضة اليمنية.',
    savedArticles: ['art-1', 'art-4'],
    joinedDate: 'يناير 2025',
    role: 'user',
    isAdmin: false
  }
];

export const initialCMSData: CMSData = {
  registeredUsers: initialRegisteredUsers,
  tickerText: [
    'الحكومة اليمنية تعلن استهداف سفينتين نفتيتين سعوديتين تثبيتاً لمعادلة الحصار بالحصار ورداً على استمرار الحصار المفروض على الشعب اليمني',
    'عاجل: اجتماع رئاسي موسع في العاصمة صنعاء لمناقشة التطورات الأجهزة التنفيذية والأوضاع الميدانية',
    'ارتفاع أسعار النفط عالمياً وتجاوز برميل برنت حاجز 90 دولاراً وسط تحذيرات من اضطراب إمدادات الطاقة العالمية',
    'منتخب اليمن يستعد لخوض المواجهة الحاسمة للتأهل إلى نهائيات كأس آسيا 2027 وسط دعم جماهيري واسع'
  ],
  liveStreamUrl: 'https://www.youtube.com/embed/live_stream?channel=UCyemen4tv_official',
  liveStreamPosterUrl: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEimSIfH3K4jgAbw52ZQDYBhg3prQb0Ve0vdvorl8lU1jz_HRnx8jt-gK-5914WpT9BeTzquGzkvAKw5bmP99z60RibJr_A1koD_vAJc2CjJcALcbJ_CZ3uDjWksbZP54t7XOAMIGbYbgkcSYUANwES8RivlLP2xobeIYK-_jyku9UdOo8IEP2wNY2Z4j0w/s1402/file_00000000df9081fdb3570f5dd351d53a.png',
  radioStreamUrl: 'https://stream.zeno.fm/f3v6288y88ruv',
  liveViewersCount: 125430,
  isLiveNow: true,
  articles: [
    {
      id: 'art-1',
      title: 'الحكومة اليمنية تعلن استهداف سفينتين نفتيتين سعوديتين تثبيتاً لمعادلة الحصار بالحصار',
      excerpt: 'تثبيتاً لمعادلة الحصار بالحصار ورداً على استمرار الحصار المفروض على الشعب اليمني، أعلنت القوات المسلحة تنفيذ عملية عسكرية نوعية استهدفت سفينتين نفطيتين.',
      content: `في بيان عسكري هام أذيع عبر التلفزيون الرسمي قناة يمن 4 HD، أعلنت القوات المسلحة اليمنية عن تنفيذ عملية عسكرية نوعية في البحر الأحمر، استهدفت سفينتين نفطيتين سعوديتين.

وأكد المتحدث العسكري أن هذه العملية تأتي تثبيتاً لمعادلة "الحصار بالحصار"، ورداً مشروعاً على استمرار الحصار البحري والجوي المفروض على الشعب اليمني ومنع دخول المشتقات النفطية والسفن التجارية.

واستعرض البيان التفاصيل الميدانية للعملية التي تم استخدام مسيرات وبحرية ذاتية الحركة، مؤكداً استمرار هذه العمليات حتى رفع الحصار بالكامل والسماح بدخول كافة الاحتياجات الأساسية للجمهورية اليمنية.

وقد أثارت العملية ردود أفعال دولية وإقليمية واضحة، فيما خرجت مسيرات جماهيرية حاشدة في عدد من المحافظات اليمنية تأييداً للقرارات الوطنية والسيادية.`,
      category: 'خبر اليوم',
      categoryColor: 'bg-red-600',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ ساعتين',
      viewsCount: 125430,
      isHero: true,
      isBreaking: true,
      author: {
        name: 'أحمد الحاج',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: 'محرر الشؤون السياسية'
      },
      tags: ['اليمن', 'البحر الأحمر', 'بيان عسكري', 'أخبار عاجلة', 'صنعاء']
    },
    {
      id: 'art-2',
      title: 'مجلس القيادة الرئاسي يعقد اجتماعاً موسعاً لمناقشة المستجدات',
      excerpt: 'استعراض التقرير المالي والاقتصادي والإصلاحات الهيكلية في مؤسسات الدولة وتأمين الخدمات العامة للواطنين.',
      content: `عقد مجلس القيادة الرئاسي اجتماعاً رفيع المستوى صباح اليوم لمناقشة مجمل التطورات السياسية والاقتصادية والأمنية على الساحة الوطنية.

وتطرق الاجتماع إلى تقييم مستوى تنفيذ القرارات السابقة المتعلقة بتعزيز الاستقرار الاقتصادي وتحسين سعر صرف العملة الوطنية، بالإضافة إلى آليات دعم المشروعات الخدمية والتنموية في المحافظات.

كما شدد الاجتماع على أهمية رفع كفاءة الأداء الإداري والمالي وتذليل العقبات أمام تدفق المواد الأساسية والسلع التموينية للمواطنين.`,
      category: 'سياسة',
      categoryColor: 'bg-blue-600',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 35 دقيقة',
      viewsCount: 12450,
      author: {
        name: 'محمد البهري',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        role: 'محلل سياسي'
      },
      tags: ['سياسة', 'مجلس القيادة', 'صنعاء', 'حكومة']
    },
    {
      id: 'art-3',
      title: 'ارتفاع أسعار النفط عالمياً تجاوز 90 دولاراً للبرميل',
      excerpt: 'ارتفاع حاد في أسواق النفط العالمية متأثرة بالتوترات الجيوسياسية وتوقعات انخفاض المخزونات العالمية.',
      content: `شهدت أسعار خام برنت اليوم قفزة قياسية متجاوزة حاجز 90 دولاراً للبرميل، وذلك نتيجة المخاوف المستمرة من اضطراب سلاسل التوريد في خطوط الملاحة البحرية الدولية.

وأفاد خبراء الاقتصاد أن هذه الارتفاعات ستؤثر مباشرة على أسعار الطاقة العالمية والمشتقات النفطية في أسواق الشرق الأوسط وشمال أفريقيا، مما يتطلب معالجات اقتصادية عاجلة.`,
      category: 'اقتصاد',
      categoryColor: 'bg-emerald-600',
      imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ ساعة',
      viewsCount: 9850,
      author: {
        name: 'ناصر الطويل',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        role: 'محرر الاقتصاد'
      },
      tags: ['اقتصاد', 'النفط', 'خام برنت', 'الطاقة']
    },
    {
      id: 'art-4',
      title: 'منتخب اليمن يتأهل لنهائيات كأس آسيا 2027',
      excerpt: 'إنجاز رياضي تاريخي جديد للكرة اليمنية بعد أداء بطولي وفوز مستحق في التصفيات الآسيوية.',
      content: `حقق المنتخب الوطني اليمني لكرة القدم إنجازاً تاريخياً بتأهله الرسمي إلى نهائيات كأس آسيا 2027 المقررة إقامتها قريباً، عقب فوزه الثمين في المباراة الحاسمة.

وعمت الأفراح مختلف الشوارع والمحافظات اليمنية احتفاءً بهذا الفوز الرياضي الذي رسم البسمة على وجوه الملايين وأعاد الثقة للرياضة اليمنية.`,
      category: 'رياضة',
      categoryColor: 'bg-amber-600',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ ساعتين',
      viewsCount: 15320,
      author: {
        name: 'علي العنسي',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        role: 'محرر الرياضة'
      },
      tags: ['رياضة', 'منتخب اليمن', 'كأس آسيا', 'كرة القدم']
    },
    {
      id: 'art-5',
      title: 'الذكاء الاصطناعي في خدمة التعليم في اليمن',
      excerpt: 'مبادرات جديدة لإدخال تقنيات الذكاء الاصطناعي في المناهج والمدارس والمؤسسات التعليمية اليمنية.',
      content: `أطلقت وزارة التربية والتعليم بالتعاون مع مراكز التقنية الوطنية مبادرة طموحة لدمج تطبيقات الذكاء الاصطناعي في العملية التعليمية، وتأهيل الكوادر التدريسية للتعامل مع أدوات التعلم الذكي الحديثة.`,
      category: 'تكنولوجيا',
      categoryColor: 'bg-purple-600',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 4 ساعات',
      viewsCount: 7640,
      author: {
        name: 'د. سامي المتوكل',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=120&q=80',
        role: 'مستشار التقنية'
      },
      tags: ['تكنولوجيا', 'ذكاء اصطناعي', 'تعليم', 'ابتكار']
    },
    {
      id: 'art-6',
      title: 'مشاريع تنموية جديدة في عدة محافظات يمنية',
      excerpt: 'تدشين حزمة من المشاريع الخدمية في مجالات المياه والكهرباء والطرقات لخدمة الآلاف من السكان.',
      content: `شهدت محافظات إب، ذمار، والحديدة افتتاح وتدشين عدد من المشاريع التنموية الحيوية في قطاعات المياه والصحة والتعليم بتمويل محلي ودعم إنساني، بهدف رفع معاناة المواطنين وتحسين البنية التحتية.`,
      category: 'المحافظات',
      categoryColor: 'bg-cyan-600',
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 5 ساعات',
      viewsCount: 53640,
      author: {
        name: 'صالح العولقي',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
        role: 'مراسلو المحافظات'
      },
      tags: ['المحافظات', 'تنمية', 'خدمات', 'اليمن']
    },

    // ===== قسم محلي =====
    {
      id: 'art-local-1',
      title: 'تدشين المرحلة الأولى من مشروع إعادة تأهيل خط صنعاء - الحديدة الشرياني',
      excerpt: 'تدشين مشروع صيانة وتأهيل الطريق الرئيسي بتمويل من المؤسسة العامة للطرق والجسور لسهولة الحركة التجارية.',
      content: `دشنت وزارة الأشغال العامة والمؤسسة العامة للطرق والجسور اليوم، المرحلة الأولى من مشروع ترميم وسفلتة الخط الاستراتيجي الشرياني الرابط بين العاصمة صنعاء ومحافظة الحديدة.
وأوضح المهندسون المشرفون أن المشروع يشمل معالجة الانهيارات الصخرية، وبناء المصدات الخرسانية، وتعبيد المقاطع المتضررة بأسفلت عالي الجودة لرفع السلامة المرورية وتسهيل حركة شاحنات البضائع والمنتجات الزراعية.`,
      category: 'محلي',
      categoryColor: 'bg-red-600',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ ساعتين',
      viewsCount: 18450,
      author: {
        name: 'يحيى الكبسي',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        role: 'مراسل المحليات'
      },
      tags: ['محلي', 'صنعاء', 'الحديدة', 'مشاريع', 'طرقات']
    },
    {
      id: 'art-local-2',
      title: 'محافظة تعز تشهد حملة نظافة شاملة وتحسين البنية التحتية للمدينة',
      excerpt: 'حملة مجتمعية ورسمية واسعة لرفع المخلفات وتحسين المظهر الحضاري بمدينة تعز.',
      content: `انطلقت في محافظة تعز حملة نظافة وتجميل واسعة شارك فيها المئات من المواطنين إلى جانب عمال صندوق النظافة والتحسين، بهدف رفع المخلفات وتشجير الشوارع الرئيسية ونظافة الأسواق العامة.`,
      category: 'محلي',
      categoryColor: 'bg-red-600',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 3 ساعات',
      viewsCount: 14200,
      author: {
        name: 'جمال الصبري',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        role: 'مراسل تعز'
      },
      tags: ['محلي', 'تعز', 'نظافة', 'بيئة']
    },
    {
      id: 'art-local-3',
      title: 'افتتاح معرض المنتجات الزراعية والمحاصيل الوطنية في قاع جهران بذمار',
      excerpt: 'استعراض المحاصيل الوطنية من الخضار والفاكهة والبن اليمني الأصيل بمشاركة مئات المزارعين.',
      content: `افتتح محافظ ذمار وقيادات قطاع الزراعة المعرض السنوي للمنتجات والمحاصيل الزراعية الوطنية في منطقة قاع جهران، للترويج للمنتج المحلي وتحقيق الاكتفاء الذاتي في الحبوب والفاكهة.`,
      category: 'محلي',
      categoryColor: 'bg-red-600',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 5 ساعات',
      viewsCount: 11900,
      author: {
        name: 'عبدالله الذماري',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        role: 'مراسل ذمار'
      },
      tags: ['محلي', 'ذمار', 'زراعة', 'منتج محلي']
    },

    // ===== قسم دولي =====
    {
      id: 'art-intl-1',
      title: 'الأمم المتحدة تعقد جلسة طارئة حول الأمن والملاحة الدولية في البحر الأحمر',
      excerpt: 'جلسة مغلقة لمجلس الأمن لاستعراض التطورات في خطوط الملاحة البحرية الدولية والدعوة للتهدئة.',
      content: `عقد مجلس الأمن الدولي في نيويورك جلسة مشاورات طارئة لمناقشة التداعيات الإقليمية والدولية للأحداث في البحر الأحمر ومضيق باب المندب.
وشدد المبعوث الأممي في إحاطته على ضرورة إيجاد حلول سياسية جذريّة، ومعالجة الأسباب الرئيسية المسببة للتوترات الإقليمية في المنطقة.`,
      category: 'دولي',
      categoryColor: 'bg-sky-600',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ ساعة',
      viewsCount: 24300,
      author: {
        name: 'سارة خالد',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        role: 'محررة الشؤون الدولية'
      },
      tags: ['دولي', 'الأمم المتحدة', 'البحر الأحمر', 'نيويورك']
    },
    {
      id: 'art-intl-2',
      title: 'محادثات استراتيجية بين بكين وموسكو لبناء نظام اقتصادي متعدد الأقطاب',
      excerpt: 'توقيع اتفاقيات شراكة اقتصادية وتجارية لتعزيز التعامل بالعملات المحلية وتسهيل التبادل التجاري.',
      content: `عقد القادة في بكين وموسكو جلسة مباحثات موسعة تناولت تعزيز الشراكة الاستراتيجية بين البلدين في قطاعات الطاقة والتكنولوجيا والملاحة البرية والبحرية، وتفعيل آليات منظمة بريكس الاقتصادية.`,
      category: 'دولي',
      categoryColor: 'bg-sky-600',
      imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 3 ساعات',
      viewsCount: 19800,
      author: {
        name: 'فؤاد عبدالسلام',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        role: 'محلل العلاقات الدولية'
      },
      tags: ['دولي', 'الصين', 'روسيا', 'بريكس', 'اقتصاد']
    },
    {
      id: 'art-intl-3',
      title: 'ارتفاع حاد في التضخم وأسعار الطاقة بالمفوضية الأوروبية',
      excerpt: 'تحذيرات من انكماش النمو الاقتصادي في عدة دول أوروبية نتيجة تحولات إمدادات الغاز والنفط.',
      content: `أظهرت التقارير الاقتصادية الصادرة عن المركز الإحصائي الأوروبي تسجيل معدلات تضخم قياسية في عدة دول بالاتحاد الأوروبي، متأثرة بارتفاع تكاليف الشحن البحري والطاقة والتأمين.`,
      category: 'دولي',
      categoryColor: 'bg-sky-600',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 4 ساعات',
      viewsCount: 16200,
      author: {
        name: 'سارة خالد',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        role: 'محررة الشؤون الدولية'
      },
      tags: ['دولي', 'أوروبا', 'تضخم', 'اقتصاد']
    },

    // ===== قسم تقارير =====
    {
      id: 'art-rep-1',
      title: 'تحقيق خاص: كيف استعادت الزراعة اليمنية عافيتها رغم الحصار والتغير المناخي؟',
      excerpt: 'ملف متكامل يرصد تجارب المزارعين في استخدام الطاقة الشمسية والري الحديث للوصول للسيادة الغذائية.',
      content: `في هذا التحقيق الميداني الاستقصائي عبر مراسلي قناة يمن 4 HD، نغوص في أرياف المحافظات اليمنية لنكشف قصة نجاح المزارع اليمني في تحويل التحديات إلى فرص استثمارية زراعية واعدة.
من خلال الاعتماد على المنظومات الشمسية المستقلة، واستخدام شبكات التقطير الحديثة، استطاعت المزارع الوطنية زيادة إنتاجها من القمح والبطاطس والفاكهة بنسبة 35% مقارنة بالأعوام الماضية.`,
      category: 'تقارير',
      categoryColor: 'bg-amber-600',
      imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 4 ساعات',
      viewsCount: 31200,
      author: {
        name: 'صالح العولقي',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=120&q=80',
        role: 'وحدة التحقيقات الاستقصائية'
      },
      tags: ['تقارير', 'تحقيق', 'زراعة', 'استقصاء', 'اليمن']
    },
    {
      id: 'art-rep-2',
      title: 'أسرار الملاحة عند مضيق باب المندب: خريطة التوازنات والسيطرة البحرية',
      excerpt: 'قراءة جغرافية وعسكرية وثائقية تشرح الأهمية الاستراتيجية لأهم الممرات المائية بالعالم.',
      content: `يمثل مضيق باب المندب الشريان الحيوي الحاكم لحركة التجارة العالمية بين الشرق والغرب. يستعرض هذا التقرير الوثائقي خرائط التفوق الميداني، والتسليح البحري الجديد، والسيطرة السيادية للجمهورية اليمنية على مياهها الإقليمية.`,
      category: 'تقارير',
      categoryColor: 'bg-amber-600',
      imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 6 ساعات',
      viewsCount: 28900,
      author: {
        name: 'أحمد الحاج',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: 'كبير المحررين'
      },
      tags: ['تقارير', 'باب المندب', 'البحر الأحمر', 'تحليل']
    },

    // ===== قسم كتابات =====
    {
      id: 'art-op-1',
      title: 'معادلة السيادة الوطنية واستحقاقات المرحلة التنموية القادمة',
      excerpt: 'رؤية فكرية وسياسية حول كيفية تحويل الانتصارات العسكرية إلى نهضة اقتصادية ومؤسسية شاملة.',
      content: `إن السيادة الوطنية ليست مجرد شعار يُرفع في المناسبات، بل هي بناء متكامل يرتكز على الأمن الاقتصادي، والاستقلال التمويني، وبناء مؤسسات الدولة الشفافة.
في هذه المقالة، نستعرض معالم الخطة الاستراتيجية للنهوض الشامل بالوطن ومؤسساته في المرحلة المقبلة.`,
      category: 'كتابات',
      categoryColor: 'bg-purple-600',
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ ساعتين',
      viewsCount: 21400,
      author: {
        name: 'د. عبدالرحمن الشامي',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        role: 'أستاذ العلوم السياسية'
      },
      tags: ['كتابات', 'مقالات', 'سيادة', 'سياسة', 'رأي']
    },
    {
      id: 'art-op-2',
      title: 'الإعلام المقاوم في عصر الحرب الرقمية وتزييف الوعي',
      excerpt: 'كيف يمكن للإعلام الوطني الصمود بوجه التضليل الإعلامي وصناعة السردية الحقيقية؟',
      content: `تخوض وسائل الإعلام الوطنية اليوم معركة لا تقل شراسة عن المعارك الميدانية، إنها معركة الوعي وصناعة الرأي العام الحقيقي الصادق المعبّر عن آمال وتضحيات الشعب اليمني.`,
      category: 'كتابات',
      categoryColor: 'bg-purple-600',
      imageUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 4 ساعات',
      viewsCount: 17800,
      author: {
        name: 'أ. أمل المؤيد',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
        role: 'كاتبة وباحثة إعلامية'
      },
      tags: ['كتابات', 'إعلام', 'وعي', 'وعي رقمي']
    },
    {
      id: 'art-op-3',
      title: 'الاستثمار في العقل اليمني: الذكاء الاصطناعي وبناء المستقبل',
      excerpt: 'الجيل الجديد من الشباب اليمني يمتلك الشغف التقني لصناعة الفارق في سوق العمل العالمي.',
      content: `على الرغم من ظروف الحرب والحصار، نلاحظ إقبالاً استثنائياً من الشباب اليمني نحو تعلم البرمجة والذكاء الاصطناعي وعلوم البيانات. هذا الاستثمار البرمجي هو النفط الجديد لليمن.`,
      category: 'كتابات',
      categoryColor: 'bg-purple-600',
      imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 5 ساعات',
      viewsCount: 15600,
      author: {
        name: 'م. هشام العماد',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        role: 'خبير التحول الرقمي'
      },
      tags: ['كتابات', 'تقنية', 'ذكاء اصطناعي', 'شباب']
    },

    // ===== قسم رياضة =====
    {
      id: 'art-sp-1',
      title: 'المنتخب الوطني يستكمل معسكره الخارجي استعداداً لمواجهات كأس آسيا 2027',
      excerpt: 'رفع الجاهزية البدنية والتكتيكية للاعبي الأحمر اليمني تحت قيادة الجهاز الفني الجديد.',
      content: `يواصل المنتخب الوطني اليمني لكرة القدم معسكره التدريبي المغلق المكثف، استعداداً لخوض الجولة الأولى من نهائيات كأس آسيا 2027.
وأشاد الجهاز الفني بإنضباط اللاعبين والمعنويات المرتفعة لمواصلة تشريف الكرة اليمنية وإسعاد الملايين من المشجعين.`,
      category: 'رياضة',
      categoryColor: 'bg-emerald-600',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ ساعتين',
      viewsCount: 22100,
      author: {
        name: 'علي العنسي',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        role: 'محرر الرياضة'
      },
      tags: ['رياضة', 'منتخب اليمن', 'كأس آسيا', 'كرة القدم']
    },
    {
      id: 'art-sp-2',
      title: 'نادي أهلي صنعاء يتوّج بطلاً لدوري الدرجة الأولى بعد مواجهة مثيرة',
      excerpt: 'حضور جماهيري غفير في ملعب المريسي بالثورة يتوج أهلي صنعاء بالدرع الممتاز.',
      content: `في احتفالية كروية بهيجة بملعب المريسي بالعاصمة صنعاء، حسم فريق أهلي صنعاء لقب الدوري اليمني الممتاز للكرة بعد فوزه المستحق بثنائية نظيفة وسط تفاعل جماهيري كبير.`,
      category: 'رياضة',
      categoryColor: 'bg-emerald-600',
      imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 4 ساعات',
      viewsCount: 19400,
      author: {
        name: 'علي العنسي',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        role: 'محرر الرياضة'
      },
      tags: ['رياضة', 'أهلي صنعاء', 'الدوري اليمني', 'صنعاء']
    },
    {
      id: 'art-sp-3',
      title: 'قمة نارية مرتقبة في نهائي دوري أبطال أوروبا على ملعب أليانز أرينا',
      excerpt: 'تغطية خاصة وتحليل تكتيكي لأبرز مواجهات الأبطال بين ريال مدريد وبايرن ميونخ.',
      content: `تتجه أنظار عشاق الساحرة المستديرة في كافة أنحاء العالم مساء اليوم نحو الملعب الأسطوري في ميونخ لمتابعة الصراع الأوروبي الشرس لحصد لقب دوري أبطال أوروبا.`,
      category: 'رياضة',
      categoryColor: 'bg-emerald-600',
      imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      publishDate: '25 مايو 2025',
      timeAgo: 'منذ 5 ساعات',
      viewsCount: 17200,
      author: {
        name: 'علي العنسي',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
        role: 'محرر الرياضة'
      },
      tags: ['رياضة', 'دوري أبطال أوروبا', 'كرة قدم عالمية']
    },
  ],
  programs: [
    {
      id: 'prog-1',
      title: 'اليمن اليوم',
      host: 'أحمد الحاج',
      hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      airTime: 'السبت - الخميس | 07:00 مساءً',
      description: 'برنامج إخباري تحليلي يومي يتناول أبرز الأحداث والملفات الحارقة على الساحة اليمنية والإقليمية.',
      category: 'إخباري'
    },
    {
      id: 'prog-2',
      title: 'في دائرة الحدث',
      host: 'محمد البهري',
      hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      airTime: 'السبت - الخميس | 09:00 مساءً',
      description: 'حوارات ساخنة ومواجهات مع قادة الرأي والسياسيين والمحللين لتفكيك المشهد الوطني.',
      category: 'حواري'
    },
    {
      id: 'prog-3',
      title: 'منوعات إخبارية',
      host: 'علي العنسي',
      hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      airTime: 'السبت - الأربعاء | 06:00 مساءً',
      description: 'جولة شاملة بين طيات الصحف والشبكات الاجتماعية والتقارير الميدانية الخفيفة والمتنوعة.',
      category: 'منوعات'
    },
    {
      id: 'prog-4',
      title: 'اقتصاد اليمن',
      host: 'ناصر الطويل',
      hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      airTime: 'الأحد - الثلاثاء | 08:00 مساءً',
      description: 'قراءة متعمقة في مؤشرات السوق، أسعار العملات والسلع، وفرص التنمية والاستثمار.',
      category: 'اقتصادي'
    }
  ],
  currencies: [
    { currency: 'دولار أمريكي', code: 'USD', buyRate: 2475, sellRate: 2490, change: 0.12, flag: '🇺🇸' },
    { currency: 'ريال سعودي', code: 'SAR', buyRate: 668, sellRate: 672, change: 0.10, flag: '🇸🇦' },
    { currency: 'يورو أوروبي', code: 'EUR', buyRate: 2740, sellRate: 2765, change: -0.05, flag: '🇪🇺' },
    { currency: 'جنيه مصري', code: 'EGP', buyRate: 48, sellRate: 51, change: -0.08, flag: '🇪🇬' }
  ],
  weather: {
    city: 'صنعاء',
    temp: 28,
    condition: 'غائم جزئياً',
    humidity: 45,
    windSpeed: '12 كم/س',
    direction: 'شمالية غربية',
    forecast: [
      { day: 'الخميس', tempHigh: 30, tempLow: 18, condition: 'مشمس' },
      { day: 'الأربعاء', tempHigh: 31, tempLow: 19, condition: 'غائم جزئياً' },
      { day: 'الثلاثاء', tempHigh: 32, tempLow: 20, condition: 'مشمس' },
      { day: 'الإثنين', tempHigh: 29, tempLow: 17, condition: 'أمطار خفيفة' },
      { day: 'الأحد', tempHigh: 28, tempLow: 16, condition: 'غائم جزئياً' }
    ]
  },
  photos: [
    { id: 'p1', url: 'https://images.unsplash.com/photo-1578895210405-907db48a7111?auto=format&fit=crop&w=800&q=80', caption: 'مناظر طبيعية خلابة من جبال حراز اليمنية' },
    { id: 'p2', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', caption: 'العاصمة صنعاء التاريخية والشارع العام' },
    { id: 'p3', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', caption: 'ميناء الحديدة وحركة الملاحة البحرية' },
    { id: 'p4', url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80', caption: 'أسواق صنعاء القديمة والصناعات الحرفية' }
  ],
  videos: [
    { id: 'v1', title: 'عملية نوعية للقوات المسلحة وتغطية حصرية من البحر الأحمر', duration: '03:45', views: '124,200', thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80', videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCyemen4tv_official', category: 'أخبار عاجلة', publishDate: 'منذ ساعتين', description: 'تغطية ميدانية خاصة ومباشرة لتطورات الأحداث العسكرية وتداعياتها الإقليمية عبر شاشة يمن 4 HD.', likesCount: 4520 },
    { id: 'v2', title: 'اجتماع مجلس الوزراء لمناقشة الخطة التنموية الشاملة وتطوير الخدمات', duration: '05:15', views: '45,300', thumbnail: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80', videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCyemen4tv_official', category: 'سياسة', publishDate: 'منذ 5 ساعات', description: 'تقرير إخباري حول القرارات الأخيرة المتخذة في الجلسة الاستثنائية لمجلس الوزراء.', likesCount: 1890 },
    { id: 'v3', title: 'تقرير خاص: ارتفاع أسعار النفط عالمياً وتداعياته على السوق المحلي', duration: '04:10', views: '29,550', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80', videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCyemen4tv_official', category: 'اقتصاد', publishDate: 'منذ يوم', description: 'قراءة في المؤشرات الماليّة وتحليل اقتصادي شامل مع خبراء وسوق الطاقة.', likesCount: 940 },
    { id: 'v4', title: 'ملخص الأهداف والمباراة الحاسمة لمنتخب اليمن وتأهله لنهائيات آسيا 2027', duration: '08:20', views: '185,320', thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80', videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCyemen4tv_official', category: 'رياضة', publishDate: 'منذ يومين', description: 'أبرز لحظات المباراة وفرحة الجماهير اليمنية بالتأهل التاريخي لبطولة كأس آسيا.', likesCount: 12400 },
    { id: 'v5', title: 'حلقة كاملة: برنامج في دائرة الحدث - حوار حول المستقبل السياسي', duration: '45:00', views: '67,100', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80', videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCyemen4tv_official', category: 'برامج حوارية', publishDate: 'منذ 3 أيام', description: 'حوار مفتوح مع محللين وسياسيين بارزين لمناقشة السيناريوهات القادمة.', likesCount: 3120 },
    { id: 'v6', title: 'وثائقي: معالم اليمن التاريخية وأسرار معممار صنعاء القديمة', duration: '22:15', views: '98,400', thumbnail: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80', videoUrl: 'https://www.youtube.com/embed/live_stream?channel=UCyemen4tv_official', category: 'وثائقيات', publishDate: 'منذ 4 أيام', description: 'جولة سياحية وثائقية تحبس الأنفاس بين الأزقة القديمة والمباني الأثرية في اليمن.', likesCount: 5600 }
  ],
  schedule: [
    {
      id: 'sch-1',
      programId: 'prog-0',
      title: 'صباح يمني جديد',
      host: 'منى المطري',
      hostImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      startTime: '07:00',
      endTime: '09:00',
      day: 'اليوم',
      category: 'صباحي / منوعات',
      description: 'إشراقة صباحية تتناول الأخبار الخفيفة، الطقس، النصائح الصحية والتقارير الميدانية من مختلف المحافظات.',
      isLiveNow: false,
      progressPercentage: 100,
      episodeTitle: 'فقرة التراث والابتكارات الشبابية'
    },
    {
      id: 'sch-2',
      programId: 'prog-3',
      title: 'منوعات إخبارية',
      host: 'علي العنسي',
      hostImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
      startTime: '10:00',
      endTime: '12:00',
      day: 'اليوم',
      category: 'منوعات',
      description: 'جولة شاملة بين طيات الصحف والشبكات الاجتماعية والتقارير الميدانية الخفيفة والمتنوعة.',
      isLiveNow: false,
      progressPercentage: 100,
      episodeTitle: 'أبرز ما تداوله الشارع اليمني هذا الأسبوع'
    },
    {
      id: 'sch-3',
      programId: 'prog-news1',
      title: 'النشرة الإخبارية الرئيسية',
      host: 'فريق الأخبار',
      hostImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300&q=80',
      startTime: '13:00',
      endTime: '14:30',
      day: 'اليوم',
      category: 'إخباري',
      description: 'عرض موجز وشامل لآخر المستجدات الوطنية والإقليمية والدولية مع مراسلينا في الميدان.',
      isLiveNow: false,
      progressPercentage: 100,
      episodeTitle: 'نشرة الظهيرة'
    },
    {
      id: 'sch-4',
      programId: 'prog-4',
      title: 'اقتصاد اليمن',
      host: 'ناصر الطويل',
      hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      startTime: '15:00',
      endTime: '16:30',
      day: 'اليوم',
      category: 'اقتصادي',
      description: 'قراءة متعمقة في مؤشرات السوق، أسعار العملات والسلع، وفرص التنمية والاستثمار.',
      isLiveNow: false,
      progressPercentage: 100,
      episodeTitle: 'تأثير التغيرات العالمية على أسعار المشتقات'
    },
    {
      id: 'sch-5',
      programId: 'prog-1',
      title: 'اليمن اليوم - تغطية حية',
      host: 'أحمد الحاج',
      hostImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      startTime: '17:00',
      endTime: '19:00',
      day: 'اليوم',
      category: 'إخباري',
      description: 'برنامج إخباري تحليلي يومي يتناول أبرز الأحداث والملفات الحارقة على الساحة اليمنية والإقليمية.',
      isLiveNow: false,
      progressPercentage: 100,
      episodeTitle: 'متابعة ميدانية لتطورات البحر الأحمر'
    },
    {
      id: 'sch-6',
      programId: 'prog-2',
      title: 'في دائرة الحدث (مباشر الآن)',
      host: 'محمد البهري',
      hostImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      startTime: '21:00',
      endTime: '23:00',
      day: 'اليوم',
      category: 'حواري / سياسي',
      description: 'حوارات ساخنة ومواجهات مع قادة الرأي والسياسيين والمحللين لتفكيك المشهد الوطني.',
      isLiveNow: true,
      progressPercentage: 68,
      guestName: 'د. خالد الحُديدي - خبير العلاقات الدولية',
      episodeTitle: 'معادلة الحصار بالحصار والتأثيرات الإقليمية'
    },
    {
      id: 'sch-7',
      programId: 'prog-sports',
      title: 'صدى الجماهير والرياضة',
      host: 'عبدالله السعدي',
      hostImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      startTime: '23:30',
      endTime: '01:00',
      day: 'اليوم',
      category: 'رياضة',
      description: 'تغطية متكاملة لنتائج الدوري اليمني ومشاركات المنتخبات الوطنية والرياضة العربية.',
      isLiveNow: false,
      progressPercentage: 0,
      episodeTitle: 'استعدادات المنتخب الوطني لنهائيات آسيا'
    }
  ],
  matches: [
    {
      id: 'm-1',
      homeTeam: 'اليمن',
      homeLogo: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=120&q=80',
      homeScore: 2,
      awayTeam: 'فيتنام',
      awayLogo: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=120&q=80',
      awayScore: 1,
      tournament: 'تصفيات كأس آسيا 2027',
      date: 'اليوم',
      time: '18:00',
      status: 'live',
      minute: "68'",
      channel: 'يمن 4 HD',
      stadium: 'ملعب المريسي - صنعاء'
    },
    {
      id: 'm-2',
      homeTeam: 'أهلي صنعاء',
      homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      homeScore: 0,
      awayTeam: 'وحدة صنعاء',
      awayLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=120&q=80',
      awayScore: 0,
      tournament: 'الدوري اليمني الممتاز',
      date: 'اليوم',
      time: '20:30',
      status: 'upcoming',
      channel: 'يمن 4 HD',
      stadium: 'ملعب الظرافي - صنعاء'
    },
    {
      id: 'm-3',
      homeTeam: 'ريال مدريد',
      homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      homeScore: 0,
      awayTeam: 'بايرن ميونخ',
      awayLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=120&q=80',
      awayScore: 0,
      tournament: 'دوري أبطال أوروبا',
      date: 'اليوم',
      time: '22:00',
      status: 'upcoming',
      channel: 'beIN Sports HD1',
      stadium: 'ملعب سانتياغو برنابيو'
    },
    {
      id: 'm-4',
      homeTeam: 'شعب إب',
      homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      homeScore: 3,
      awayTeam: 'فحمان أبين',
      awayLogo: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=120&q=80',
      awayScore: 1,
      tournament: 'الدوري اليمني الممتاز',
      date: 'الأمس',
      time: '16:00',
      status: 'finished',
      channel: 'يمن 4 HD',
      stadium: 'استاد 22 مايو - إب'
    },
    {
      id: 'm-5',
      homeTeam: 'برشلونة',
      homeLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&q=80',
      homeScore: 2,
      awayTeam: 'أتلتيكو مدريد',
      awayLogo: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=120&q=80',
      awayScore: 0,
      tournament: 'الدوري الإسباني',
      date: 'الأمس',
      time: '23:00',
      status: 'finished',
      channel: 'beIN Sports HD3',
      stadium: 'ملعب سبوتيفاي كامب نو'
    }
  ]
};

export const initialComments: Record<string, Comment[]> = {
  'art-1': [
    {
      id: 'c1',
      articleId: 'art-1',
      userName: 'المهندس عبدالكريم صنعائي',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      text: 'موقف شجاع ويعبر عن تطلعات الشعب اليمني في رفع الحصار الجائر وتنفيذ حقوقنا الوطنية.',
      timestamp: 'منذ ساعة',
      likes: 42,
      replies: [
        {
          id: 'c1-1',
          articleId: 'art-1',
          userName: 'سارة العدنية',
          userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80',
          text: 'بالفعل السلام الحقيقي يبدأ بالعدالة ورفع الحصار الكلي عن شعبنا.',
          timestamp: 'منذ 30 دقيقة',
          likes: 18
        }
      ]
    },
    {
      id: 'c2',
      articleId: 'art-1',
      userName: 'د. خالد الحُديدي',
      userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=100&q=80',
      text: 'متابعة مستمرة عبر قناة يمن 4 التغطية احترافية وسريعة جداً شكراً لكادر القناة.',
      timestamp: 'منذ ساعتين',
      likes: 29
    }
  ]
};

export const initialSiteSettings: SiteLayoutSettings = {
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
    sectionHeaderColor: '#ef4444',
    sectionTitleSize: 'text-xl',
    bodyTextSize: 'text-sm',
    containerPadding: 'p-4',
    sectionSpacing: 'py-6',
    cardShadow: 'shadow-xl'
};

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'خبر عاجل',
    message: 'الحكومة اليمنية تعلن استهداف سفينتين نفطيتين في البحر الأحمر.',
    time: 'منذ 10 دقائق',
    type: 'breaking',
    isRead: false,
    linkArticleId: 'art-1'
  },
  {
    id: 'n2',
    title: 'بث مباشر الآن',
    message: 'بدأت التغطية الحية لبرنامج "في دائرة الحدث" مع محمد البهري.',
    time: 'منذ 30 دقيقة',
    type: 'live',
    isRead: false
  },
  {
    id: 'n3',
    title: 'تفاعل جديد',
    message: 'قام سارة العدنية بالرد على تعليقك في خبر اليوم.',
    time: 'منذ ساعة',
    type: 'comment',
    isRead: true,
    linkArticleId: 'art-1'
  }
];

export const defaultUserProfile: UserProfile = {
  id: 'usr-101',
  name: 'مواطن يمني',
  email: 'yemeni.user@yemen4.tv',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  bio: 'متابع مهتم بالشؤون السياسية والإقليمية والرياضة اليمنية.',
  savedArticles: ['art-1', 'art-4'],
  joinedDate: 'يناير 2025',
  role: 'editor'
};

export const initialPollData: PollData = {
  id: 'poll-1',
  question: 'كيف تقيم تغطية قناة يمن 4 HD للأحداث والتطورات الوطنية والإقليمية؟',
  totalVotes: 18420,
  options: [
    { id: 0, label: 'ممتازة واحترافية جداً', votes: 12150, percent: 66 },
    { id: 1, label: 'جيدة جداً ومتابعة أولاً بأول', votes: 4230, percent: 23 },
    { id: 2, label: 'متوسطة وتحتاج للمزيد من الميدانيات', votes: 1420, percent: 8 },
    { id: 3, label: 'ضعيفة', votes: 620, percent: 3 }
  ]
};
