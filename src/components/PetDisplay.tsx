
import React from 'react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';

export const PetDisplay: React.FC = () => {
  const { pet } = useStore();

  const getPetEmoji = () => {
    switch(pet.stage) {
      case 'EGG': return '🥚';
      case 'BABY': return '☁️';
      case 'ADULT': return '🐉';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-12">
      <motion.div
        animate={{
          y: [0, -10, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-8xl filter drop-shadow-2xl"
      >
        {getPetEmoji()}
      </motion.div>
      
      <div className="mt-8 w-full max-w-xs bg-white/5 h-2 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-blue-400"
          initial={{ width: 0 }}
          animate={{ width: `${(pet.totalEp % 500) / 5}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-white/40 uppercase tracking-widest">
        Evolution Progress
      </p>
    </div>
  );
};
