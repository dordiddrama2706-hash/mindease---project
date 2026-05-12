import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../lib/firestore_hooks';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Calendar, Trash2, ChevronRight, PlusCircle } from 'lucide-react';
import { format } from 'date-fns';

const moodConfig = [
  { level: 1, emoji: '😔', label: 'Struggling', color: 'bg-red-50 text-red-600 border-red-100' },
  { level: 2, emoji: '😕', label: 'Meh', color: 'bg-[#FFF3E0] text-[#E65100] border-[#FFE0B2]' },
  { level: 3, emoji: '😐', label: 'Steady', color: 'bg-[#E0F2F1] text-[#00695C] border-[#B2DFDB]' },
  { level: 4, emoji: '😊', label: 'Calm', color: 'bg-[#F1F8E9] text-[#33691E] border-[#D4E2D4]' },
  { level: 5, emoji: '🥰', label: 'Grateful', color: 'bg-[#F3E5F5] text-[#7B1FA2] border-[#E1BEE7]' },
];

export default function MoodTracker() {
  const { user } = useAuth();
  const { addMood } = useFirestore();
  const [moods, setMoods] = useState<any[]>([]);
  const [showSelector, setShowSelector] = useState(false);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'moods'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMoods(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleMoodSubmit = async (level: number) => {
    await addMood(level, [], note);
    setNote('');
    setShowSelector(false);
  };

  const chartData = [...moods].reverse().map(m => ({
    date: format(m.timestamp.toDate(), 'MM/dd'),
    level: m.level,
  }));

  return (
    <div className="space-y-8 pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-sans font-semibold text-[#4A4E69] tracking-tight">Your Journey</h1>
          <p className="text-[#4A4E69]/50 text-[10px] tracking-widest uppercase font-bold mt-1">Track your emotional resilience.</p>
        </div>
        <button 
          onClick={() => setShowSelector(!showSelector)}
          className="w-12 h-12 bg-[#4A4E69] rounded-full flex items-center justify-center text-white shadow-sm"
        >
          <PlusCircle size={24} />
        </button>
      </header>

      {showSelector && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="card-soft bg-white border-[#F0EBE3]">
          <h3 className="text-center font-bold text-[#4A4E69] mb-8 uppercase tracking-widest text-xs">How are you right now?</h3>
          <div className="flex justify-between mb-10 px-2">
            {moodConfig.map((m) => (
              <button
                key={m.level}
                onClick={() => handleMoodSubmit(m.level)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="text-4xl group-hover:scale-125 transition-transform">{m.emoji}</div>
                <span className="text-[10px] font-bold text-[#4A4E69]/30 uppercase tracking-tighter">{m.label}</span>
              </button>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any thoughts you'd like to capture? (optional)"
            className="w-full h-24 p-6 rounded-[24px] bg-[#FAF9F6] border border-[#F0EBE3] text-sm focus:outline-none focus:ring-2 focus:ring-[#DCD6F7] transition-all resize-none"
          />
        </motion.div>
      )}

      {/* Emotion Trends */}
      <section className="card-soft overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold text-[#4A4E69] uppercase tracking-widest opacity-40">Mood Trends</h3>
          <Calendar size={18} className="text-[#4A4E69]/20" />
        </div>
        <div className="h-64 w-full -ml-4">
          {moods.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EBE3" />
                <XAxis dataKey="date" hide />
                <YAxis domain={[1, 5]} hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: '1px solid #F0EBE3', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', backgroundColor: '#fff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="level" 
                  stroke="#4A4E69" 
                  strokeWidth={4} 
                  dot={{ r: 6, fill: '#DCD6F7', stroke: '#4A4E69', strokeWidth: 2 }}
                  activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-[#4A4E69]/30 italic text-sm">
              Log your mood to see your trends.
            </div>
          )}
        </div>
      </section>

      {/* History */}
      <section className="space-y-4">
        <h3 className="font-sans font-semibold text-xl text-[#4A4E69]">Recent Logs</h3>
        {moods.map((m) => {
          const config = moodConfig.find(c => c.level === m.level)!;
          return (
            <div key={m.id} className={`flex items-center gap-5 p-5 rounded-[24px] border transition-all hover:bg-white/50 ${config.color}`}>
              <div className="text-4xl">{config.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-sm tracking-tight">{config.label}</h4>
                  <span className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">
                    {format(m.timestamp.toDate(), 'MMM dd, h:mm a')}
                  </span>
                </div>
                {m.note && <p className="text-xs truncate opacity-70 italic font-serif">"{m.note}"</p>}
              </div>
              <ChevronRight size={16} className="opacity-20" />
            </div>
          );
        })}
      </section>
    </div>
  );
}
