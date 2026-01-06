import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { HabitCard } from './HabitCard';
import { Habit } from '../types';

export const HabitList: React.FC = () => {
  const { habits, addHabit, deleteHabit } = useStore();
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitEp, setNewHabitEp] = useState(5);

  const activeHabits = habits.filter(h => !h.completedToday);
  const completedHabits = habits.filter(h => h.completedToday);

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitTitle,
      type: 'boolean',
      currentValue: 0,
      completedToday: false,
      lastCompleted: '',
      epReward: newHabitEp
    };

    addHabit(newHabit);
    setNewHabitTitle('');
    setNewHabitEp(5);
    setIsAdding(false);
  };

  return (
    <section className="mt-12">
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">Daily Rituals</h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddHabit} className="mb-4 p-4 rounded-xl bg-white/5 border border-white/10">
          <input
            type="text"
            value={newHabitTitle}
            onChange={(e) => setNewHabitTitle(e.target.value)}
            placeholder="Enter new ritual..."
            className="w-full bg-transparent border-b border-white/20 pb-2 mb-3 text-white focus:outline-none focus:border-blue-400"
            autoFocus
          />
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-white/50">EP Reward:</span>
            <input
              type="number"
              min="1"
              max="100"
              value={newHabitEp}
              onChange={(e) => setNewHabitEp(parseInt(e.target.value) || 0)}
              className="w-16 bg-transparent border-b border-white/20 pb-1 text-white text-center focus:outline-none focus:border-blue-400"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-xs text-white/50 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs bg-blue-500/20 text-blue-300 rounded border border-blue-500/30 hover:bg-blue-500/30"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <motion.div
        className="space-y-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {activeHabits.map(habit => (
            <motion.div
              key={habit.id}
              className="relative group"
              layout
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <HabitCard habit={habit} />
              <button
                onClick={() => deleteHabit(habit.id)}
                className="absolute -right-2 top-[-8px] p-1.5 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {activeHabits.length === 0 && !isAdding && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-white/20 text-sm py-4"
          >
            All rituals complete. Zen achieved.
          </motion.p>
        )}
      </motion.div>

      {completedHabits.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-xs text-white/40 uppercase tracking-widest hover:text-white/60 transition-colors mb-4"
          >
            {showCompleted ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Completed ({completedHabits.length})
          </button>

          {showCompleted && (
            <div className="space-y-3 opacity-60">
              {completedHabits.map(habit => (
                <div key={habit.id} className="relative group">
                  <HabitCard habit={habit} />
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="absolute -right-2 top-[-8px] p-1.5 rounded-full bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};