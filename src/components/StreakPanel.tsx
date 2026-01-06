import React from 'react';
import { Flame } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getIsoDate, getCurrentDate } from '../utils/time';

export const StreakPanel: React.FC = () => {
  const { user, updateUser } = useStore();
  
  const today = getIsoDate();
  const lastUpdate = user.lastStreakUpdate ? user.lastStreakUpdate.split('T')[0] : '';
  const isCheckedIn = lastUpdate === today;

  const handleCheckIn = () => {
    if (isCheckedIn) return;
    
    // Increment Streak
    updateUser({
      currentStreak: user.currentStreak + 1,
      lastStreakUpdate: getCurrentDate().toISOString()
    });
  };

  return (
    <div className="mx-6 mt-4 mb-6 p-4 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-full ${isCheckedIn ? 'bg-orange-500 text-white' : 'bg-white/10 text-white/50'} transition-colors`}>
          <Flame size={24} className={isCheckedIn ? 'animate-pulse' : ''} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{user.currentStreak} Day Streak</h3>
          <p className="text-xs text-white/60">
            {isCheckedIn ? "Flame is burning bright!" : "Check in to keep the fire alive."}
          </p>
        </div>
      </div>

      <button
        onClick={handleCheckIn}
        disabled={isCheckedIn}
        className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
          isCheckedIn 
            ? 'bg-white/10 text-white/30 cursor-default' 
            : 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20'
        }`}
      >
        {isCheckedIn ? 'Checked In' : 'Check In'}
      </button>
    </div>
  );
};