import React, { useState, useRef, useEffect } from 'react';
import { getGemini, MODELS, SYSTEM_INSTRUCTIONS } from '../lib/gemini';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User, Bot, Loader2, Info } from 'lucide-react';
import Markdown from 'react-markdown';

export default function AIAssistant() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const gemini = getGemini();
      if (!gemini) {
        throw new Error("AI service is not configured.");
      }
      
      const chat = gemini.chats.create({
        model: MODELS.TEXT,
        config: {
          systemInstruction: SYSTEM_INSTRUCTIONS.COMPANION,
        },
        history: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }))
      });

      const result = await chat.sendMessage({ message: input });
      const botMessage = { role: 'model', text: result.text };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I'm having trouble connecting right now. Let's try a breathing exercise together instead?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const geminiAvailable = !!process.env.GEMINI_API_KEY;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-160px)]">
      <header className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-[#4A4E69] rounded-2xl flex items-center justify-center text-white shadow-sm">
          <Bot size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-sans font-semibold text-[#4A4E69] tracking-tight">Lumi AI</h1>
          <p className="text-[10px] text-[#4A4E69]/40 font-bold uppercase tracking-widest">
            {geminiAvailable ? 'Always Listening' : 'Offline Temporarily'}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto mb-6 space-y-6 px-1 custom-scrollbar" ref={scrollRef}>
        {!geminiAvailable && (
          <div className="bg-[#FAF9F6] border border-[#F0EBE3] p-6 rounded-[32px] text-center space-y-3">
            <Bot size={32} className="mx-auto text-[#4A4E69]/20" />
            <h3 className="font-semibold text-[#4A4E69]">Lumi is resting</h3>
            <p className="text-xs text-[#4A4E69]/60 leading-relaxed">
              To talk to Lumi, please ensure a Gemini API key is configured in your project settings. 
              In the meantime, feel free to use the mood tracker or breathing exercises.
            </p>
          </div>
        )}
        {messages.length === 0 && geminiAvailable && (
          <div className="text-center py-16">
            <Sparkles className="mx-auto mb-6 text-[#DCD6F7]" size={48} />
            <h3 className="font-sans font-semibold text-[#4A4E69] text-xl mb-3 tracking-tight">Hello, {profile?.displayName}!</h3>
            <p className="text-[#4A4E69]/60 text-sm max-w-xs mx-auto mb-10 leading-relaxed italic">
              I'm your Lumi. I'm here to listen without judgment. How is your inner weather today?
            </p>
            <div className="grid grid-cols-1 gap-3 max-w-xs mx-auto">
              {[
                "I'm feeling very overwhelmed.",
                "How do I stop overthinking?",
                "Suggest a grounding exercise.",
                "I'm proud of myself today!"
              ].map((hint, i) => (
                <button 
                  key={i}
                  onClick={() => setInput(hint)}
                  className="p-4 text-xs text-[#4A4E69] bg-white border border-[#F0EBE3] rounded-3xl hover:border-[#DCD6F7] hover:bg-[#FAF9F6] transition-all text-left font-medium shadow-sm"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] p-5 rounded-[28px] text-sm shadow-sm ${
                m.role === 'user' 
                  ? 'bg-[#4A4E69] text-white rounded-tr-none' 
                  : 'bg-white text-[#4A4E69] border border-[#F0EBE3] rounded-tl-none font-medium'
              }`}>
                <div className="markdown-body leading-relaxed">
                  <Markdown>{m.text}</Markdown>
                </div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="bg-white p-5 rounded-[28px] rounded-tl-none border border-[#F0EBE3] shadow-sm">
                <Loader2 size={24} className="animate-spin text-[#DCD6F7]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={`bg-white p-3 rounded-[32px] border border-[#F0EBE3] flex gap-3 shadow-sm mb-6 ${!geminiAvailable ? 'opacity-50 grayscale' : ''}`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={geminiAvailable ? "Talk to Lumi..." : "AI unavailable"}
          disabled={!geminiAvailable}
          className="flex-1 bg-transparent px-5 py-4 outline-none text-[#4A4E69] text-sm font-medium placeholder:text-[#4A4E69]/20"
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isTyping || !geminiAvailable}
          className="w-14 h-14 bg-[#4A4E69] rounded-[24px] flex items-center justify-center text-white disabled:opacity-30 transition-all shadow-md hover:bg-[#4A4E69]/90 active:scale-95"
        >
          <Send size={24} strokeWidth={2.5} />
        </button>
      </div>
      
      <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <Info size={12} />
        <span>I am an AI. If in crisis, seek professional help.</span>
      </div>
    </div>
  );
}
