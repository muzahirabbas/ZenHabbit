

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LoadingScreen } from './components/LoadingScreen';
import { InstallPrompt } from './components/InstallPrompt';
import { StarField } from './components/StarField';
import { PetDisplay } from './components/PetDisplay';
import { PetSanctuary } from './components/PetSanctuary';
import { HabitList } from './components/HabitList';
import { OnboardingWizard } from './components/OnboardingWizard';
import { AdventurePanel } from './components/AdventurePanel';
import { BossArena } from './components/BossArena';
import { Achievements } from './components/Achievements';
import { Shop } from './components/Shop';
import { Inventory } from './components/Inventory';
import { Profile } from './components/Profile';
import { Friends } from './components/Friends';
import { StreakPanel } from './components/StreakPanel';
import { HatcheryDisplay } from './components/HatcheryDisplay';
import { Navigation } from './components/Navigation';
import { AuthScreen } from './components/AuthScreen';
import { useStore, INITIAL_ACHIEVEMENTS } from './store/useStore';
import { Habit } from './types';
import { useAuth } from './hooks/useAuth';
import { useDailyReset } from './hooks/useDailyReset';
import { api } from './services/api';
import { GAME_CONFIG } from './config/constants';
import { db } from './services/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const DEFAULT_HABITS: Habit[] = [
  { id: '1', title: 'Morning Meditation', type: 'boolean', currentValue: 0, completedToday: false, lastCompleted: '', epReward: 5 },
  { id: '2', title: 'Drink 2L Water', type: 'numeric', targetValue: 2000, currentValue: 0, completedToday: false, lastCompleted: '', epReward: 5 },
  { id: '3', title: 'Read 30 Minutes', type: 'boolean', currentValue: 0, completedToday: false, lastCompleted: '', epReward: 5 },
  { id: '4', title: 'No Sugar', type: 'boolean', currentValue: 0, completedToday: false, lastCompleted: '', epReward: 5 },
];

