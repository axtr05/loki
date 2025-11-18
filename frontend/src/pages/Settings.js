import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { useGame } from '../contexts/GameContext';
import { storage } from '../utils/storage';

const Settings = () => {
  const { user } = useGame();

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Account Settings */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <User className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Username</p>
                <p className="text-sm text-gray-600">{user?.username}</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Daily Challenge Reminders</p>
                <p className="text-sm text-gray-600">Get notified about daily challenges</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Achievement Unlocked</p>
                <p className="text-sm text-gray-600">Celebrate when you unlock achievements</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Streak Reminders</p>
                <p className="text-sm text-gray-600">Don't break your streak!</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Privacy</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Show on Leaderboard</p>
                <p className="text-sm text-gray-600">Display your progress publicly</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900">Share Learning Stats</p>
                <p className="text-sm text-gray-600">Allow others to see your stats</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl p-6 border-2 border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <Trash2 className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Danger Zone</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="font-medium text-gray-900 mb-2">Clear All Data</p>
              <p className="text-sm text-gray-600 mb-4">
                This will permanently delete all your progress, ebooks, and achievements.
              </p>
              <Button onClick={handleClearData} variant="destructive">
                <Trash2 size={16} className="mr-2" />
                Clear All Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
