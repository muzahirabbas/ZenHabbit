import React, { useState } from 'react';
import { Wrench } from 'lucide-react';
import { useStore } from '../store/useStore';

export const DevTools: React.FC = () => {
  const { user, updateUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  const setDateOffset = (field: 'lastResetDate' | 'lastStreakUpdate', days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    updateUser({ [field]: date.toISOString() });
    alert(`Set ${field} to ${days} days ago.`);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      updateUser({ debugDate: newDate.toISOString() });
    }
  };

  const clearDebugDate = () => {
    updateUser({ debugDate: undefined });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 p-3 rounded-full bg-black/50 text-white/20 hover:text-white hover:bg-black/80 transition-all z-50 border border-white/10"
      >
        <Wrench size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-6 p-4 rounded-xl bg-[#0a0a0f] border border-white/20 z-50 shadow-2xl w-64">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Wrench size={16} /> Developer Tools
        </h3>
        <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white">X</button>
      </div>

      <div className="space-y-4">
        <div className="p-2 bg-white/5 rounded border border-white/10 mb-4">
          <p className="text-xs text-blue-300 uppercase font-bold mb-2">Time Machine</p>
          <input
            type="datetime-local"
            onChange={handleDateChange}
            className="w-full bg-black/50 border border-white/20 rounded text-xs text-white p-1 mb-2"
          />
          <div className="flex justify-between items-center text-[10px] text-white/50">
            <span>Current Sim: {user.debugDate ? new Date(user.debugDate).toLocaleDateString() : 'Real Time'}</span>
            {user.debugDate && (
              <button onClick={clearDebugDate} className="text-red-400 hover:text-red-300">Reset</button>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Manual Resets (Legacy)</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDateOffset('lastResetDate', 1)}
              className="px-2 py-1 bg-white/10 rounded text-xs text-white hover:bg-white/20"
            >
              Reset: Yesterday
            </button>
            <button
              onClick={() => setDateOffset('lastResetDate', 0)}
              className="px-2 py-1 bg-white/10 rounded text-xs text-white hover:bg-white/20"
            >
              Reset: Today
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Streak Testing</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setDateOffset('lastStreakUpdate', 1)}
              className="px-2 py-1 bg-white/10 rounded text-xs text-white hover:bg-white/20"
            >
              Streak: Yesterday
            </button>
            <button
              onClick={() => setDateOffset('lastStreakUpdate', 2)}
              className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs hover:bg-red-500/30"
            >
              Streak: Broken (2d)
            </button>
          </div>
        </div>

        <div>
          <p className="text-xs text-red-400 mb-2 uppercase tracking-wider font-bold">Rogue Mode</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { useStore.getState().spawnBoss(); }}
              className="px-2 py-1 bg-red-900/30 border border-red-500/30 rounded text-xs text-red-200 hover:bg-red-900/50"
            >
              Spawn Boss
            </button>
            <button
              onClick={() => {
                const state = useStore.getState();
                if (state.activeBoss) {
                  state.setState({
                    activeBoss: { ...state.activeBoss, currentHp: 0, defeated: true, active: false }
                  });
                }
              }}
              className="px-2 py-1 bg-green-900/30 border border-green-500/30 rounded text-xs text-green-200 hover:bg-green-900/50"
            >
              Kill Boss
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10 text-xs text-white/30">
          <p>Current Streak: {user.currentStreak}</p>
          <p>Last Reset: {user.lastResetDate?.split('T')[0]}</p>
        </div>
      </div>
    </div>
  );
};