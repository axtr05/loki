import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Calendar, Clock, Trophy, BookOpen, Flame, TrendingUp, Coins } from 'lucide-react';
import StatCard from '../components/StatCard';

const Profile = () => {
  const { user, ebooks, achievements } = useGame();

  if (!user) return <div>Loading...</div>;

  const totalBooksRead = ebooks.filter(book => book.readProgress === 100).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const booksInProgress = ebooks.filter(book => book.readProgress > 0 && book.readProgress < 100).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600 mt-1">Your learning journey and achievements</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-xl p-8 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.avatar}
            alt={user.username}
            className="w-32 h-32 rounded-full border-4 border-blue-500 object-cover shadow-lg"
          />
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{user.level}</p>
                <p className="text-sm text-gray-600">Level</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{user.streak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{user.points}</p>
                <p className="text-sm text-gray-600">Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">XP Progress to Level {user.level + 1}</span>
            <span className="text-sm font-semibold text-gray-900">
              {user.xp} / {user.xpToNextLevel} XP
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Coins}
          label="Credits"
          value={user.credits || 0}
          color="green"
        />
        <StatCard
          icon={BookOpen}
          label="Books Completed"
          value={totalBooksRead}
          color="blue"
        />
        <StatCard
          icon={Trophy}
          label="Achievements"
          value={unlockedAchievements}
          color="purple"
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={`${user.streak} days`}
          color="orange"
        />
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading Stats */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Reading Stats</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Books Completed</span>
              <span className="font-bold text-gray-900">{totalBooksRead}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Books in Progress</span>
              <span className="font-bold text-gray-900">{booksInProgress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Books Unlocked</span>
              <span className="font-bold text-gray-900">{ebooks.filter(b => b.isPurchased).length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Available</span>
              <span className="font-bold text-gray-900">{ebooks.length}</span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Account Info</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Member Since</span>
              <span className="font-bold text-gray-900">{user.joinDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Login</span>
              <span className="font-bold text-gray-900">{user.lastLoginDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total XP Earned</span>
              <span className="font-bold text-gray-900">{user.xp}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Credits Balance</span>
              <span className="font-bold text-green-600">{user.credits || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
