import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Heart } from 'lucide-react';

export default function Auth() {
  const { login } = useAuth();
  const [step, setStep] = React.useState(() => {
    const saved = localStorage.getItem('onboarding_step');
    return saved ? parseInt(saved, 10) : 0;
  });

  const handleNext = (next: number) => {
    setStep(next);
    localStorage.setItem('onboarding_step', next.toString());
  };

  const steps = [
    {
      title: "MindEase",
      subtitle: "Your inner sanctuary",
      quote: "Breathe. You are exactly where you need to be.",
      buttonText: "Continue",
      action: () => handleNext(1)
    },
    {
      title: "Safe Space",
      subtitle: "Private & Secure",
      quote: "Your thoughts are your own. We never share your data.",
      buttonText: "Get Started",
      action: login
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF9F6]">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-24 h-24 bg-[#4A4E69] rounded-[40px] mx-auto mb-10 flex items-center justify-center shadow-sm border border-[#F0EBE3]">
            <Heart size={48} className="text-[#DCD6F7] fill-[#DCD6F7]" strokeWidth={1} />
          </div>
          
          <h1 className="text-4xl font-sans font-semibold text-[#4A4E69] mb-3 tracking-tight">{currentStep.title}</h1>
          <p className="text-[#4A4E69]/40 text-[10px] uppercase font-bold tracking-[6px] mb-16">{currentStep.subtitle}</p>
          
          <div className="card-soft mb-12 bg-white border border-[#F0EBE3] p-10 shadow-sm rounded-[40px]">
            <p className="text-sm text-[#4A4E69] mb-10 italic font-serif leading-relaxed">
              "{currentStep.quote}"
            </p>
            <button
              onClick={currentStep.action}
              className="w-full btn-primary flex items-center justify-center gap-4 py-4 text-xs uppercase tracking-widest transition-all active:scale-95"
            >
              {step === 1 && <LogIn size={20} />}
              {currentStep.buttonText}
            </button>
          </div>
          
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === step ? 'bg-[#4A4E69] w-4' : 'bg-[#4A4E69]/10'}`} 
              />
            ))}
          </div>
          
          <p className="text-[10px] text-[#4A4E69]/20 uppercase tracking-widest font-bold">
            {step === 0 ? "Gentle & Supportive" : "Encrypted & Anonymous"}
          </p>
        </motion.div>
      </AnimatePresence>
      
      {/* Decorative Orbs */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          x: [0, 20, 0]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="fixed top-20 -left-20 w-96 h-96 bg-[#DCD6F7] rounded-full blur-[120px] opacity-20 -z-10"
      />
      <motion.div
        animate={{ 
          y: [0, 30, 0],
          x: [0, -20, 0]
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="fixed bottom-20 -right-20 w-[500px] h-[500px] bg-[#F0EBE3] rounded-full blur-[150px] opacity-30 -z-10"
      />
    </div>
  );
}
