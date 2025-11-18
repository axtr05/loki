import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { BookOpen, Trophy, Flame, Coins } from 'lucide-react';

const WelcomeModal = ({ isOpen, onComplete }) => {
  const [name, setName] = useState('');
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2) {
      onComplete(name.trim());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl" hideClose>
        {step === 1 ? (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-white" size={40} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to EduPulse!</h1>
              <p className="text-gray-600">Your gamified learning journey starts here</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What's your name?
                </label>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                  className="text-lg py-6"
                  autoFocus
                />
              </div>

              <Button
                onClick={handleNext}
                disabled={!name.trim()}
                className="w-full py-6 text-lg"
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How LearnHub Works</h2>
              <p className="text-gray-600">Earn credits, unlock books, and level up!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Read & Learn</h3>
                <p className="text-sm text-gray-600">Access free books and read to gain XP</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3">
                  <Coins className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Earn Credits</h3>
                <p className="text-sm text-gray-600">Complete books to earn credits</p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mb-3">
                  <Flame className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Build Streaks</h3>
                <p className="text-sm text-gray-600">Login daily to maintain your streak</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                  <Trophy className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Unlock Books</h3>
                <p className="text-sm text-gray-600">Use credits to unlock premium books</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 text-center">
                <strong>Starting Bonus:</strong> You get <span className="text-green-600 font-bold">100 credits</span> and
                one <span className="text-blue-600 font-bold">free book (C++)</span> to begin!
              </p>
            </div>

            <Button onClick={handleNext} className="w-full py-6 text-lg">
              Start Learning!
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
