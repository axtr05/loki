import React, { useState } from 'react';
import { Trophy, Medal, TrendingUp } from 'lucide-react';
import { mockLeaderboard } from '../mock';
import { useGame } from '../contexts/GameContext';

const Leaderboard = () => {
  const { user } = useGame();
  const [leaderboard] = useState(mockLeaderboard);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-yellow-500" size={24} />;
    if (rank === 2) return <Medal className="text-gray-400" size={24} />;
    if (rank === 3) return <Medal className="text-orange-600" size={24} />;
    return <span className="text-gray-600 font-bold">{rank}</span>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
        <p className="text-gray-600 mt-1">See how you rank against other learners</p>
      </div>

      {/* User's Current Rank */}
      <div className="bg-white rounded-xl p-6 border-2 border-blue-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.level || 'N/A'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Your Rank</h3>
              <p className="text-2xl font-bold text-blue-600">#{user?.rank || 4}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total XP</p>
            <p className="text-2xl font-bold text-gray-900">{user?.xp || 0}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Level</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((entry) => (
                <tr
                  key={entry.rank}
                  className={`hover:bg-gray-50 transition-colors ${
                    entry.username === user?.username ? 'bg-blue-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center w-10">
                      {getRankIcon(entry.rank)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={entry.avatar}
                        alt={entry.username}
                        className="w-10 h-10 rounded-full border-2 border-gray-200"
                      />
                      <span className="font-semibold text-gray-900">{entry.username}</span>
                      {entry.username === user?.username && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                      <TrendingUp size={16} className="text-blue-600" />
                      {entry.level}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900">{entry.xp.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
