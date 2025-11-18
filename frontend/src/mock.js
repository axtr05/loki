// Mock data for initial development
export const mockUser = {
  id: 'user_1',
  username: 'LearnMaster',
  email: 'user@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LearnMaster',
  level: 5,
  xp: 2340,
  xpToNextLevel: 3000,
  points: 1250,
  streak: 7,
  totalStudyTime: 24.5, // hours
  joinDate: '2025-01-01',
  lastLoginDate: new Date().toISOString().split('T')[0]
};

export const mockEbooks = [
  {
    id: 'book_1',
    title: 'Introduction to JavaScript',
    author: 'John Doe',
    category: 'Programming',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    description: 'Learn the fundamentals of JavaScript programming',
    pages: 250,
    readProgress: 45,
    lastRead: '2025-01-15',
    tags: ['javascript', 'programming', 'web development']
  },
  {
    id: 'book_2',
    title: 'Machine Learning Basics',
    author: 'Jane Smith',
    category: 'AI & ML',
    cover: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400',
    description: 'Understanding machine learning concepts',
    pages: 320,
    readProgress: 20,
    lastRead: '2025-01-10',
    tags: ['machine learning', 'AI', 'data science']
  },
  {
    id: 'book_3',
    title: 'Design Patterns',
    author: 'Bob Johnson',
    category: 'Software Engineering',
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400',
    description: 'Common design patterns in software development',
    pages: 180,
    readProgress: 0,
    lastRead: null,
    tags: ['design patterns', 'software', 'architecture']
  }
];

export const mockAchievements = [
  {
    id: 'ach_1',
    title: 'First Steps',
    description: 'Complete your first reading session',
    icon: 'BookOpen',
    unlocked: true,
    unlockedDate: '2025-01-02',
    xpReward: 50
  },
  {
    id: 'ach_2',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'Flame',
    unlocked: true,
    unlockedDate: '2025-01-15',
    xpReward: 200
  },
  {
    id: 'ach_3',
    title: 'Knowledge Seeker',
    description: 'Read 10 different ebooks',
    icon: 'Trophy',
    unlocked: false,
    xpReward: 300
  },
  {
    id: 'ach_4',
    title: 'Speed Reader',
    description: 'Complete a book in one day',
    icon: 'Zap',
    unlocked: false,
    xpReward: 150
  },
  {
    id: 'ach_5',
    title: 'AI Companion',
    description: 'Have 50 conversations with AI',
    icon: 'Bot',
    unlocked: false,
    xpReward: 250
  }
];

export const mockLeaderboard = [
  { rank: 1, username: 'ProLearner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProLearner', xp: 8500, level: 12 },
  { rank: 2, username: 'StudyMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StudyMaster', xp: 7200, level: 11 },
  { rank: 3, username: 'BookWorm99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BookWorm99', xp: 6800, level: 10 },
  { rank: 4, username: 'LearnMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LearnMaster', xp: 2340, level: 5 },
  { rank: 5, username: 'QuizKing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=QuizKing', xp: 2100, level: 5 }
];

export const mockDailyChallenge = {
  id: 'challenge_1',
  title: 'Read for 30 minutes',
  description: 'Spend at least 30 minutes reading any ebook',
  progress: 15,
  target: 30,
  xpReward: 100,
  pointsReward: 50,
  completed: false,
  expiresAt: new Date(new Date().setHours(23, 59, 59)).toISOString()
};

export const mockFlashcards = [
  {
    id: 'card_1',
    front: 'What is JavaScript?',
    back: 'A high-level, interpreted programming language used primarily for web development',
    category: 'Programming',
    created: '2025-01-10'
  },
  {
    id: 'card_2',
    front: 'What is Machine Learning?',
    back: 'A subset of AI that enables systems to learn and improve from experience without being explicitly programmed',
    category: 'AI & ML',
    created: '2025-01-12'
  }
];

export const mockQuizzes = [
  {
    id: 'quiz_1',
    title: 'JavaScript Basics',
    questions: [
      {
        id: 'q1',
        question: 'What does var stand for?',
        options: ['Variable', 'Variant', 'Vary', 'Value'],
        correct: 0
      },
      {
        id: 'q2',
        question: 'Which symbol is used for comments?',
        options: ['#', '//', '/*', '<!--'],
        correct: 1
      }
    ],
    category: 'Programming',
    xpReward: 50
  }
];
