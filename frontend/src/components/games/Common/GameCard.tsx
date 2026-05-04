import React from 'react';
import { motion } from 'framer-motion';

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: string;
  players: string;
  onClick?: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon,
  color,
  difficulty,
  players,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-xl overflow-hidden shadow-lg cursor-pointer h-full`}
    >
      <div className="p-6">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/80 text-sm mb-4">{description}</p>
        <div className="flex justify-between text-xs text-white/70">
          <span>🎯 {difficulty}</span>
          <span>👥 {players}</span>
        </div>
      </div>
    </motion.div>
  );
};