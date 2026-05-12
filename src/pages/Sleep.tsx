import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Moon, Music, Book, Cloud, Sparkles, Play, Pause, BookOpen } from 'lucide-react';

const sounds = [
  { id: 'rain', name: 'Gentle Rain', icon: Cloud, color: 'bg-[#E0F2F1] text-[#00695C]' },
  { id: 'forest', name: 'Night Forest', icon: Sparkles, color: 'bg-[#F1F8E9] text-[#33691E]' },
  { id: 'waves', name: 'Ocean Waves', icon: Music, color: 'bg-[#E1F5FE] text-[#0277BD]' },
  { id: 'white', name: 'White Noise', icon: Moon, color: 'bg-[#FAF9F6] text-[#4A4E69]' },
];

export default function Sleep() {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [showThoughtDump, setShowThoughtDump] = useState(false);
  const [thought, setThought] = useState('');

  return (
    <div className="space-y-10 pb-20">
      <header className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-[#4A4E69] rounded-[32px] flex items-center justify-center text-[#DCD6F7] shadow-sm mb-6 border border-[#F0EBE3]">
          <Moon size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-sans font-semibold text-[#4A4E69] tracking-tight">Sleep Support</h1>
        <p className="text-[#4A4E69]/40 text-[10px] uppercase font-bold tracking-[4px] mt-2">Rest your weary mind.</p>
      </header>

      {/* Bedtime Sounds */}
      <section>
        <h3 className="text-sm font-bold text-[#4A4E69] uppercase tracking-widest opacity-40 mb-6">Relaxing Sounds</h3>
        <div className="grid grid-cols-2 gap-4">
          {sounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => setActiveSound(activeSound === sound.id ? null : sound.id)}
              className={`card-soft p-6 flex flex-col items-center gap-4 transition-all duration-300 border-[#F0EBE3] shadow-sm ${
                activeSound === sound.id ? 'bg-[#FAF9F6] ring-2 ring-[#DCD6F7]' : 'bg-white'
              }`}
            >
              <div className={`${sound.color} w-14 h-14 rounded-3xl flex items-center justify-center shadow-inner`}>
                <sound.icon size={28} strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold text-[#4A4E69] tracking-tight">{sound.name}</span>
              <div className="text-[#4A4E69]/20">
                {activeSound === sound.id ? <Pause size={18} /> : <Play size={18} />}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Thought Dump */}
      <section className="card-soft bg-[#4A4E69] text-white border-0 p-8 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
            <Book size={24} className="text-[#DCD6F7]" />
          </div>
          <div>
            <h3 className="font-bold text-lg tracking-tight">Thought Dump</h3>
            <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest mt-1">Unload your brain</p>
          </div>
        </div>
        
        {!showThoughtDump ? (
          <button 
            onClick={() => setShowThoughtDump(true)}
            className="w-full py-5 bg-white/5 rounded-[24px] border border-white/10 text-white/50 text-sm italic hover:bg-white/10 transition-all font-serif"
          >
            "I'm thinking about..."
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Dump everything here. It stays here so you can sleep."
              className="w-full h-32 bg-transparent outline-none text-white text-base placeholder:text-white/10 resize-none font-serif leading-relaxed mb-6"
            />
            <div className="flex justify-end">
              <button 
                onClick={() => { setShowThoughtDump(false); setThought(''); }}
                className="px-8 py-3 bg-[#FAF9F6] text-[#4A4E69] rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
              >
                Let it go
              </button>
            </div>
          </motion.div>
        )}
      </section>

      {/* Sleep Stories */}
      <section>
        <h3 className="text-sm font-bold text-[#4A4E69] uppercase tracking-widest opacity-40 mb-6">Sleep Stories</h3>
        <div className="space-y-4">
          {[
            { title: "The Midnight Library", length: "12 min", desc: "A journey through endless bookshelves in the clouds." },
            { title: "Mountain Mist", length: "15 min", desc: "Follow the slow movement of fog over calm peaks." },
          ].map((story, i) => (
            <div key={i} className="card-soft flex items-center gap-6 p-6 bg-white border-[#F0EBE3] shadow-sm hover:translate-x-1 transition-transform group">
              <div className="w-16 h-16 bg-[#FAF9F6] rounded-3xl flex items-center justify-center text-[#4A4E69] shrink-0 shadow-inner border border-[#F0EBE3] group-hover:scale-105 transition-all">
                <BookOpen size={28} strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#4A4E69] text-sm tracking-tight">{story.title}</h4>
                <p className="text-[#4A4E69]/50 text-xs truncate italic font-serif">"{story.desc}"</p>
              </div>
              <span className="text-[10px] font-bold text-[#4A4E69]/30 tracking-tighter tabular-nums whitespace-nowrap">{story.length}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
