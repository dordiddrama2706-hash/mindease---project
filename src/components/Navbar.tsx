import React from 'react';
import { Home, Heart, BookOpen, Shield, MessageCircle, Moon, Users, LayoutGrid, Settings as SettingsIcon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'mood', icon: Heart, label: 'Mood' },
  { id: 'toolkit', icon: Shield, label: 'Tools' },
  { id: 'journal', icon: BookOpen, label: 'Journal' },
  { id: 'ai', icon: MessageCircle, label: 'Lumi' },
  { id: 'settings', icon: SettingsIcon, label: 'Settings' },
];

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-[#F0EBE3] px-2 py-3 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b md:px-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between md:justify-start md:gap-8">
        <div className="hidden md:flex items-center gap-3 mr-4">
          <div className="w-10 h-10 bg-[#DCD6F7] rounded-2xl flex items-center justify-center shadow-sm">
            <Heart size={20} className="text-white fill-white" />
          </div>
          <span className="font-sans font-semibold text-xl tracking-tight text-[#4A4E69]">MindEase</span>
        </div>
        
        <div className="flex w-full justify-around md:w-auto md:gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1.5 px-4 py-2 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'text-[#4A4E69] bg-[#DCD6F7]/30' 
                  : 'text-[#4A4E69]/40 hover:text-[#4A4E69]'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-bold uppercase tracking-wider md:text-xs">{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="hidden md:flex flex-1 justify-end items-center gap-6">
          <button onClick={() => setActiveTab('games')} className="text-[#4A4E69]/50 hover:text-[#4A4E69] transition-colors p-2 rounded-xl hover:bg-[#FAF9F6]">
            <LayoutGrid size={20} />
          </button>
          <button onClick={() => setActiveTab('sleep')} className="text-[#4A4E69]/50 hover:text-[#4A4E69] transition-colors p-2 rounded-xl hover:bg-[#FAF9F6]">
            <Moon size={20} />
          </button>
          <button onClick={() => setActiveTab('community')} className="text-[#4A4E69]/50 hover:text-[#4A4E69] transition-colors p-2 rounded-xl hover:bg-[#FAF9F6]">
            <Users size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
