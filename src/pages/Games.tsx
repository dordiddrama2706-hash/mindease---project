import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ghost, Sparkles, Gamepad2, X, Trophy } from 'lucide-react';

export default function Games() {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-sans font-semibold text-[#4A4E69] tracking-tight">Relief Games</h1>
        <p className="text-[#4A4E69]/40 text-[10px] tracking-widest uppercase font-bold mt-1">Light distractions for a racing mind.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => setActiveGame('bubble')}
          className="card-soft bg-white border-[#F0EBE3] group flex flex-col items-center justify-center p-12 gap-6 h-72 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
        >
          <div className="w-24 h-24 bg-[#FAF9F6] rounded-[32px] flex items-center justify-center text-[#4A4E69] shadow-inner border border-[#F0EBE3] group-hover:scale-110 transition-all duration-500">
            <Ghost size={48} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-[#4A4E69] text-xl tracking-tight">Thought Poppers</h3>
            <p className="text-[#4A4E69]/40 text-[10px] uppercase font-bold tracking-widest mt-2 px-4">Pop away intrusive thoughts.</p>
          </div>
        </button>

        <button
          onClick={() => setActiveGame('breathe')}
          className="card-soft bg-white border-[#F0EBE3] group flex flex-col items-center justify-center p-12 gap-6 h-72 shadow-sm transition-all hover:shadow-md active:scale-[0.98] opacity-60"
        >
          <div className="w-24 h-24 bg-[#FAF9F6] rounded-[32px] flex items-center justify-center text-[#4A4E69] shadow-inner border border-[#F0EBE3] group-hover:scale-110 transition-all duration-500">
            <Gamepad2 size={48} strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-[#4A4E69] text-xl tracking-tight">Focus Match</h3>
            <p className="text-[#4A4E69]/40 text-[10px] uppercase font-bold tracking-widest mt-2">Coming Soon</p>
          </div>
        </button>
      </div>

      <AnimatePresence>
        {activeGame === 'bubble' && (
          <BubbleGame onClose={() => setActiveGame(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function BubbleGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Bubble {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      text: string;
      color: string;

      constructor() {
        this.radius = Math.random() * 50 + 40;
        this.x = Math.random() * (canvas!.width - this.radius * 2) + this.radius;
        this.y = canvas!.height + this.radius;
        this.speedY = -(Math.random() * 1.5 + 0.5);
        this.speedX = Math.random() * 1 - 0.5;
        this.text = ["What if?", "Doubt", "Fear", "Regret", "Shoulds", "Anxiety", "Must", "Later"][Math.floor(Math.random() * 8)];
        // Natural Tones palette
        const colors = ['#DCD6F7', '#FAF9F6', '#F0EBE3', '#E0F2F1'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      draw() {
        ctx!.save();
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx!.fillStyle = this.color;
        ctx!.globalAlpha = 0.6;
        ctx!.fill();
        ctx!.strokeStyle = 'rgba(74, 78, 105, 0.1)';
        ctx!.lineWidth = 1;
        ctx!.stroke();
        
        ctx!.globalAlpha = 0.7;
        ctx!.fillStyle = '#4A4E69';
        ctx!.font = 'bold 11px font-sans';
        ctx!.textAlign = 'center';
        ctx!.textBaseline = 'middle';
        ctx!.letterSpacing = '1px';
        ctx!.fillText(this.text.toUpperCase(), this.x, this.y);
        ctx!.restore();
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.x < this.radius || this.x > canvas!.width - this.radius) this.speedX *= -1;
      }
    }

    const spawnBubble = () => {
      if (particles.length < 6) {
        particles.push(new Bubble());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        if (p.y < -p.radius) {
          particles.splice(index, 1);
        }
      });
      spawnBubble();
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleClick = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = ('touches' in e) ? (e as TouchEvent).touches[0].clientX - rect.left : (e as MouseEvent).clientX - rect.left;
      const clickY = ('touches' in e) ? (e as TouchEvent).touches[0].clientY - rect.top : (e as MouseEvent).clientY - rect.top;

      particles.forEach((p, index) => {
        const dx = clickX - p.x;
        const dy = clickY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < p.radius) {
          particles.splice(index, 1);
          setScore(s => s + 10);
        }
      });
    };

    canvas.addEventListener('mousedown', handleClick);
    canvas.addEventListener('touchstart', handleClick);
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col"
    >
      <div className="absolute top-10 left-10 right-10 flex justify-between items-center z-10">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="w-14 h-14 bg-white shadow-sm border border-[#F0EBE3] rounded-[24px] text-[#4A4E69] flex items-center justify-center transition-all hover:bg-[#FAF9F6] active:scale-95">
            <X size={28} />
          </button>
          <div>
            <h2 className="text-2xl font-sans font-semibold text-[#4A4E69] tracking-tight">Thought Poppers</h2>
            <p className="text-[10px] text-[#4A4E69]/30 font-bold uppercase tracking-widest mt-0.5">Let them float away</p>
          </div>
        </div>
        <div className="bg-white px-8 py-4 rounded-[32px] shadow-sm border border-[#F0EBE3] flex items-center gap-4">
          <Trophy size={20} className="text-[#4A4E69]" />
          <span className="font-bold text-[#4A4E69] text-lg tracking-tighter tabular-nums">{score}</span>
        </div>
      </div>
      <canvas ref={canvasRef} className="flex-1 cursor-crosshair" />
      <div className="absolute bottom-16 inset-x-0 text-center pointer-events-none">
        <p className="text-[#4A4E69]/20 uppercase tracking-[4px] text-[10px] font-bold">Tap to release each thought</p>
      </div>
    </motion.div>
  );
}
