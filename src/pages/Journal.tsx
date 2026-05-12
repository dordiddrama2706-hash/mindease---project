import React, { useState, useEffect } from 'react';
import { useFirestore, useJournalEntries } from '../lib/firestore_hooks';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Search, Calendar, ChevronRight, PenTool, Save, X } from 'lucide-react';
import { format } from 'date-fns';

export default function Journal() {
  const { addJournalEntry } = useFirestore();
  const { entries, loading } = useJournalEntries();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<any | null>(null);

  const handleSave = async () => {
    if (!content.trim()) return;
    await addJournalEntry(content, title || 'Daily Entry');
    setIsEditing(false);
    setContent('');
    setTitle('');
  };

  return (
    <div className="space-y-6 pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-semibold text-[#4A4E69] tracking-tight">Journal</h1>
          <p className="text-[#4A4E69]/40 text-[10px] tracking-widest uppercase font-bold mt-1">Write your way to clarity.</p>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="btn-primary flex items-center gap-2 text-xs uppercase tracking-widest"
        >
          <Plus size={16} />
          New Entry
        </button>
      </header>

      <AnimatePresence>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col p-4 md:p-8"
          >
            <div className="max-w-screen-md mx-auto w-full flex flex-col h-full bg-white rounded-[40px] shadow-sm border border-[#F0EBE3] p-8 md:p-12 overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <button onClick={() => setIsEditing(false)} className="p-3 text-[#4A4E69]/40 hover:text-[#4A4E69] transition-colors rounded-full hover:bg-[#FAF9F6]">
                  <X size={24} />
                </button>
                <div className="flex gap-4">
                  <button onClick={handleSave} className="btn-primary py-3 flex items-center gap-2 text-[10px] uppercase tracking-widest px-6">
                    <Save size={16} />
                    Save
                  </button>
                </div>
              </div>

              <input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry Title..." 
                className="text-4xl font-sans font-semibold text-[#4A4E69] outline-none mb-10 placeholder:text-[#4A4E69]/10 tracking-tight"
              />
              
              <div className="flex-1 flex flex-col overflow-hidden">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your thoughts here..."
                  className="flex-1 text-lg text-[#4A4E69] outline-none resize-none placeholder:text-[#4A4E69]/10 leading-[1.8] font-serif custom-scrollbar"
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-4">
        {entries.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] border border-[#F0EBE3] shadow-sm">
            <PenTool className="mx-auto mb-6 text-[#4A4E69]/10" size={56} strokeWidth={1} />
            <p className="text-[#4A4E69]/30 font-sans italic">Your journal is empty. What's on your mind?</p>
          </div>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => setSelectedEntry(entry)}
              className="card-soft text-left p-6 group flex items-start gap-6 border-[#F0EBE3]"
            >
              <div className="bg-[#FAF9F6] w-14 h-14 rounded-3xl shrink-0 flex flex-col items-center justify-center text-[#4A4E69] shadow-sm border border-[#F0EBE3]">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-40">{format(entry.timestamp.toDate(), 'MMM')}</span>
                <span className="text-xl font-bold leading-none tracking-tighter">{format(entry.timestamp.toDate(), 'dd')}</span>
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="font-bold text-[#4A4E69] mb-2 group-hover:text-[#4A4E69] transition-colors uppercase text-sm tracking-tight">{entry.title}</h3>
                <p className="text-[#4A4E69]/50 text-xs line-clamp-2 leading-relaxed italic font-serif">"{entry.content}"</p>
              </div>
              <ChevronRight size={20} className="text-[#4A4E69]/20 self-center group-hover:text-[#4A4E69] transition-all group-hover:translate-x-1" />
            </button>
          ))
        )}
      </div>

      {selectedEntry && (
        <div className="fixed inset-0 z-40 bg-[#FAF9F6]/80 backdrop-blur-md flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card-soft max-w-xl w-full max-h-[85vh] overflow-y-auto bg-white shadow-2xl border-[#F0EBE3] p-10">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-[#F1F8E9] p-3 rounded-2xl text-[#5A5A40] shadow-sm"><Calendar size={20} /></div>
                <span className="text-[10px] font-bold text-[#4A4E69]/30 uppercase tracking-widest">{format(selectedEntry.timestamp.toDate(), 'PPPP')}</span>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="p-3 text-[#4A4E69]/20 hover:text-[#4A4E69] transition-colors rounded-full hover:bg-[#FAF9F6]"><X size={24} /></button>
            </div>
            <h2 className="text-4xl font-sans font-semibold text-[#4A4E69] mb-8 tracking-tight">{selectedEntry.title}</h2>
            <div className="text-[#4A4E69] leading-[1.8] whitespace-pre-wrap mb-10 italic font-serif text-lg bg-[#FAF9F6] p-8 rounded-[32px] border border-[#F0EBE3]">
              "{selectedEntry.content}"
            </div>
            <button onClick={() => setSelectedEntry(null)} className="w-full btn-primary uppercase tracking-widest text-[10px] py-4">Close Entry</button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
