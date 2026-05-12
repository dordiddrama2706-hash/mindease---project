import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, Heart } from 'lucide-react';

export default function Auth() {
  const { login, loading: authLoading } = useAuth();
  const [step, setStep] = React.useState(() => {
    // Preserve progress even across refreshes
    const savedStep = localStorage.getItem('onboarding_step');
    const completed = localStorage.getItem('onboarding_complete') === 'true';
    if (completed) return -1; // -1 means finished onboarding, show login
    return savedStep ? parseInt(savedStep, 10) : 0;
  });

  const [isFinishing, setIsFinishing] = React.useState(false);

  const handleNext = (next: number) => {
    setStep(next);
    localStorage.setItem('onboarding_step', next.toString());
  };

  const handleFinish = async () => {
    setIsFinishing(true);
    localStorage.setItem('onboarding_complete', 'true');
    localStorage.removeItem('onboarding_step');
    try {
      await login();
    } finally {
      setIsFinishing(false);
    }
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
      action: handleFinish
    }
  ];

  // Login only view (After onboarding is finished)
  if (step === -1) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF9F6] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center relative z-10"
        >
          <div className="w-24 h-24 bg-[#4A4E69] rounded-[40px] mx-auto mb-10 flex items-center justify-center shadow-sm border border-[#F0EBE3]">
            <Heart size={48} className="text-[#DCD6F7] fill-[#DCD6F7]" strokeWidth={1} />
          </div>
          <h1 className="text-4xl font-sans font-semibold text-[#4A4E69] mb-3 tracking-tight">Welcome Back</h1>
          <p className="text-[#4A4E69]/40 text-[10px] uppercase font-bold tracking-[6px] mb-12">Continue your wellness journey</p>
          
          <div className="card-soft mb-8 bg-white border border-[#F0EBE3] p-10 shadow-sm rounded-[40px]">
            <button
              onClick={login}
              disabled={authLoading}
              className="w-full btn-primary flex items-center justify-center gap-4 py-4 text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              <LogIn size={20} />
              {authLoading ? 'Connecting...' : 'Sign in with Google'}
            </button>
            <button 
              onClick={() => { localStorage.removeItem('onboarding_complete'); setStep(0); }}
              className="mt-6 text-[10px] text-[#4A4E69]/30 uppercase tracking-widest font-bold hover:text-[#4A4E69] transition-colors"
            >
              Restart Tour
            </button>
          </div>
        </motion.div>
        <DecorativeOrbs />
      </div>
    );
  }

  const currentStep = steps[step] || steps[0];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FAF9F6] relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-sm text-center relative z-10"
        >
          <div className="w-24 h-24 bg-[#4A4E69] rounded-[40px] mx-auto mb-10 flex items-center justify-center shadow-sm border border-[#F0EBE3]">
            <Heart size={48} className="text-[#DCD6F7] fill-[#DCD6F7]" strokeWidth={1} />
          </div>
          
          <h1 className="text-4xl font-sans font-semibold text-[#4A4E69] mb-3 tracking-tight">{currentStep.title}</h1>
          <p className="text-[#4A4E69]/40 text-[10px] uppercase font-bold tracking-[6px] mb-16">{currentStep.subtitle}</p>
          
          <div className="card-soft mb-12 bg-white border border-[#F0EBE3] p-10 shadow-sm rounded-[40px]">
            <p className="text-sm text-[#4A4E69] mb-10 italic font-serif leading-relaxed h-12 flex items-center justify-center">
              "{currentStep.quote}"
            </p>
            <button
              onClick={currentStep.action}
              disabled={isFinishing || authLoading}
              className="w-full btn-primary flex items-center justify-center gap-4 py-4 text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
            >
              {(step === 1 || isFinishing) && <LogIn size={20} />}
              {isFinishing || authLoading ? 'Connecting...' : currentStep.buttonText}
            </button>
          </div>
          
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, i) => (
              <button 
                key={i} 
                onClick={() => handleNext(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === step ? 'bg-[#4A4E69] w-4' : 'bg-[#4A4E69]/10'}`} 
              />
            ))}
          </div>
          
          <button 
            onClick={() => handleFinish()}
            className="text-[10px] text-[#4A4E69]/20 uppercase tracking-widest font-bold hover:text-[#4A4E69] transition-colors"
          >
            Skip Onboarding
          </button>
        </motion.div>
      </AnimatePresence>
      <DecorativeOrbs />
    </div>
  );
}

function DecorativeOrbs() {
  return (
    <>
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
    </>
  );
}

