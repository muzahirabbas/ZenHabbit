

import React, { useEffect, useState } from 'react';
import { Map, Clock, Mountain, Cloud } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { GAME_CONFIG } from '../config/constants';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export const AdventurePanel: React.FC = () => {
  const { user, updateUser, pet } = useStore();
  const { user: authUser } = useAuth();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!user.currentAdventure) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      const start = new Date(user.currentAdventure!.startTime).getTime();
      const duration = GAME_CONFIG.ADVENTURE.BASE_DURATION_MS;
      const end = start + duration;
      const now = Date.now();
      const reductionMs = (user.currentAdventure!.reductionSeconds || 0) * 1000;
      
      const adjustedEnd = end - reductionMs;
      const remaining = Math.max(0, adjustedEnd - now);
      
      const elapsed = now - start;
      const totalDuration = adjustedEnd - start;
      const currentProgress = Math.min(100, (elapsed / totalDuration) * 100);

      setTimeLeft(remaining);
      setProgress(currentProgress);
      
      // Auto-complete check could go here
    }, 1000);

    return () => clearInterval(interval);
  }, [user.currentAdventure]);

  const canStart = user.dailyEp >= GAME_CONFIG.REWARDS.ADVENTURE_EP_THRESHOLD;

  const handleStart = async () => {
    if (!authUser || !canStart || loading) return;
    setLoading(true);
    try {
      const res = await api.startAdventure(authUser.uid, user.dailyEp);
      if (res.startTime) {
        updateUser({ 
          currentAdventure: { 
            startTime: new Date(res.startTime).toISOString(), 
            reductionSeconds: 0 
          } 
        });
      }
    } catch (error) {
      console.error("Failed to start adventure", error);
    } finally {
      setLoading(false);
    }
  };

  const getPetEmoji = () => {
    switch(pet.stage) {
      case 'EGG': return '🥚';
      case 'BABY': return '☁️';
      case 'ADULT': return '🐉';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#1a1a2e] border border-white/10 min-h-[160px]">
      
      {/* Background Animation Layer */}
      {user.currentAdventure && (
        <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
          {/* Moving Clouds */}
          <motion.div 
            animate={{ x: [-100, 400] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-4 left-0 text-white/20"
          >
            <Cloud size={40} />
          </motion.div>
          <motion.div 
            animate={{ x: [-100, 400] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 5 }}
            className="absolute top-10 left-0 text-white/10"
          >
             <Cloud size={24} />
          </motion.div>

          {/* Mountains */}
          <div className="absolute bottom-0 w-full flex text-white/10">
            <Mountain size={60} strokeWidth={1} />
            <Mountain size={40} className="-ml-4" strokeWidth={1} />
            <Mountain size={70} className="-ml-6" strokeWidth={1} />
            <Mountain size={50} className="-ml-4" strokeWidth={1} />
             <Mountain size={60} className="-ml-4" strokeWidth={1} />
          </div>
          
          {/* Walking Pet */}
          <motion.div
             className="absolute bottom-4 text-3xl z-10"
             animate={{ x: [-20, 350] }} // Assuming ~350px width container
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {getPetEmoji()}
            </motion.div>
          </motion.div>
        </div>
      )}

      <div className="relative z-20 p-6 h-full flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-2">
          <Map className={`text-blue-300 ${user.currentAdventure ? 'animate-pulse' : ''}`} />
          <div>
            <h2 className="text-xl font-semibold text-white">Mystic Excursion</h2>
            {user.currentAdventure && (
               <p className="text-xs text-blue-300">
                 {Math.round(progress)}% Explored
               </p>
            )}
          </div>
        </div>

        {!user.currentAdventure ? (
          <div>
            <p className="text-sm text-white/60 mb-4">
              Required Energy: {user.dailyEp}/{GAME_CONFIG.REWARDS.ADVENTURE_EP_THRESHOLD} EP
            </p>
            <button 
              disabled={!canStart || loading}
              onClick={handleStart}
              className={`w-full py-3 rounded-xl font-bold transition-colors ${
                canStart ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/20'
              }`}
            >
              {loading ? 'Starting...' : canStart ? 'Embark' : 'Locked'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-white/80 mb-2">
              <Clock size={16} />
              <span className="font-mono text-lg">
                {timeLeft ? new Date(timeLeft).toISOString().substr(11, 8) : '--:--:--'}
              </span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
               <motion.div 
                 className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                 animate={{ width: `${progress}%` }}
               />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
