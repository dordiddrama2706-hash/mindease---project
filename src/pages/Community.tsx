import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../lib/firestore_hooks';
import { collection, query, orderBy, limit, onSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Heart, AlertCircle, Send, Users, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Community() {
  const { user } = useAuth();
  const { addPost } = useFirestore();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'community'), orderBy('timestamp', 'desc'), limit(50));
    return onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handlePost = async () => {
    if (!content.trim() || isPosting) return;
    setIsPosting(true);
    await addPost(content);
    setContent('');
    setIsPosting(false);
  };

  const handleReport = async (postId: string) => {
    await updateDoc(doc(db, 'community', postId), {
      reportCount: increment(1)
    });
    alert("Post reported for review. Thank you for keeping our community safe.");
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-[#4A4E69] rounded-[24px] flex items-center justify-center text-white shadow-sm border border-[#F0EBE3]">
          <Users size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-3xl font-sans font-semibold text-[#4A4E69] tracking-tight">Support Wall</h1>
          <p className="text-[#4A4E69]/40 text-[10px] uppercase font-bold tracking-[4px] mt-2">Post anonymously, share kindness.</p>
        </div>
      </header>

      {/* Post Box */}
      <section className="card-soft bg-white border-[#F0EBE3] p-8 shadow-sm">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="How are you really feeling? (Anonymously)"
          className="w-full h-28 bg-[#FAF9F6] rounded-[24px] p-6 outline-none text-[#4A4E69] text-base font-medium placeholder:text-[#4A4E69]/20 resize-none mb-6 border border-[#F0EBE3] focus:ring-2 focus:ring-[#DCD6F7] transition-all"
        />
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold text-[#4A4E69]/40 uppercase tracking-widest flex items-center gap-2">
            <Sparkles size={12} className="text-[#DCD6F7]" />
            A Safe Space
          </p>
          <button 
            onClick={handlePost}
            disabled={!content.trim() || isPosting}
            className="btn-primary py-3 px-8 text-[10px] flex items-center gap-2 uppercase tracking-widest"
          >
            <Send size={16} />
            Post
          </button>
        </div>
      </section>

      {/* Feed */}
      <div className="space-y-6">
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-soft bg-white border-[#F0EBE3] p-8 shadow-sm relative group overflow-hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-bold text-[#4A4E69] uppercase tracking-widest bg-[#FAF9F6] px-4 py-2 rounded-full border border-[#F0EBE3] shadow-sm">
                  {post.authorHandle || "Anonymous"}
                </span>
                <span className="text-[10px] font-bold text-[#4A4E69]/20 tabular-nums uppercase tracking-tighter">
                  {formatDistanceToNow(post.timestamp.toDate())} ago
                </span>
              </div>
              <p className="text-[#4A4E69] text-lg leading-relaxed mb-8 italic font-serif">"{post.content}"</p>
              <div className="flex items-center gap-6 text-[#4A4E69]/30">
                <button className="flex items-center gap-2 hover:text-[#4A4E69] transition-all active:scale-95 group/btn">
                  <div className="w-10 h-10 rounded-full bg-[#FAF9F6] flex items-center justify-center border border-[#F0EBE3] group-hover/btn:bg-[#DCD6F7]/20 transition-all">
                    <Heart size={18} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Send Care</span>
                </button>
                <div className="flex-1" />
                <button 
                  onClick={() => handleReport(post.id)}
                  className="p-3 opacity-0 group-hover:opacity-100 transition-opacity text-[#4A4E69]/20 hover:text-red-400 rounded-full hover:bg-red-50"
                  title="Report Post"
                >
                  <AlertCircle size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
