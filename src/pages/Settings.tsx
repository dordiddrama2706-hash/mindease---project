
import React, { useState } from 'react';
import { usePin } from '../context/PinContext';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';
import { Shield, Lock, ShieldOff, LogOut, ChevronRight, User, Bell, Info } from 'lucide-react';

export default function Settings() {
  const { isPinSet, disablePin, setAppPin } = usePin();
  const { logout, profile, isGuest } = useAuth();
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [newPin, setNewPin] = useState('');

  const handleSetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      setAppPin(newPin);
      setShowPinSetup(false);
      setNewPin('');
    }
  };

  return (
    <div className="space-y-8">
      <header className="mb-10">
        <h2 className="text-sm font-bold text-[#4A4E69]/50 uppercase tracking-widest mb-1">Preferences</h2>
        <h1 className="text-3xl font-sans font-semibold text-[#4A4E69] tracking-tight">Settings</h1>
      </header>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#4A4E69]/40 uppercase tracking-widest px-4">Profile</h3>
        <div className="bg-white rounded-[32px] border border-[#F0EBE3] divide-y divide-[#F0EBE3] overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#DCD6F7]/30 rounded-2xl flex items-center justify-center text-[#4A4E69]">
                <User size={24} />
              </div>
              <div>
                <p className="font-semibold text-[#4A4E69]">{profile?.displayName || 'Friend'}</p>
                <p className="text-xs text-[#4A4E69]/40 uppercase font-bold tracking-widest">
                  {isGuest ? 'Guest Account' : 'Synced Account'}
                </p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#4A4E69]/20" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#4A4E69]/40 uppercase tracking-widest px-4">Security</h3>
        <div className="bg-white rounded-[32px] border border-[#F0EBE3] divide-y divide-[#F0EBE3] overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${isPinSet ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'} rounded-2xl flex items-center justify-center`}>
                <Shield size={24} />
              </div>
              <div>
                <p className="font-semibold text-[#4A4E69]">App Privacy Lock</p>
                <p className="text-xs text-[#4A4E69]/40">{isPinSet ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <button 
              onClick={() => isPinSet ? disablePin() : setShowPinSetup(true)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                isPinSet 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                  : 'bg-[#4A4E69] text-white hover:bg-[#4A4E69]/90'
              }`}
            >
              {isPinSet ? 'Disable' : 'Enable'}
            </button>
          </div>

          {showPinSetup && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="p-6 bg-[#FAF9F6] border-b border-[#F0EBE3]"
            >
              <form onSubmit={handleSetPin} className="space-y-4">
                <p className="text-xs text-[#4A4E69]/60 mb-4">Set a 4-digit PIN to protect your journal and mood data.</p>
                <div className="flex gap-4 items-center">
                  <input
                    type="password"
                    maxLength={4}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 4 digits"
                    className="flex-1 bg-white border border-[#F0EBE3] rounded-2xl px-6 py-4 text-center text-2xl tracking-[10px] outline-none focus:border-[#DCD6F7]"
                    autoFocus
                  />
                  <button 
                    disabled={newPin.length !== 4}
                    className="w-14 h-14 bg-[#4A4E69] rounded-2xl flex items-center justify-center text-white disabled:opacity-30"
                  >
                    < ChevronRight size={24} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-[10px] font-bold text-[#4A4E69]/40 uppercase tracking-widest px-4">System</h3>
        <div className="bg-white rounded-[32px] border border-[#F0EBE3] divide-y divide-[#F0EBE3] overflow-hidden shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center">
                <Bell size={24} />
              </div>
              <p className="font-semibold text-[#4A4E69]">Notifications</p>
            </div>
            <div className="w-12 h-6 bg-slate-100 rounded-full relative">
               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center">
                <Info size={24} />
              </div>
              <div>
                <p className="font-semibold text-[#4A4E69]">About</p>
                <p className="text-xs text-[#4A4E69]/40">Version 2.0.0 (Offline Mode)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button
        onClick={logout}
        className="w-full card-soft bg-white text-red-500 border-red-100 flex items-center justify-center gap-3 py-6"
      >
        <LogOut size={20} />
        <span className="font-bold uppercase tracking-widest text-xs">
          {isGuest ? 'Clear Local Data' : 'Sign Out'}
        </span>
      </button>

      <footer className="pt-10 pb-4 text-center">
        <p className="text-[10px] text-[#4A4E69]/20 uppercase tracking-widest font-bold">
          MindEase • Your Inner Sanctuary
        </p>
      </footer>
    </div>
  );
}
