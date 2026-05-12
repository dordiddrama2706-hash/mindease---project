import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Sparkles, Sun, Moon, Wind, MessageCircle, Gamepad2, Heart, Award } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function Dashboard({ setActiveTab }: DashboardProps) {
  const { profile } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const recommendations = [
    { id: 'breathe', title: 'Need 1 minute?', desc: 'Calm breathing exercise', icon: Wind, color: 'bg-[#E0F2F1] text-[#00695C]', tab: 'toolkit' },
    { id: 'ai', title: 'Talk it out', desc: 'Chat with MindEase AI', icon: MessageCircle, color: 'bg-[#F3E5F5] text-[#7B1FA2]', tab: 'ai' },
    { id: 'bubble', title: 'Distract yourself', desc: 'Pop away anxious thoughts', icon: Gamepad2, color: 'bg-[#FFF3E0] text-[#E65100]', tab: 'games' },
    { id: 'journal', title: 'Clear your mind', desc: 'Write down what you feel', icon: Heart, color: 'bg-[#F1F8E9] text-[#33691E]', tab: 'journal' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#4A4E69]/50 uppercase tracking-widest mb-1">{greeting},</h2>
          <h1 className="text-3xl font-sans font-semibold text-[#4A4E69] tracking-tight">{profile?.displayName || 'Friend'}</h1>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#F1F8E9] px-4 py-2 rounded-full border border-[#D4E2D4] flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-[#5A5A40]">{profile?.streak || 0} Day Streak</span>
          </div>
        </div>
      </section>

      {/* Daily Pulse */}
      <section className="bg-white p-6 rounded-[32px] shadow-sm border border-[#F0EBE3] flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#DCD6F7] rounded-2xl flex items-center justify-center shadow-sm">
            <Sun size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-[#4A4E69]">How are you feeling?</h3>
            <p className="text-[#4A4E69]/60 text-sm">Your daily check-in awaits.</p>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 px-1" onClick={() => setActiveTab('mood')}>
          {[
            { e: '😔', l: 'Struggling', c: 'bg-red-50' },
            { e: '😐', l: 'Steady', c: 'bg-[#E0F2F1]' },
            { e: '😊', l: 'Calm', c: 'bg-[#F1F8E9]' },
            { e: '🥰', l: 'Grateful', c: 'bg-[#FFF3E0]' }
          ].map((item, i) => (
            <button key={i} className="flex flex-col items-center gap-2 group">
              <div className={`w-14 h-14 ${item.c} rounded-full flex items-center justify-center text-2xl shadow-sm border border-black/5 group-hover:scale-110 transition-transform`}>
                {item.e}
              </div>
              <span className="text-[10px] font-bold text-[#4A4E69]/40 uppercase tracking-widest">{item.l}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Quick Acts */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-sans font-semibold text-xl text-[#4A4E69] tracking-tight text-center w-full">Personalized Care</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {recommendations.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.tab)}
              className="card-soft text-left group"
            >
              <div className={`${item.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <item.icon size={20} />
              </div>
              <h4 className="font-bold text-[#4A4E69] text-sm mb-1">{item.title}</h4>
              <p className="text-[#4A4E69]/60 text-xs">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Quote Wall */}
      <div className="bg-[#E0F2F1] p-8 rounded-[32px] border border-[#B2DFDB] text-center">
        <p className="text-xs uppercase tracking-widest font-bold text-[#00695C] mb-3">Today's Wisdom</p>
        <p className="text-xl italic font-serif text-[#004D40] leading-relaxed">
          "I am the sky. The thoughts are just weather passing through."
        </p>
      </div>

      {/* Weekly Progress Preview */}
      <section className="card-soft">
        <h3 className="font-sans font-semibold text-xl text-[#4A4E69] mb-4">Mind Garden</h3>
        <p className="text-xs text-[#4A4E69]/60 mb-6 uppercase tracking-widest font-bold">Weekly Resilience</p>
        <div className="flex justify-around items-end h-32 gap-3 bg-[#FAF9F6] rounded-3xl p-6">
          {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="w-full bg-[#DCD6F7] rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-x-0 top-0 h-4 bg-white/20 rounded-full blur-[2px] mt-1 mx-1" />
              </motion.div>
              <span className="text-[10px] text-[#4A4E69]/40 font-bold tracking-tighter">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
