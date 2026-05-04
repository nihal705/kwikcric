import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CricketStadiumProps {
  animation: string | null;
}

export const CricketStadium: React.FC<CricketStadiumProps> = ({ animation }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw cricket pitch
    const drawPitch = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Green pitch background
      ctx.fillStyle = '#1a472a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Pitch lines
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      // Bowling crease
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 50, canvas.height - 60);
      ctx.lineTo(canvas.width / 2 + 50, canvas.height - 60);
      ctx.stroke();
      
      // Batting crease
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 50, 60);
      ctx.lineTo(canvas.width / 2 + 50, 60);
      ctx.stroke();
      
      // Stumps
      for (let i = -1; i <= 1; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(canvas.width / 2 + i * 5, canvas.height - 70, 3, 20);
        ctx.fillRect(canvas.width / 2 + i * 5, 40, 3, 20);
      }
      
      // Ball
      ctx.fillStyle = '#e8a838';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 8, 0, Math.PI * 2);
      ctx.fill();
    };
    
    drawPitch();

    // Handle animations
    if (animation === 'boundary') {
      // Flash effect
      canvas.style.animation = 'flash 0.3s ease-out';
      setTimeout(() => { canvas.style.animation = ''; }, 300);
    } else if (animation === 'six') {
      canvas.style.animation = 'shake 0.3s ease-out';
      setTimeout(() => { canvas.style.animation = ''; }, 300);
    } else if (animation === 'wicket') {
      canvas.style.animation = 'shake 0.2s ease-out';
      setTimeout(() => { canvas.style.animation = ''; }, 200);
    }
  }, [animation]);

  return (
    <div className="relative bg-green-900 h-64 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="w-full h-full object-cover"
      />
      
      {/* Animation Overlay */}
      <AnimatePresence>
        {animation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className={`
              text-6xl font-bold text-white text-center
              ${animation === 'boundary' ? 'animate-bounce' : ''}
              ${animation === 'six' ? 'animate-pulse' : ''}
            `}>
              {animation === 'boundary' && 'FOUR!'}
              {animation === 'six' && 'SIX!'}
              {animation === 'wicket' && 'OUT!'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style>{`
        @keyframes flash {
          0%, 100% { background-color: transparent; }
          50% { background-color: rgba(255, 255, 255, 0.3); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>
    </div>
  );
};