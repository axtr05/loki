import React from 'react';
import { useGame } from '../contexts/GameContext';
import { Trophy, Lock } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const Achievements = () => {
  const { achievements } = useGame();

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
        <p className="text-gray-600 mt-1">
          Unlocked {unlockedCount} of {achievements.length} achievements
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Overall Progress</span>
          <span className="text-sm font-semibold text-gray-900">
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`rounded-xl p-6 border-2 transition-all ${
              achievement.unlocked
                ? 'bg-white border-blue-500 shadow-md'
                : 'bg-gray-50 border-gray-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  achievement.unlocked
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                {achievement.unlocked ? <Trophy size={32} /> : <Lock size={32} />}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant={achievement.unlocked ? 'default' : 'secondary'}>
                    +{achievement.xpReward} XP
                  </Badge>
                  {achievement.unlocked && achievement.unlockedDate && (
                    <span className="text-xs text-gray-500">Unlocked: {achievement.unlockedDate}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
