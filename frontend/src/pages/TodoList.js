import React, { useState, useEffect } from 'react';
import { CheckCircle, Circle, X, Clock, Search, Filter } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { storage } from '../utils/storage';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, pending, high
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const savedTasks = storage.get('todos:all') || [];
    setTasks(savedTasks);
  }, []);

  useEffect(() => {
    storage.set('todos:all', tasks);
  }, [tasks]);

  // Timer countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.timer && task.timer.remaining > 0 && !task.completed) {
            const newRemaining = task.timer.remaining - 1;
            return {
              ...task,
              timer: {
                ...task.timer,
                remaining: newRemaining,
                urgent: newRemaining === 0
              }
            };
          }
          return task;
        })
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const addTask = () => {
    if (!taskInput.trim()) return;

    const newTask = {
      id: `task_${Date.now()}`,
      text: taskInput,
      completed: false,
      priority: 'medium',
      timer: null,
      createdAt: new Date().toISOString()
    };

    setTasks([newTask, ...tasks]);
    setTaskInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const setPriority = (taskId, priority) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, priority } : task
    ));
  };

  const setTimer = (taskId, minutes) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            timer: {
              total: minutes,
              remaining: minutes,
              urgent: false
            }
          }
        : task
    ));
  };

  const removeTimer = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, timer: null } : task
    ));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'from-pink-500 to-pink-600 shadow-[0_0_15px_rgba(255,15,123,0.5)]';
      case 'medium':
        return 'from-purple-500 to-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.5)]';
      case 'low':
        return 'from-blue-600 to-indigo-700 shadow-[0_0_15px_rgba(91,33,182,0.5)]';
      default:
        return 'from-purple-500 to-purple-600';
    }
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const filteredTasks = tasks
    .filter(task => {
      // Search filter
      if (searchQuery && !task.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filterStatus === 'completed' && !task.completed) return false;
      if (filterStatus === 'pending' && task.completed) return false;
      if (filterStatus === 'high' && task.priority !== 'high') return false;

      return true;
    })
    .sort((a, b) => {
      // Sort by completion status first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">To-Do List</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Stay organized and track your tasks</p>
      </div>

      {/* Task Input Section */}
      <div className="bg-gradient-to-br from-[#1B0E2D] to-[#2D1545] rounded-2xl p-6 shadow-2xl border-2 border-purple-800">
        <div className="relative">
          <Input
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a new task..."
            className="w-full bg-[#0D0517] text-white placeholder-gray-400 border-2 border-purple-600 rounded-xl px-6 py-4 text-lg focus:ring-4 focus:ring-purple-500 focus:border-purple-400 transition-all"
          />
          <Button
            onClick={addTask}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-lg shadow-lg"
          >
            Add Task
          </Button>
        </div>
        <p className="text-purple-300 text-sm mt-3 text-center">Press Enter to quickly add a task</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            className="whitespace-nowrap"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('pending')}
            className="whitespace-nowrap"
          >
            Pending
          </Button>
          <Button
            variant={filterStatus === 'completed' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('completed')}
            className="whitespace-nowrap"
          >
            Completed
          </Button>
          <Button
            variant={filterStatus === 'high' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('high')}
            className="whitespace-nowrap"
          >
            High Priority
          </Button>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700">
            <CheckCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterStatus !== 'all' ? 'No tasks found matching your filter' : 'No tasks yet. Add your first task above!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`group bg-white dark:bg-gray-800 rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-xl ${
                task.completed
                  ? 'border-green-300 dark:border-green-700 opacity-75'
                  : task.timer?.urgent
                  ? 'border-red-500 animate-pulse shadow-[0_0_20px_rgba(255,56,96,0.5)]'
                  : 'border-gray-200 dark:border-gray-700'
              } animate-slide-in`}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(task.id)}
                  className="mt-1 flex-shrink-0 transition-transform hover:scale-110"
                >
                  {task.completed ? (
                    <CheckCircle className="text-green-500 glow-green" size={28} />
                  ) : (
                    <Circle className="text-gray-400 hover:text-purple-500" size={28} />
                  )}
                </button>

                {/* Task Content */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-lg font-medium ${
                      task.completed
                        ? 'line-through text-gray-500 dark:text-gray-600'
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    {task.text}
                  </p>

                  {/* Task Metadata */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {/* Priority Badge */}
                    <div className="relative group/priority">
                      <div className={`bg-gradient-to-r ${getPriorityColor(task.priority)} text-white px-3 py-1 rounded-full text-xs font-bold uppercase cursor-pointer`}>
                        {task.priority}
                      </div>
                      {/* Priority Dropdown */}
                      <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden opacity-0 invisible group-hover/priority:opacity-100 group-hover/priority:visible transition-all z-10">
                        <button
                          onClick={() => setPriority(task.id, 'high')}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-pink-50 dark:hover:bg-pink-900"
                        >
                          🔴 High
                        </button>
                        <button
                          onClick={() => setPriority(task.id, 'medium')}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-purple-50 dark:hover:bg-purple-900"
                        >
                          🟣 Medium
                        </button>
                        <button
                          onClick={() => setPriority(task.id, 'low')}
                          className="block w-full px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900"
                        >
                          🔵 Low
                        </button>
                      </div>
                    </div>

                    {/* Timer Badge */}
                    {task.timer ? (
                      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        task.timer.urgent
                          ? 'bg-red-500 text-white animate-pulse'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        <Clock size={12} />
                        <span>{formatTime(task.timer.remaining)}</span>
                        <button
                          onClick={() => removeTimer(task.id)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="relative group/timer">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                        >
                          <Clock size={12} className="mr-1" />
                          Set Timer
                        </Button>
                        {/* Timer Dropdown */}
                        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-700 rounded-lg shadow-xl border-2 border-gray-200 dark:border-gray-600 overflow-hidden opacity-0 invisible group-hover/timer:opacity-100 group-hover/timer:visible transition-all z-10">
                          <button
                            onClick={() => setTimer(task.id, 15)}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900"
                          >
                            15 minutes
                          </button>
                          <button
                            onClick={() => setTimer(task.id, 30)}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900"
                          >
                            30 minutes
                          </button>
                          <button
                            onClick={() => setTimer(task.id, 60)}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900"
                          >
                            1 hour
                          </button>
                          <button
                            onClick={() => setTimer(task.id, 120)}
                            className="block w-full px-4 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-blue-900"
                          >
                            2 hours
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="flex-shrink-0 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 text-gray-400 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Task Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-300">{tasks.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Tasks</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{tasks.filter(t => t.completed).length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{tasks.filter(t => !t.completed).length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .glow-green {
          filter: drop-shadow(0 0 8px rgba(34, 197, 94, 0.6));
        }
      `}</style>
    </div>
  );
};

export default TodoList;
