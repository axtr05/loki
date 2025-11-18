import React, { useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import StatCard from '../components/StatCard';
import { Trophy, Flame, Clock, Coins, BookOpen, Target, TrendingUp } from 'lucide-react';
import { Progress } from '../components/ui/progress';

const Dashboard = () => {
  const { user, ebooks, achievements, dailyChallenge, updateStreak } = useGame();

  useEffect(() => {
    updateStreak();
  }, []);

  if (!user) return <div>Loading...</div>;

  const totalBooksRead = ebooks.filter(book => book.readProgress === 100).length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const recentBooks = ebooks
    .filter(book => book.lastRead)
    .sort((a, b) => new Date(b.lastRead) - new Date(a.lastRead))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.username}!</h1>
        <p className="text-gray-600 mt-1">Continue your learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Trophy}
          label="Level"
          value={user.level}
          color="blue"
          trend={`${user.xp} / ${user.xpToNextLevel} XP`}
        />
        <StatCard
          icon={Flame}
          label="Day Streak"
          value={user.streak}
          color="orange"
          trend="Keep it going!"
        />
        <StatCard
          icon={Coins}
          label="Points"
          value={user.points}
          color="green"
          trend="Earn more by completing activities"
        />
        <StatCard
          icon={BookOpen}
          label="Books Read"
          value={totalBooksRead}
          color="purple"
          trend={`${ebooks.length} total in library`}
        />
      </div>

      {/* Daily Challenge */}
      {dailyChallenge && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Daily Challenge</h2>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-900">{dailyChallenge.title}</h3>
                <span className="text-sm text-gray-600">
                  {dailyChallenge.progress} / {dailyChallenge.target} min
                </span>
              </div>
              <Progress value={(dailyChallenge.progress / dailyChallenge.target) * 100} className="h-2" />
            </div>
            <p className="text-gray-600">{dailyChallenge.description}</p>
            <div className="flex gap-4 text-sm">
              <span className="text-blue-600 font-medium">+{dailyChallenge.xpReward} XP</span>
              <span className="text-green-600 font-medium">+{dailyChallenge.pointsReward} Points</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Continue Reading */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Continue Reading</h2>
          </div>
          <div className="space-y-4">
            {recentBooks.length > 0 ? (
              recentBooks.map((book) => (
                <div key={book.id} className="flex gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{book.title}</h3>
                    <p className="text-sm text-gray-600 truncate">{book.author}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>{book.readProgress}% complete</span>
                      </div>
                      <Progress value={book.readProgress} className="h-1" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No books in progress</p>
            )}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Recent Achievements</h2>
          </div>
          <div className="space-y-4">
            {achievements
              .filter(a => a.unlocked)
              .slice(0, 3)
              .map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 p-3 rounded-lg bg-blue-50">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <Trophy size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">+{achievement.xpReward} XP</span>
                </div>
              ))}
            {unlockedAchievements === 0 && (
              <p className="text-gray-500 text-center py-4">Complete activities to unlock achievements!</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-blue-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Your Progress</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{user.totalStudyTime}</p>
            <p className="text-sm text-gray-600 mt-1">Hours Studied</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{unlockedAchievements}</p>
            <p className="text-sm text-gray-600 mt-1">Achievements</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{ebooks.length}</p>
            <p className="text-sm text-gray-600 mt-1">Books Available</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{user.streak}</p>
            <p className="text-sm text-gray-600 mt-1">Day Streak</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
