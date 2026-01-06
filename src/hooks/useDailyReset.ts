import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getCurrentDate, getIsoDate } from '../utils/time';

export const useDailyReset = () => {
  const { user, resetDailyTasks, updateUser } = useStore();

  useEffect(() => {
    const checkReset = () => {
      const now = getCurrentDate();
      const today = getIsoDate();
      
      // 1. Daily Task Reset
      const lastDate = user.lastResetDate ? user.lastResetDate.split('T')[0] : '';

      if (lastDate !== today) {
        console.log("New day detected! Resetting daily tasks...");
        resetDailyTasks();
      }

      // 2. Streak Validation
      // If the last streak update was MORE than 1 day ago (i.e. skipped a full day), reset to 0.
      if (user.lastStreakUpdate) {
        // If diffDays > 2 (meaning we missed yesterday), streak resets.
        // Actually, precise day diff:
        // Today is 2023-01-03. Last update 2023-01-02. Diff is 1 day. OK.
        // Today is 2023-01-03. Last update 2023-01-01. Diff is 2 days. BROKEN.
        
        // We can just compare date strings for simplicity if we ignore timezones for this prototype
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        const lastStreakDay = user.lastStreakUpdate.split('T')[0];

        // If it's NOT today AND NOT yesterday, it's broken.
        if (lastStreakDay !== today && lastStreakDay !== yesterdayStr) {
           if (user.currentStreak > 0) {
             console.log("Streak broken! Resetting to 0.");
             updateUser({ currentStreak: 0 });
           }
        }
      }
    };

    checkReset();
    
    // Optional: Set an interval to check for midnight crossover while app is open
    const interval = setInterval(checkReset, 60000); 
    return () => clearInterval(interval);
  }, [user.lastResetDate, user.lastStreakUpdate, resetDailyTasks, updateUser]);
};