const App: React.FC = () => {
  const { habits, user, currentView, updateUser, setState, activeBoss } = useStore();
  const { user: authUser, loading: authLoading } = useAuth();

  useDailyReset();

  // Firestore Sync
  useEffect(() => {
    if (!authUser) return;

    const userDocRef = doc(db, 'users', authUser.uid);

    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      // Ignore local writes to prevent infinite loops
      if (docSnap.metadata.hasPendingWrites) return;

      if (docSnap.exists()) {
        const data = docSnap.data();
        const currentState = useStore.getState();

        // Optimized: Only update if data actually changed (prevent server-echo loop)
        // using simple JSON stringify for now (ignoring function fields which aren't in data anyway)
        const isUserEqual = JSON.stringify(data.user) === JSON.stringify(currentState.user);
        const isPetEqual = JSON.stringify(data.pet) === JSON.stringify(currentState.pet);
        const isHabitsEqual = JSON.stringify(data.habits) === JSON.stringify(currentState.habits);

        if (isUserEqual && isPetEqual && isHabitsEqual) return;

        console.log("Remote update detected, syncing...");

        // Rehydrate Achievements (Restore functions from static config)
        const loadedAchievements = data.achievements || [];
        const hydratedAchievements = INITIAL_ACHIEVEMENTS.map(staticAch => {
          const savedState = loadedAchievements.find((a: any) => a.id === staticAch.id);
          // Merge saved unlocked status with static logic
          return savedState ? { ...staticAch, ...savedState, condition: staticAch.condition } : staticAch;
        });

        setState({
          user: data.user,
          pet: data.pet,
          habits: data.habits,
          // Sync new fields if they exist, otherwise fallback to default
          activeBoss: data.activeBoss || null,
          achievements: hydratedAchievements
        });
      } else {
        // Create new user profile
        const initialData = {
          user: {
            ...useStore.getState().user,
            email: authUser.email || '',
            displayName: authUser.displayName || 'Zen Master',
            photoURL: authUser.photoURL || '',
            friends: [],
          },
          pet: useStore.getState().pet,
          habits: DEFAULT_HABITS,
          activeBoss: null,
          // Store sanitized achievements (no functions)
          achievements: INITIAL_ACHIEVEMENTS.map(a => {
            const { condition, ...rest } = a;
            return rest;
          })
        };
        await setDoc(userDocRef, initialData);
        // Set local state with full functional achievements
        setState({ ...initialData, achievements: INITIAL_ACHIEVEMENTS });
      }
    });

    return () => unsubscribe();
  }, [authUser, setState]);

  // Sync state back to Firestore on changes
  useEffect(() => {
    if (!authUser || habits.length === 0) return;

    const saveData = async () => {
      console.log("Attempting to save state to Firestore...", { user, pet: useStore.getState().pet });
      const userDocRef = doc(db, 'users', authUser.uid);
      try {
        // Sanitize Achievements (Remove functions)
        const sanitizedAchievements = useStore.getState().achievements.map((ach: any) => {
          const { condition, ...rest } = ach;
          return rest;
        });

        await setDoc(userDocRef, {
          user,
          pet: useStore.getState().pet,
          habits,
          activeBoss: useStore.getState().activeBoss,
          achievements: sanitizedAchievements
        }, { merge: true });
      } catch (e) {
        console.error("Error saving state:", e);
      }
    };

    const timeout = setTimeout(saveData, 1000);
    return () => clearTimeout(timeout);
  }, [user, habits, useStore.getState().pet, useStore.getState().activeBoss, useStore.getState().achievements, authUser]);

  // Auto-Adventure Trigger
  useEffect(() => {
    const triggerAdventure = async () => {
      if (user.dailyEp >= GAME_CONFIG.REWARDS.ADVENTURE_EP_THRESHOLD && !user.currentAdventure && authUser) {
        try {
          const res = await api.startAdventure(authUser.uid, user.dailyEp);
          if (res.startTime) {
            updateUser({
              currentAdventure: {
                startTime: new Date(res.startTime).toISOString(),
                reductionSeconds: 0
              }
            });
            console.log("Auto-adventure started!");
          }
        } catch (error) {
          console.error("Failed to auto-start adventure", error);
        }
      }
    };
    triggerAdventure();
  }, [user.dailyEp, user.currentAdventure, authUser, updateUser]);

  if (authLoading) return <LoadingScreen />;
  if (!authUser) return <AuthScreen />;
  if (!user.hasCompletedOnboarding) return <OnboardingWizard />;

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <>
            <StreakPanel />
            <div className="mb-8">
              {/* Priority Display: Boss > Adventure > Pet */}
              {activeBoss ? (
                <BossArena />
              ) : user.currentAdventure ? (
                <AdventurePanel />
              ) : (
                <PetDisplay />
              )}
            </div>

            <HabitList />
          </>
        );
      case 'pet':
        return (
          <div className="h-full flex flex-col justify-center gap-6">
            <PetSanctuary />
            <HatcheryDisplay />
          </div>
        );
      case 'adventure':
        return (
          <section className="mt-8">
            <AdventurePanel />
          </section>
        );
      case 'shop':
        return (
          <>
            <Inventory />
            <div className="border-t border-white/10 my-6" />
            <Shop />
          </>
        );
      case 'friends':
        return <Friends />;
      case 'profile':
        return (
          <>
            <Profile />
            <div className="mt-8 border-t border-white/10 pt-8">
              <Achievements />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <StarField />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      <InstallPrompt />

      <main className="relative z-10 max-w-md mx-auto px-6 pt-12 pb-32">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-light tracking-tight text-white/90">ZenHabit</h1>
            <p className="text-xs text-white/40 uppercase">Day {user.currentStreak} Streak</p>
          </div>
          <div className="text-right">
            <div className="flex flex-col items-end">
              <p className="text-blue-300 font-bold">{user.gold}g</p>
              <p className="text-[10px] text-white/30 tracking-widest uppercase">Treasury</p>
            </div>
            <div className="flex flex-col items-end mt-1">
              <p className="text-purple-300 font-bold">{user.dailyEp} EP</p>
              <p className="text-[10px] text-white/30 tracking-widest uppercase">Energy</p>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[500px]"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation />
    </div>
  );
};

export default App;
