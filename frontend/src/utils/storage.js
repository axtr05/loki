// LocalStorage utility functions

const STORAGE_KEYS = {
  USER_PROFILE: 'user:profile',
  EBOOKS_LIBRARY: 'ebooks:library',
  ACHIEVEMENTS: 'achievements:unlocked',
  AI_CONVERSATIONS: 'ai:conversations',
  DAILY_STATS: 'stats:daily',
  CURRENT_CHALLENGE: 'challenges:current',
  FLASHCARDS: 'flashcards:all',
  QUIZZES: 'quizzes:all',
  STUDY_SESSIONS: 'study:sessions'
};

export const storage = {
  // Get item from localStorage
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from storage:`, error);
      return null;
    }
  },

  // Set item in localStorage
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in storage:`, error);
      return false;
    }
  },

  // Remove item from localStorage
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
      return false;
    }
  },

  // Get reading progress for a specific book
  getReadingProgress: (bookId) => {
    return storage.get(`reading:${bookId}`) || { progress: 0, bookmarks: [], highlights: [] };
  },

  // Set reading progress for a specific book
  setReadingProgress: (bookId, data) => {
    return storage.set(`reading:${bookId}`, data);
  }
};

export { STORAGE_KEYS };
