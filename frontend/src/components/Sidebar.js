import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Bot, Clock, Trophy, Users, User, Settings, Upload, ListTodo } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useGame();

  const allMenuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/library', icon: BookOpen, label: 'Library' },
    { path: '/ai-assistant', icon: Bot, label: 'AI Assistant' },
    { path: '/study-tools', icon: Clock, label: 'Study Tools' },
    { path: '/todo', icon: ListTodo, label: 'To-Do List' },
    { path: '/achievements', icon: Trophy, label: 'Achievements' },
    { path: '/leaderboard', icon: Users, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  // Only show admin panel for admin users
  const menuItems = user?.isAdmin 
    ? [...allMenuItems, { path: '/admin', icon: Upload, label: 'Admin Panel' }]
    : allMenuItems;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <img src="/assets/edupulse-logo.png" alt="EduPulse Logo" className="w-12 h-12 object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EduPulse</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gamified Learning</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={user.avatar}
              alt={user.username}
              className="w-12 h-12 rounded-full border-2 border-blue-500 dark:border-purple-500"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{user.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Level {user.level}</p>
            </div>
          </div>
          
          {/* Credits Display */}
          <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-2 mb-3 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Credits</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400">{user.credits || 0}</span>
            </div>
          </div>
          
          {/* XP Progress */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>{user.xp} XP</span>
              <span>{user.xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 dark:bg-purple-900/50 text-blue-700 dark:text-purple-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
