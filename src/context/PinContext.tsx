
import React, { createContext, useContext, useState, useEffect } from 'react';

interface PinContextType {
  isPinSet: boolean;
  isUnlocked: boolean;
  lockApp: () => void;
  unlockApp: (pin: string) => boolean;
  setAppPin: (pin: string) => void;
  disablePin: () => void;
}

const PinContext = createContext<PinContextType | null>(null);

const PIN_KEY = 'mindease_pin';
const PIN_ENABLED_KEY = 'mindease_pin_enabled';

export function PinProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState<string | null>(localStorage.getItem(PIN_KEY));
  const [isEnabled, setIsEnabled] = useState(localStorage.getItem(PIN_ENABLED_KEY) === 'true');

  const isPinSet = !!pin && isEnabled;

  const lockApp = () => {
    if (isPinSet) {
      setIsUnlocked(false);
    }
  };

  const unlockApp = (inputPin: string) => {
    if (inputPin === pin) {
      setIsUnlocked(true);
      return true;
    }
    return false;
  };

  const setAppPin = (newPin: string) => {
    localStorage.setItem(PIN_KEY, newPin);
    localStorage.setItem(PIN_ENABLED_KEY, 'true');
    setPin(newPin);
    setIsEnabled(true);
    setIsUnlocked(true);
  };

  const disablePin = () => {
    localStorage.removeItem(PIN_ENABLED_KEY);
    setIsEnabled(false);
    setIsUnlocked(true);
  };

  useEffect(() => {
    if (!isPinSet) {
      setIsUnlocked(true);
    }
  }, [isPinSet]);

  return (
    <PinContext.Provider value={{ isPinSet, isUnlocked, lockApp, unlockApp, setAppPin, disablePin }}>
      {children}
    </PinContext.Provider>
  );
}

export function usePin() {
  const context = useContext(PinContext);
  if (!context) throw new Error('usePin must be used within a PinProvider');
  return context;
}
