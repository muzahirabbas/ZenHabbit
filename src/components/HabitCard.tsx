
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Edit2, Save } from 'lucide-react';
import { Habit } from '../types';
import { useStore } from '../store/useStore';
import { GAME_CONFIG } from '../config/constants';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';

export const HabitCard: React.FC<{ habit: Habit }> = ({ habit }) => {
  const { processReward, updateHabit } = useStore();
  const { user: authUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(habit.title);
  const [editEp, setEditEp] = useState(habit.epReward || 5);

  const handleComplete = async () => {
    // If already completed, toggle back to incomplete (Undo)
    if (habit.completedToday) {
      updateHabit(habit.id, { completedToday: false });
      return;
    }

    // Optimistic UI
    updateHabit(habit.id, { completedToday: true });
    // Use dynamic EP
    const reward = habit.epReward || GAME_CONFIG.REWARDS.CHECKBOX_EP;
    processReward(reward, GAME_CONFIG.REWARDS.CHECKBOX_GOLD, habit.id);

    // In production, this calls the Cloudflare Worker via api.ts
    if (authUser) {
      try {
        await api.completeHabit(authUser.uid, habit.id);
      } catch (error) {
        console.error("Failed to sync habit completion", error);
      }
    }
  };

  const handleSave = () => {
    updateHabit(habit.id, { title: editTitle, epReward: editEp });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="p-4 mb-3 rounded-2xl bg-white/10 border border-white/20 flex flex-col gap-2">
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="bg-transparent border-b border-white/20 pb-1 text-white font-medium focus:outline-none focus:border-blue-400"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">EP:</span>
            <input
              type="number"
              min="1"
              value={editEp}
              onChange={(e) => setEditEp(parseInt(e.target.value) || 0)}
              className="w-12 bg-transparent border-b border-white/20 pb-1 text-white text-xs text-center focus:outline-none focus:border-blue-400"
            />
          </div>
          <button onClick={handleSave} className="text-green-400 hover:text-green-300">
            <Save size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0, borderColor: habit.completedToday ? 'rgba(74, 222, 128, 0.4)' : 'rgba(255, 255, 255, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 mb-3 rounded-2xl backdrop-blur-md border flex items-center justify-between group transition-colors duration-300 ${habit.completedToday ? 'bg-green-500/10' : 'bg-white/5 hover:bg-white/10'
        }`}
    >
      <div className="flex-1">
        <div className="flex items-center justify-between pr-4">
          <h3 className={`text-lg font-medium transition-colors ${habit.completedToday ? 'text-green-200' : 'text-white/90'}`}>{habit.title}</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="text-white/20 hover:text-white/60 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${habit.completedToday ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/50'}`}>
            +{habit.epReward || GAME_CONFIG.REWARDS.CHECKBOX_EP} EP
          </span>
        </div>
      </div>
      <motion.button
        onClick={handleComplete}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="text-accent relative"
      >
        {habit.completedToday ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <div className="absolute inset-0 bg-green-500 blur-md opacity-50 rounded-full" />
            <CheckCircle2 size={32} className="text-green-400 relative z-10" />
          </motion.div>
        ) : (
          <Circle size={32} className="text-white/20 hover:text-white/40 transition-colors" />
        )}
      </motion.button>
    </motion.div>
  );
};
