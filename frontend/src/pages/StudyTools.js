import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock, Plus, Play, Pause, RotateCcw, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useGame } from '../contexts/GameContext';
import { storage } from '../utils/storage';
import { mockFlashcards, mockQuizzes } from '../mock';

const StudyTools = () => {
  const { awardXP, awardCredits } = useGame();

  // Pomodoro Timer
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  // Flashcards
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [newCard, setNewCard] = useState({ front: '', back: '', category: '' });

  // Quiz
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizResults, setQuizResults] = useState([]);

  useEffect(() => {
    // Load flashcards and quizzes
    const savedCards = storage.get('flashcards:all') || mockFlashcards;
    const savedQuizzes = storage.get('quizzes:all') || mockQuizzes;
    setFlashcards(savedCards);
    setQuizzes(savedQuizzes);
  }, []);

  // Pomodoro Timer Effect
  useEffect(() => {
    let interval = null;
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (time === 0) {
      // Timer completed
      setIsRunning(false);
      if (!isBreak) {
        awardXP(25, 'pomodoro');
        setIsBreak(true);
        setTime(5 * 60); // 5 minute break
      } else {
        setIsBreak(false);
        setTime(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, time, isBreak, awardXP]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddFlashcard = () => {
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    const card = {
      id: `card_${Date.now()}`,
      ...newCard,
      created: new Date().toISOString().split('T')[0]
    };

    const updatedCards = [...flashcards, card];
    setFlashcards(updatedCards);
    storage.set('flashcards:all', updatedCards);
    setNewCard({ front: '', back: '', category: '' });
    awardXP(10, 'flashcard');
  };

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizResults([]);
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === activeQuiz.questions[currentQuestion].correct;
    setQuizResults([...quizResults, isCorrect]);

    setTimeout(() => {
      if (currentQuestion < activeQuiz.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        // Quiz completed
        const correctCount = quizResults.filter(r => r).length + (isCorrect ? 1 : 0);
        const percentage = (correctCount / activeQuiz.questions.length) * 100;
        if (percentage >= 70) {
          awardXP(activeQuiz.xpReward, 'quiz');
        }
        
        // Award credits if 100% correct
        if (percentage === 100 && activeQuiz.creditsReward) {
          awardCredits(activeQuiz.creditsReward);
          
          // Clear pending quiz if this was from book completion
          const pendingQuiz = localStorage.getItem('pendingQuiz');
          if (pendingQuiz) {
            const quizData = JSON.parse(pendingQuiz);
            if (quizData.quizId === activeQuiz.id) {
              localStorage.removeItem('pendingQuiz');
              setTimeout(() => {
                alert(`Perfect score! You earned ${activeQuiz.creditsReward} credits for completing "${quizData.bookTitle}"!`);
              }, 100);
            }
          }
        }
      }
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Study Tools</h1>
        <p className="text-gray-600 mt-1">Enhance your learning with powerful tools</p>
      </div>

      <Tabs defaultValue="pomodoro" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pomodoro">Pomodoro Timer</TabsTrigger>
          <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
          <TabsTrigger value="quiz">Quizzes</TabsTrigger>
        </TabsList>

        {/* Pomodoro Timer */}
        <TabsContent value="pomodoro">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <div className="max-w-md mx-auto text-center space-y-8">
              <div>
                <Clock className="mx-auto text-blue-600 mb-4" size={48} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {isBreak ? 'Break Time' : 'Focus Time'}
                </h2>
                <p className="text-gray-600">Stay focused and productive</p>
              </div>

              <div className="text-7xl font-bold text-gray-900">
                {formatTime(time)}
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setIsRunning(!isRunning)}
                  size="lg"
                  className="px-8"
                >
                  {isRunning ? <Pause size={20} className="mr-2" /> : <Play size={20} className="mr-2" />}
                  {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button
                  onClick={() => {
                    setIsRunning(false);
                    setTime(isBreak ? 5 * 60 : 25 * 60);
                  }}
                  variant="outline"
                  size="lg"
                >
                  <RotateCcw size={20} />
                </Button>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Complete a focus session to earn <span className="text-blue-600 font-semibold">+25 XP</span>
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Flashcards */}
        <TabsContent value="flashcards">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Study Mode */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Study Mode</h2>
              {flashcards.length > 0 ? (
                <div className="space-y-4">
                  <div
                    className="bg-blue-50 rounded-xl p-8 min-h-[250px] flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => setShowAnswer(!showAnswer)}
                  >
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-4">
                        {showAnswer ? 'Answer' : 'Question'}
                      </p>
                      <p className="text-xl font-semibold text-gray-900">
                        {showAnswer
                          ? flashcards[currentCardIndex]?.back
                          : flashcards[currentCardIndex]?.front}
                      </p>
                      <p className="text-sm text-gray-500 mt-4">Click to flip</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      onClick={() => {
                        setCurrentCardIndex(Math.max(0, currentCardIndex - 1));
                        setShowAnswer(false);
                      }}
                      variant="outline"
                      disabled={currentCardIndex === 0}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      {currentCardIndex + 1} / {flashcards.length}
                    </span>
                    <Button
                      onClick={() => {
                        setCurrentCardIndex(Math.min(flashcards.length - 1, currentCardIndex + 1));
                        setShowAnswer(false);
                      }}
                      disabled={currentCardIndex === flashcards.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No flashcards yet. Create your first one!</p>
              )}
            </div>

            {/* Create Flashcard */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Create Flashcard</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Question (Front)</label>
                  <Textarea
                    placeholder="Enter question..."
                    value={newCard.front}
                    onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Answer (Back)</label>
                  <Textarea
                    placeholder="Enter answer..."
                    value={newCard.back}
                    onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <Input
                    placeholder="e.g., Programming, Science..."
                    value={newCard.category}
                    onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddFlashcard} className="w-full">
                  <Plus size={20} className="mr-2" />
                  Add Flashcard (+10 XP)
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Quizzes */}
        <TabsContent value="quiz">
          {!activeQuiz ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{quiz.category}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{quiz.questions.length} questions</span>
                    <span className="text-sm text-blue-600 font-medium">+{quiz.xpReward} XP</span>
                  </div>
                  <Button onClick={() => handleStartQuiz(quiz)} className="w-full mt-4">
                    Start Quiz
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-gray-200 max-w-2xl mx-auto">
              {currentQuestion < activeQuiz.questions.length ? (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900">{activeQuiz.title}</h2>
                    <span className="text-sm text-gray-600">
                      Question {currentQuestion + 1} / {activeQuiz.questions.length}
                    </span>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-lg font-semibold text-gray-900">
                      {activeQuiz.questions[currentQuestion].question}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {activeQuiz.questions[currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                          selectedAnswer === null
                            ? 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                            : selectedAnswer === index
                            ? index === activeQuiz.questions[currentQuestion].correct
                              ? 'border-green-500 bg-green-50'
                              : 'border-red-500 bg-red-50'
                            : index === activeQuiz.questions[currentQuestion].correct
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <span className="font-medium">{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <CheckCircle className="mx-auto text-green-600" size={64} />
                  <h2 className="text-2xl font-bold text-gray-900">Quiz Completed!</h2>
                  <p className="text-lg text-gray-600">
                    You got {quizResults.filter(r => r).length} out of {activeQuiz.questions.length} correct
                  </p>
                  {quizResults.filter(r => r).length === activeQuiz.questions.length && activeQuiz.creditsReward && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                      <p className="text-green-800 font-semibold">
                        Perfect Score! You earned {activeQuiz.creditsReward} credits! 🎉
                      </p>
                    </div>
                  )}
                  {quizResults.filter(r => r).length < activeQuiz.questions.length && activeQuiz.requiredForCompletion && (
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                      <p className="text-orange-800 font-semibold">
                        You need to get all questions correct to earn credits. Try again!
                      </p>
                    </div>
                  )}
                  <Button onClick={() => {
                    setActiveQuiz(null);
                    setQuizResults([]);
                    setCurrentQuestion(0);
                  }}>Back to Quizzes</Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyTools;
