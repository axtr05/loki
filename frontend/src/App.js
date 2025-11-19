import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { GameProvider, useGame } from "./contexts/GameContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Sidebar from "./components/Sidebar";
import WelcomeModal from "./components/WelcomeModal";
import ThemeToggle from "./components/ThemeToggle";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import AIAssistant from "./pages/AIAssistant";
import StudyTools from "./pages/StudyTools";
import TodoList from "./pages/TodoList";
import Achievements from "./pages/Achievements";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import { Toaster } from "./components/ui/toaster";

const AppContent = () => {
  const { showWelcome, completeWelcome, user } = useGame();

  return (
    <>
      <WelcomeModal isOpen={showWelcome} onComplete={completeWelcome} />
      
      {!showWelcome && (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <ThemeToggle />
          <main className="flex-1 ml-64 p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/study-tools" element={<StudyTools />} />
              <Route path="/todo" element={<TodoList />} />
              <Route path="/achievements" element={<Achievements />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              {/* Admin route - restricted */}
              <Route 
                path="/admin" 
                element={user?.isAdmin ? <Admin /> : <Navigate to="/" replace />} 
              />
            </Routes>
          </main>
          <Toaster />
        </div>
      )}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <GameProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
