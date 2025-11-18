import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import { mockUser, mockEbooks, mockAchievements, mockDailyChallenge } from '../mock';

const GameContext = createContext();

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [dailyChallenge, setDailyChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from localStorage or use mock data
  useEffect(() => {
    const initializeData = () => {
      // Load or initialize user
      let userData = storage.get(STORAGE_KEYS.USER_PROFILE);
      if (!userData) {
        userData = mockUser;
        storage.set(STORAGE_KEYS.USER_PROFILE, userData);
      }
      setUser(userData);

      // Load or initialize ebooks
      let ebooksData = storage.get(STORAGE_KEYS.EBOOKS_LIBRARY);
      if (!ebooksData || ebooksData.length === 0) {
        ebooksData = mockEbooks;
        storage.set(STORAGE_KEYS.EBOOKS_LIBRARY, ebooksData);
      }
      setEbooks(ebooksData);

      // Load or initialize achievements
      let achievementsData = storage.get(STORAGE_KEYS.ACHIEVEMENTS);
      if (!achievementsData || achievementsData.length === 0) {
        achievementsData = mockAchievements;
        storage.set(STORAGE_KEYS.ACHIEVEMENTS, achievementsData);
      }
      setAchievements(achievementsData);

      // Load or initialize daily challenge
      let challengeData = storage.get(STORAGE_KEYS.CURRENT_CHALLENGE);
      if (!challengeData || new Date(challengeData.expiresAt) < new Date()) {
        challengeData = mockDailyChallenge;
        storage.set(STORAGE_KEYS.CURRENT_CHALLENGE, challengeData);
      }
      setDailyChallenge(challengeData);

      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Award XP and update user level
  const awardXP = (amount, source = 'activity') => {
    if (!user) return;

    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    const xpToNextLevel = (newLevel * 500);

    const updatedUser = {
      ...user,
      xp: newXP,
      level: newLevel,
      xpToNextLevel
    };

    setUser(updatedUser);
    storage.set(STORAGE_KEYS.USER_PROFILE, updatedUser);

    // Show celebration if leveled up
    if (newLevel > user.level) {
      showLevelUpCelebration(newLevel);
    }

    return updatedUser;
  };

  // Award points/coins
  const awardPoints = (amount) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      points: user.points + amount
    };

    setUser(updatedUser);
    storage.set(STORAGE_KEYS.USER_PROFILE, updatedUser);
    return updatedUser;
  };

  // Unlock achievement
  const unlockAchievement = (achievementId) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (!achievement || achievement.unlocked) return;

    const updatedAchievements = achievements.map(a =>
      a.id === achievementId
        ? { ...a, unlocked: true, unlockedDate: new Date().toISOString().split('T')[0] }
        : a
    );

    setAchievements(updatedAchievements);
    storage.set(STORAGE_KEYS.ACHIEVEMENTS, updatedAchievements);

    // Award XP for unlocking achievement
    awardXP(achievement.xpReward, 'achievement');

    return achievement;
  };

  // Update streak
  const updateStreak = () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const lastLogin = user.lastLoginDate;

    let newStreak = user.streak;

    if (lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLogin === yesterdayStr) {
        newStreak += 1;
      } else if (lastLogin !== today) {
        newStreak = 1;
      }

      const updatedUser = {
        ...user,
        streak: newStreak,
        lastLoginDate: today
      };

      setUser(updatedUser);
      storage.set(STORAGE_KEYS.USER_PROFILE, updatedUser);

      // Check streak achievements
      if (newStreak === 7 && !achievements.find(a => a.id === 'ach_2')?.unlocked) {
        unlockAchievement('ach_2');
      }
    }
  };

  // Add ebook
  const addEbook = (ebook) => {
    const newEbook = {
      ...ebook,
      id: `book_${Date.now()}`,
      readProgress: 0,
      lastRead: null
    };

    const updatedEbooks = [...ebooks, newEbook];
    setEbooks(updatedEbooks);
    storage.set(STORAGE_KEYS.EBOOKS_LIBRARY, updatedEbooks);
    return newEbook;
  };

  // Update reading progress
  const updateReadingProgress = (bookId, progress) => {
    const updatedEbooks = ebooks.map(book =>
      book.id === bookId
        ? { ...book, readProgress: progress, lastRead: new Date().toISOString().split('T')[0] }
        : book
    );

    setEbooks(updatedEbooks);
    storage.set(STORAGE_KEYS.EBOOKS_LIBRARY, updatedEbooks);

    // Award XP for reading milestones
    if (progress === 25 || progress === 50 || progress === 75 || progress === 100) {
      awardXP(25, 'reading');
    }

    // Check if first book completed
    if (progress === 100 && !achievements.find(a => a.id === 'ach_1')?.unlocked) {
      unlockAchievement('ach_1');
    }
  };

  const showLevelUpCelebration = (level) => {
    // This will be used by components to show celebration UI
    window.dispatchEvent(new CustomEvent('levelup', { detail: { level } }));
  };

  const value = {
    user,
    ebooks,
    achievements,
    dailyChallenge,
    isLoading,
    awardXP,
    awardPoints,
    unlockAchievement,
    updateStreak,
    addEbook,
    updateReadingProgress,
    setUser,
    setEbooks,
    setAchievements
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
