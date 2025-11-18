// Mock data for initial development
export const mockUser = {
  id: 'user_1',
  username: 'LearnMaster',
  email: 'user@example.com',
  avatar: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=400&fit=crop',
  level: 1,
  xp: 0,
  xpToNextLevel: 500,
  credits: 100, // Starting credits
  streak: 0,
  totalStudyTime: 0, // hours
  joinDate: new Date().toISOString().split('T')[0],
  lastLoginDate: new Date().toISOString().split('T')[0],
  isAdmin: false // Default users are not admin
};

export const mockEbooks = [
  {
    id: 'book_cpp',
    title: 'C++ Programming Complete Guide',
    author: 'Programming Experts',
    category: 'Programming',
    cover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
    description: 'Master C++ from basics to advanced concepts including operators, loops, functions, arrays, recursion, sorting algorithms, and more',
    pages: 450,
    readProgress: 0,
    lastRead: null,
    tags: ['c++', 'programming', 'oop'],
    price: 0, // Free book
    isPurchased: true,
    creditsReward: 0, // No credits for just reading - must complete quiz
    pdfUrl: 'cpp_workbook.pdf',
    hasQuiz: true,
    quizId: 'quiz_cpp_complete'
  },
  {
    id: 'book_python',
    title: 'Python for Beginners to Advanced',
    author: 'Python Mastery',
    category: 'Programming',
    cover: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    description: 'Complete Python guide covering fundamentals, data structures, web development, and data science',
    pages: 520,
    readProgress: 0,
    lastRead: null,
    tags: ['python', 'programming', 'data science'],
    price: 200, // Costs 200 credits
    isPurchased: false,
    creditsReward: 250
  },
  {
    id: 'book_java',
    title: 'Java Programming Masterclass',
    author: 'Java Institute',
    category: 'Programming',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    description: 'Comprehensive Java course from basics to enterprise applications, including Spring Boot',
    pages: 600,
    readProgress: 0,
    lastRead: null,
    tags: ['java', 'programming', 'spring'],
    price: 250,
    isPurchased: false,
    creditsReward: 300
  },
  {
    id: 'book_c',
    title: 'C Programming: The Complete Reference',
    author: 'System Programming',
    category: 'Programming',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    description: 'Learn C programming from scratch, perfect for system programming and embedded systems',
    pages: 400,
    readProgress: 0,
    lastRead: null,
    tags: ['c', 'programming', 'systems'],
    price: 150,
    isPurchased: false,
    creditsReward: 200
  },
  {
    id: 'book_javascript',
    title: 'Modern JavaScript Complete Course',
    author: 'Web Dev Pro',
    category: 'Programming',
    cover: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400',
    description: 'Master JavaScript ES6+, async programming, and modern frameworks',
    pages: 480,
    readProgress: 0,
    lastRead: null,
    tags: ['javascript', 'web development', 'frontend'],
    price: 180,
    isPurchased: false,
    creditsReward: 220
  }
];

export const mockAchievements = [
  {
    id: 'ach_1',
    title: 'First Steps',
    description: 'Complete your first reading session',
    icon: 'BookOpen',
    unlocked: false,
    xpReward: 50,
    creditsReward: 10
  },
  {
    id: 'ach_2',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'Flame',
    unlocked: false,
    xpReward: 200,
    creditsReward: 50
  },
  {
    id: 'ach_3',
    title: 'Knowledge Seeker',
    description: 'Complete 3 different ebooks',
    icon: 'Trophy',
    unlocked: false,
    xpReward: 300,
    creditsReward: 100
  },
  {
    id: 'ach_4',
    title: 'Speed Reader',
    description: 'Read 100 pages in one session',
    icon: 'Zap',
    unlocked: false,
    xpReward: 150,
    creditsReward: 30
  },
  {
    id: 'ach_5',
    title: 'AI Companion',
    description: 'Have 50 conversations with AI',
    icon: 'Bot',
    unlocked: false,
    xpReward: 250,
    creditsReward: 75
  }
];

