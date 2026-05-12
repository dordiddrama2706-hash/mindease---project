import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import MoodTracker from './pages/MoodTracker';
import Toolkit from './pages/Toolkit';
import Journal from './pages/Journal';
import AIAssistant from './pages/AIAssistant';
import Games from './pages/Games';
import Sleep from './pages/Sleep';
import Community from './pages/Community';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#FDFCFB] flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-indigo-200 rounded-full blur-xl opacity-50"
        />
        <p className="absolute mt-24 text-indigo-400 font-serif italic">Finding your calm...</p>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'mood': return <MoodTracker />;
      case 'toolkit': return <Toolkit />;
      case 'journal': return <Journal />;
      case 'ai': return <AIAssistant />;
      case 'games': return <Games />;
      case 'sleep': return <Sleep />;
      case 'community': return <Community />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pt-20">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-w-screen-md mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
