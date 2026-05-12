
import React, { useState } from 'react';
import { usePin } from '../context/PinContext';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, ShieldCheck, ArrowRight, Delete } from 'lucide-react';

export default function PinLock({ children }: { children: React.ReactNode }) {
  const { isPinSet, isUnlocked, unlockApp } = usePin();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        if (unlockApp(newPin)) {
          setPin('');
          setError(false);
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 600);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  if (!isPinSet || isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF9F6] flex flex-col items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center w-full max-w-xs"
      >
        <div className="w-20 h-20 bg-[#4A4E69] rounded-[32px] mx-auto mb-8 flex items-center justify-center shadow-lg">
          <Lock size={32} className="text-white" />
        </div>
        
        <h2 className="text-2xl font-sans font-semibold text-[#4A4E69] mb-2">App Locked</h2>
        <p className="text-xs text-[#4A4E69]/40 uppercase font-bold tracking-widest mb-12">Enter PIN to continue</p>

        <div 
          className={`flex justify-center gap-4 mb-16 transition-transform ${error ? 'animate-shake' : ''}`}
        >
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i}
              className={`w-4 h-4 rounded-full border-2 border-[#4A4E69]/20 transition-all ${
                pin.length > i ? 'bg-[#4A4E69] border-[#4A4E69] scale-110' : ''
              } ${error ? 'border-red-400 bg-red-400' : ''}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button
              key={n}
              onClick={() => handleKeyPress(n.toString())}
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold text-[#4A4E69] hover:bg-[#DCD6F7]/30 active:scale-95 transition-all"
            >
              {n}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleKeyPress('0')}
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold text-[#4A4E69] hover:bg-[#DCD6F7]/30 active:scale-95 transition-all"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-16 h-16 rounded-full flex items-center justify-center text-[#4A4E69]/40 hover:text-[#4A4E69] active:scale-95 transition-all"
          >
            <Delete size={20} />
          </button>
        </div>

        <button 
          onClick={() => {
            if (confirm("Reset App? This will clear all local data including entries.")) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="mt-12 text-[10px] text-[#4A4E69]/20 uppercase tracking-[4px] font-bold hover:text-[#4A4E69] transition-colors"
        >
          Forgot PIN?
        </button>
      </motion.div>
    </div>
  );
}