export const mockLeaderboard = [
  { rank: 1, username: 'ProLearner', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProLearner', xp: 8500, level: 17 },
  { rank: 2, username: 'StudyMaster', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=StudyMaster', xp: 7200, level: 14 },
  { rank: 3, username: 'BookWorm99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=BookWorm99', xp: 6800, level: 13 }
];

export const mockDailyChallenge = {
  id: 'challenge_1',
  title: 'Read for 30 minutes',
  description: 'Spend at least 30 minutes reading any ebook',
  progress: 0,
  target: 30,
  xpReward: 100,
  creditsReward: 25,
  completed: false,
  expiresAt: new Date(new Date().setHours(23, 59, 59)).toISOString()
};

export const mockFlashcards = [];

export const mockQuizzes = [
  {
    id: 'quiz_1',
    title: 'C++ Basics Quiz',
    questions: [
      {
        id: 'q1',
        question: 'What is the correct way to declare a pointer in C++?',
        options: ['int ptr;', 'int *ptr;', 'ptr int;', 'pointer int;'],
        correct: 1
      },
      {
        id: 'q2',
        question: 'Which symbol is used for comments in C++?',
        options: ['#', '//', '/*', '<!--'],
        correct: 1
      },
      {
        id: 'q3',
        question: 'What is the size of int in C++ (typically)?',
        options: ['2 bytes', '4 bytes', '8 bytes', 'Depends on system'],
        correct: 3
      }
    ],
    category: 'Programming',
    xpReward: 75,
    creditsReward: 15
  },
  {
    id: 'quiz_cpp_complete',
    title: 'C++ Programming Complete Quiz',
    bookId: 'book_cpp',
    description: 'Complete this quiz after finishing the C++ workbook to earn credits!',
    questions: [
      {
        id: 'q1',
        question: 'What is the order of evaluation in C++ expressions determined by?',
        options: ['Compiler optimization', 'Operator precedence and associativity', 'Variable type', 'Random order'],
        correct: 1
      },
      {
        id: 'q2',
        question: 'Which loop guarantees at least one execution?',
        options: ['while loop', 'for loop', 'do-while loop', 'None of the above'],
        correct: 2
      },
      {
        id: 'q3',
        question: 'What happens when you access an array element out of bounds in C++?',
        options: ['Compilation error', 'Runtime exception', 'Undefined behavior (garbage value or crash)', 'Returns null'],
        correct: 2
      },
      {
        id: 'q4',
        question: 'What is the purpose of the "break" statement in a loop?',
        options: ['Skip current iteration', 'Exit the loop immediately', 'Pause the loop', 'Restart the loop'],
        correct: 1
      },
      {
        id: 'q5',
        question: 'In recursion, what is essential to prevent infinite recursion?',
        options: ['A while loop', 'A base case', 'Multiple function calls', 'Static variables'],
        correct: 1
      },
      {
        id: 'q6',
        question: 'What is the time complexity of Bubble Sort in the worst case?',
        options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
        correct: 2
      },
      {
        id: 'q7',
        question: 'What is the main advantage of Binary Search over Linear Search?',
        options: ['Works on unsorted arrays', 'Faster time complexity O(log n)', 'Easier to implement', 'Uses less memory'],
        correct: 1
      },
      {
        id: 'q8',
        question: 'What is the scope of a static local variable in a function?',
        options: ['Global scope', 'Limited to the function but retains value across calls', 'Limited to a single function call', 'No scope'],
        correct: 1
      },
      {
        id: 'q9',
        question: 'When passing an array to a function in C++, it is passed by:',
        options: ['Value', 'Reference (pointer to first element)', 'Copy', 'Register'],
        correct: 1
      },
      {
        id: 'q10',
        question: 'What is the correct way to declare a 2D array of integers with 3 rows and 4 columns?',
        options: ['int arr[4][3];', 'int arr[3][4];', 'int[3,4] arr;', 'array<int, 3, 4> arr;'],
        correct: 1
      }
    ],
    category: 'Programming',
    xpReward: 150,
    creditsReward: 200,
    requiredForCompletion: true
  }
];
