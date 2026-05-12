import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, ShieldAlert, Heart, Music, Image as ImageIcon, Sparkles, BookOpen, Clock } from 'lucide-react';

const groundings = [
  "Identify 5 things you can see.",
  "Identify 4 things you can touch.",
  "Identify 3 things you can hear.",
  "Identify 2 things you can smell.",
  "Identify 1 thing you can taste."
];

export default function Toolkit() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [breatheState, setBreatheState] = useState<'inhale' | 'hold' | 'exhale' | 'idle'>('idle');
  const [groundingIdx, setGroundingIdx] = useState(0);

  // Breathing Loop
  useEffect(() => {
    if (activeTool !== 'breathe') {
      setBreatheState('idle');
      return;
    }
    
    setBreatheState('inhale');
    const sequence = [
      { state: 'inhale', duration: 4000 },
      { state: 'hold', duration: 4000 },
      { state: 'exhale', duration: 4000 },
      { state: 'hold', duration: 4000 },
    ];
    
    let current = 0;
    const interval = setInterval(() => {
      current = (current + 1) % sequence.length;
      setBreatheState(sequence[current].state as any);
    }, 4000);

    return () => clearInterval(interval);
  }, [activeTool]);

  const tools = [
    { id: 'breathe', title: 'Box Breathing', icon: Wind, color: 'from-[#DCD6F7] to-[#A6B1E1]' },
    { id: 'grounding', title: '5-4-3-2-1 Fix', icon: Heart, color: 'from-[#F1F8E9] to-[#D4E2D4]' },
    { id: 'challenge', title: 'Thought Reframer', icon: BookOpen, color: 'from-[#F3E5F5] to-[#E1BEE7]' },
    { id: 'focus', title: 'Focus Timer', icon: Clock, color: 'from-[#FFF3E0] to-[#FFE0B2]' },
    { id: 'pulse', title: 'Bio-Feedback', icon: Sparkles, color: 'from-[#E0F2F1] to-[#B2DFDB]' },
    { id: 'sos', title: 'Panic Button', icon: ShieldAlert, color: 'from-[#FF8A80] to-[#FF5252]' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-sans font-semibold text-[#4A4E69] tracking-tight">Anxiety Toolkit</h1>
        <p className="text-[#4A4E69]/40 text-[10px] tracking-widest uppercase font-bold mt-1">Immediate relief for your mind.</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`card-soft relative overflow-hidden group h-32 flex flex-col justify-end ${activeTool === tool.id ? 'ring-2 ring-[#4A4E69]' : ''}`}
          >
            <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${tool.color} opacity-20 rounded-bl-[40px] group-hover:scale-150 transition-transform duration-500`} />
            <tool.icon size={24} className="text-[#4A4E69]/60 mb-2 group-hover:text-[#4A4E69] transition-colors" />
            <h3 className="font-bold text-[#4A4E69] text-sm leading-tight">{tool.title}</h3>
          </button>
        ))}
      </div>

      <div className="min-h-[400px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {activeTool === 'breathe' && (
            <motion.div
              key="breath"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className="relative w-64 h-64 mx-auto mb-12">
                <motion.div
                  animate={{ 
                    scale: breatheState === 'inhale' ? 1.4 : (breatheState === 'exhale' ? 1 : 1.4),
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="absolute inset-0 bg-[#DCD6F7] rounded-full blur-3xl opacity-20"
                />
                <motion.div
                  animate={{ 
                    scale: breatheState === 'inhale' ? 1.4 : (breatheState === 'exhale' ? 1 : 1.4),
                    borderColor: breatheState === 'inhale' ? '#A6B1E1' : '#DCD6F7'
                  }}
                  transition={{ duration: 4, ease: "easeInOut" }}
                  className="w-full h-full rounded-full flex items-center justify-center border-[6px] bg-white shadow-sm"
                >
                  <span className="text-[#4A4E69] font-sans text-xl font-bold uppercase tracking-widest italic">
                    {breatheState}
                  </span>
                </motion.div>
                <div className="absolute inset-0 rounded-full border border-dashed border-[#DCD6F7] animate-spin-slow" />
              </div>
              <p className="text-[#4A4E69]/60 italic max-w-xs mx-auto text-sm">Focus on the circle. Sync your breath to the rhythm.</p>
            </motion.div>
          )}

          {activeTool === 'grounding' && (
            <motion.div
              key="ground"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="card-soft text-center p-12 bg-white"
            >
              <div className="w-16 h-16 bg-[#F1F8E9] text-[#5A5A40] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart />
              </div>
              <h2 className="text-3xl font-serif mb-8 text-[#4A4E69] italic leading-relaxed">"{groundings[groundingIdx]}"</h2>
              <button 
                onClick={() => setGroundingIdx((v) => (v + 1) % groundings.length)}
                className="btn-primary"
              >
                Next Step
              </button>
            </motion.div>
          )}

          {activeTool === 'challenge' && (
            <ThoughtChallengeUI key="challenge" />
          )}

          {activeTool === 'focus' && (
            <FocusTimerUI key="focus" />
          )}

          {activeTool === 'pulse' && (
            <PulseCheckUI key="pulse" />
          )}

          {activeTool === 'sos' && (
            <motion.div
              key="sos"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-soft bg-[#FF8A80]/10 border-[#FF8A80]/20 p-8 text-center"
            >
              <h2 className="text-2xl font-bold text-[#FF5252] mb-6 font-sans tracking-tight">You are safe. This will pass.</h2>
              <div className="space-y-4 text-left mb-10">
                {[
                  "Splash cold water on your face.",
                  "Press your palms together firmly.",
                  "Label 3 things in the room that are blue.",
                  "Take a slow, deep breath in... and out."
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4 text-[#4A4E69] text-sm items-center py-2 border-b border-[#FF8A80]/10">
                    <span className="w-6 h-6 bg-[#FF8A80] text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                    <span className="font-medium">{tip}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-[#4A4E69]/40 mb-6 font-bold uppercase tracking-widest">Emergency Support</p>
              <div className="grid grid-cols-2 gap-4">
                <a href="tel:988" className="bg-white py-4 rounded-3xl border border-[#FF8A80]/20 text-[#FF5252] font-bold text-sm shadow-sm hover:bg-[#FF8A80] hover:text-white transition-all">Call 988</a>
                <button className="bg-white py-4 rounded-3xl border border-[#FF8A80]/20 text-[#FF5252] font-bold text-sm shadow-sm hover:bg-[#FF8A80] hover:text-white transition-all uppercase tracking-tight text-[10px]">Crisis Text</button>
              </div>
            </motion.div>
          )}

          {!activeTool && (
            <motion.div key="empty" className="text-center opacity-40">
              <Sparkles size={48} className="mx-auto mb-4 text-[#DCD6F7]" />
              <p className="font-sans italic text-[#4A4E69]">Select a tool to begin finding your calm.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FocusTimerUI() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-soft text-center p-12 bg-white">
      <h3 className="font-sans font-bold text-sm text-[#4A4E69]/40 mb-6 uppercase tracking-widest">Focus Mode</h3>
      <div className="text-8xl font-sans font-semibold text-[#4A4E69] mb-12 tabular-nums">
        {mins}:{secs < 10 ? '0' : ''}{secs}
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => setIsActive(!isActive)} 
          className={`flex-1 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all ${isActive ? 'bg-[#FAF9F6] text-[#4A4E69]' : 'bg-[#4A4E69] text-white shadow-md'}`}
        >
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button onClick={() => { setTimeLeft(25 * 60); setIsActive(false); }} className="p-4 bg-[#FAF9F6] rounded-full text-[#4A4E69]/40 hover:text-[#4A4E69]">Reset</button>
      </div>
    </motion.div>
  );
}

function PulseCheckUI() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-soft text-center p-12 overflow-hidden relative bg-white">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#DCD6F7]/20 blur-3xl rounded-full" />
      <Sparkles size={40} className="mx-auto mb-6 text-[#DCD6F7]" />
      <h3 className="font-sans font-semibold text-2xl text-[#4A4E69] mb-4">Pulse Detection</h3>
      <p className="text-[#4A4E69]/60 text-sm mb-12 leading-relaxed italic">
        "Place your finger gently over your front camera to detect your pulse through the lens."
      </p>
      <div className="w-56 h-56 rounded-full border-2 border-[#F0EBE3] mx-auto flex items-center justify-center relative">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ duration: 0.8, repeat: Infinity }}
          className="w-14 h-14 bg-[#FF8A80] rounded-full flex items-center justify-center text-white shadow-lg shadow-[#FF8A80]/20"
        >
          <Heart size={24} className="fill-white" />
        </motion.div>
        <div className="absolute inset-4 rounded-full border border-dashed border-[#DCD6F7]/50 animate-spin-slow" />
      </div>
      <p className="text-[10px] font-bold text-[#4A4E69]/30 uppercase tracking-widest mt-12">Analyzing Light Diffraction...</p>
    </motion.div>
  );
}

function ThoughtChallengeUI() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ thought: '', for: '', against: '', real: '' });

  const steps = [
    { q: "What's the anxious thought?", field: 'thought', placeholder: "e.g., Everyone hates me because I made a mistake." },
    { q: "What is the evidence FOR this thought?", field: 'for', placeholder: "Be objective. What happened?" },
    { q: "What is the evidence AGAINST this thought?", field: 'against', placeholder: "Look at facts. Have people been kind before?" },
    { q: "What's the most realistic outcome?", field: 'real', placeholder: "If a friend told you this, what would you say?" }
  ];

  if (step >= steps.length) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-soft bg-[#F1F8E9] text-center p-10 border-[#D4E2D4]">
        <Sparkles size={40} className="mx-auto mb-6 text-[#33691E]/60" />
        <h3 className="font-sans font-semibold text-2xl text-[#33691E] mb-6">Balanced Perspective</h3>
        <div className="text-left space-y-6 mb-10">
          <div className="p-6 bg-white rounded-3xl border border-[#D4E2D4] shadow-sm">
            <p className="text-[10px] font-bold text-[#33691E] uppercase tracking-widest mb-3">Realistic View</p>
            <p className="text-[#4A4E69] italic font-serif text-lg leading-relaxed">"{data.real}"</p>
          </div>
        </div>
        <button onClick={() => setStep(0)} className="btn-primary w-full bg-[#33691E]">Start Over</button>
      </motion.div>
    );
  }

  return (
    <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="card-soft bg-white">
      <div className="flex justify-between items-center mb-8">
        <span className="text-[10px] font-bold text-[#4A4E69]/30 uppercase tracking-widest">Step {step + 1} of 4</span>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-10 h-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-[#4A4E69]' : 'bg-[#F0EBE3]'}`} />
          ))}
        </div>
      </div>
      <h3 className="font-sans font-semibold text-2xl text-[#4A4E69] mb-8 leading-tight">{steps[step].q}</h3>
      <textarea
        value={(data as any)[steps[step].field]}
        onChange={(e) => setData({ ...data, [steps[step].field]: e.target.value })}
        placeholder={steps[step].placeholder}
        className="w-full h-40 p-6 rounded-[24px] bg-[#FAF9F6] border border-[#F0EBE3] outline-none focus:ring-2 focus:ring-[#DCD6F7] text-[#4A4E69] mb-8 resize-none text-sm leading-relaxed"
      />
      <button 
        disabled={!(data as any)[steps[step].field].trim()}
        onClick={() => setStep(step + 1)} 
        className="btn-primary w-full py-4 text-xs font-bold uppercase tracking-widest"
      >
        Continue
      </button>
    </motion.div>
  );
}
