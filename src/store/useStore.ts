

import { create } from 'zustand';
import { Habit, Pet, UserState, ShopItem, SecondaryPet, Boss, Achievement } from '../types';
import { getRandomCompanion } from '../config/companions';
import { getIsoDate } from '../utils/time';
import { SHOP_ITEMS } from '../config/shopItems';

interface ZenState {
  user: UserState;
  habits: Habit[];
  pet: Pet;
  loading: boolean;
  currentView: 'home' | 'pet' | 'adventure' | 'shop' | 'profile' | 'friends';

  // New Rogue Mode State
  activeBoss: Boss | null;
  achievements: Achievement[];

  // Actions
  setHabits: (habits: Habit[]) => void;
  updateHabit: (id: string, diff: Partial<Habit>) => void;
  updateUser: (diff: Partial<UserState>) => void;
  processReward: (ep: number, gold: number, habitId?: string) => void;
  setView: (view: 'home' | 'pet' | 'adventure' | 'shop' | 'profile' | 'friends') => void;
  linkHabitToEgg: (habitId: string) => void;
  setState: (state: Partial<ZenState>) => void;
  addHabit: (habit: Habit) => void;
  deleteHabit: (id: string) => void;
  buyItem: (item: ShopItem) => { success: boolean; message: string };
  useItem: (item: ShopItem) => { success: boolean; message: string };
  resetDailyTasks: () => void;
  setActiveCostume: (id: string | null) => void;
  setActiveDecor: (id: string | null) => void;
  interactWithPet: (type: 'feed' | 'play' | 'train') => void;

  // New Rogue Mode Actions
  spawnBoss: () => void;
  checkAchievements: () => void;
  setStarterPet: (petType: string) => void;
  setOnboardingComplete: () => void;
}

const generateNewPet = (): SecondaryPet => {
  const template = getRandomCompanion();
  return {
    id: Date.now().toString(),
    name: template.name,
    emoji: template.emoji,
    description: template.description,
    rarity: template.rarity,
    dateHatched: new Date().toISOString()
  };
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'streak_7',
    title: 'Week Warrior',
    description: 'Reach a 7 day streak',
    icon: '🔥',
    condition: (state) => state.currentStreak >= 7,
    unlocked: false
  },
  {
    id: 'hoarder_1000',
    title: 'Gold Hoarder',
    description: 'Amass 1000 Gold',
    icon: '💰',
    condition: (state) => state.gold >= 1000,
    unlocked: false
  },
  {
    id: 'pet_level_10',
    title: 'Best Friends',
    description: 'Reach Pet Level 10',
    icon: '❤️',
    condition: (_state) => false, // Placeholder, requires checking pet state which is separate in condition args usually
    unlocked: false
  }
];

// Using Zustand for central state management (Deterministic logic container)
export const useStore = create<ZenState>((set, get) => ({
  user: {
    gold: 0,
    dailyEp: 0,
    currentAdventure: null,
    currentStreak: 0,
    hatchery: {
      activeEgg: { linkedHabitId: null, progress: 0, targetDays: 7 },
      inventory: []
    },
    inventory: [],
    friends: [],
    unlockedCostumes: [],
    unlockedDecor: [],
    activeCostume: null,
    activeDecor: null,
    hasCompletedOnboarding: false
  },
  habits: [],
  pet: {
    id: '1',
    stage: 'EGG',
    totalEp: 0,
    level: 1,
    hunger: 80,
    happiness: 80,
    traits: { compassion: 0, intelligence: 0, strength: 0, agility: 0 }
  },
  loading: false,
  currentView: 'home',

  activeBoss: null,
  achievements: INITIAL_ACHIEVEMENTS,

  setHabits: (habits) => set({ habits }),
  updateHabit: (id, diff) => set((state) => ({
    habits: state.habits.map(h => h.id === id ? { ...h, ...diff } : h)
  })),
  addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
  deleteHabit: (id) => set((state) => ({ habits: state.habits.filter(h => h.id !== id) })),
  updateUser: (diff) => set((state) => ({
    user: { ...state.user, ...diff }
  })),
  setActiveCostume: (id) => set((state) => ({ user: { ...state.user, activeCostume: id } })),
  setActiveDecor: (id) => set((state) => ({ user: { ...state.user, activeDecor: id } })),
  interactWithPet: (type) => set((state) => {
    let updates: Partial<Pet> = {};
    let userUpdates: Partial<UserState> = {};
    const cost = 5; // Basic interaction cost in Gold

    if (state.user.gold < cost && type !== 'train') {
      // Allow training without gold, but it costs Hunger/Happiness
      // For feed/play, require gold (buying supplies)
      return {}; // Silently fail or handling at UI level would be better, but for now strict check
    }

    // Trait Multipliers from Gear
    const activeCostumeItem = SHOP_ITEMS.find(i => i.id === state.user.activeCostume);
    const bonusHappiness = (activeCostumeItem?.modifiers?.happinessBonus || 0);

    if (type === 'feed') {
      if (state.pet.hunger >= 100) return {};
      updates = {
        hunger: Math.min(100, state.pet.hunger + 30),
        happiness: Math.min(100, state.pet.happiness + 5 + (5 * bonusHappiness)),
        totalEp: state.pet.totalEp + 2,
        traits: { ...state.pet.traits, compassion: state.pet.traits.compassion + 0.5 }
      };
      userUpdates = { gold: state.user.gold - cost };
    } else if (type === 'play') {
      if (state.pet.happiness >= 100) return {};
      updates = {
        happiness: Math.min(100, state.pet.happiness + 20 + (20 * bonusHappiness)),
        hunger: Math.max(0, state.pet.hunger - 10),
        totalEp: state.pet.totalEp + 5,
        traits: { ...state.pet.traits, agility: state.pet.traits.agility + 0.5 }
      };
      userUpdates = { gold: state.user.gold - cost };
    } else if (type === 'train') {
      if (state.pet.hunger < 20 || state.pet.happiness < 20) return {}; // Too tired

      // Training is intense
      updates = {
        hunger: Math.max(0, state.pet.hunger - 20),
        happiness: Math.max(0, state.pet.happiness - 10),
        totalEp: state.pet.totalEp + 20, // Big EP gain
        traits: {
          ...state.pet.traits,
          strength: state.pet.traits.strength + 1,
          intelligence: state.pet.traits.intelligence + 1
        }
      };
    }

    // Check for level up based on EP? Level logic is simple for now
    // If we want level to be purely based on EP thresholds:
    const newTotalEp = (state.pet.totalEp + (updates.totalEp || 0));
    const newLevel = Math.floor(newTotalEp / 100) + 1;
    updates.level = newLevel;

    return {
      pet: { ...state.pet, ...updates },
      user: { ...state.user, ...userUpdates }
    };
  }),
  processReward: (ep, gold, habitId) => set((state) => {
    // Calculate Modifiers
    const activeCostumeItem = SHOP_ITEMS.find(i => i.id === state.user.activeCostume);
    const activeDecorItem = SHOP_ITEMS.find(i => i.id === state.user.activeDecor);

    const epMultiplier = 1 + (activeCostumeItem?.modifiers?.epMultiplier || 0) + (activeDecorItem?.modifiers?.epMultiplier || 0);
    const goldMultiplier = 1 + (activeCostumeItem?.modifiers?.goldMultiplier || 0) + (activeDecorItem?.modifiers?.goldMultiplier || 0);
    const bossDamageMultiplier = 1 + (activeCostumeItem?.modifiers?.bossDamageMultiplier || 0) + (activeDecorItem?.modifiers?.bossDamageMultiplier || 0);

    // Apply Multipliers
    const finalEp = Math.floor(ep * epMultiplier);
    const finalGold = Math.floor(gold * goldMultiplier);

    const newTotalEp = state.pet.totalEp + finalEp;
    let newStage = state.pet.stage;

    if (newTotalEp >= 500) newStage = 'ADULT';
    else if (newTotalEp >= 100) newStage = 'BABY';

    // Streak Logic
    let newStreak = state.user.currentStreak;
    let newLastStreakUpdate = state.user.lastStreakUpdate;

    const today = new Date();
    const lastUpdate = state.user.lastStreakUpdate ? new Date(state.user.lastStreakUpdate) : new Date(0);

    // Calculate difference in calendar days (ignoring time)
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const lastUpdateMidnight = new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate());

    const diffTime = Math.abs(todayMidnight.getTime() - lastUpdateMidnight.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
      newLastStreakUpdate = today.toISOString();
    } else if (diffDays > 1) {
      newStreak = 1; // Reset streak
      newLastStreakUpdate = today.toISOString();
    } else if (diffDays === 0) {
      // Same day, no streak change
    } else {
      // Fallback for fresh user
      newStreak = 1;
      newLastStreakUpdate = today.toISOString();
    }

    // Hatchery Logic
    let newHatchery = { ...state.user.hatchery };
    if (habitId && newHatchery.activeEgg && newHatchery.activeEgg.linkedHabitId === habitId) {
      // Progress egg if linked habit is completed
      newHatchery.activeEgg = {
        ...newHatchery.activeEgg,
        progress: newHatchery.activeEgg.progress + 1
      };

      // Check for hatching
      if (newHatchery.activeEgg.progress >= newHatchery.activeEgg.targetDays) {
        const newPet = {
          ...generateNewPet()
        };
        newHatchery.inventory = [...newHatchery.inventory, newPet];
        // Reset with new egg
        newHatchery.activeEgg = { linkedHabitId: null, progress: 0, targetDays: 7 };
      }
    }

    // BOSS BATTLE LOGIC
    let newBoss = state.activeBoss;
    let bonusGold = 0;

    if (newBoss && newBoss.active && !newBoss.defeated) {
      // Base damage + Scaling + Multiplier
      const baseDamage = 10 + Math.floor(state.pet.totalEp / 50);
      const damage = Math.floor(baseDamage * bossDamageMultiplier);

      newBoss = { ...newBoss, currentHp: newBoss.currentHp - damage };

      if (newBoss.currentHp <= 0) {
        newBoss.currentHp = 0;
        newBoss.defeated = true;
        newBoss.active = false;
        bonusGold = newBoss.reward.gold;
        // Optionally add EP reward too
        // No double EP application here, just standard reward
      }
    }

    // Check Achievements immediately
    const checkAchievementsForState = (uState: UserState, pState: Pet) => {
      return state.achievements.map(ach => {
        if (ach.unlocked) return ach;
        // Hacky specific checks for now since generic condition is hard with complex args
        let isUnlocked = false;

        if (ach.id === 'streak_7' && uState.currentStreak >= 7) isUnlocked = true;
        if (ach.id === 'hoarder_1000' && uState.gold >= 1000) isUnlocked = true;
        if (ach.id === 'pet_level_10' && pState.level >= 10) isUnlocked = true;

        if (isUnlocked) {
          return { ...ach, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return ach;
      });
    };

    const nextUserState = {
      ...state.user,
      gold: state.user.gold + finalGold + bonusGold,
      dailyEp: state.user.dailyEp + finalEp,
      currentStreak: newStreak,
      lastStreakUpdate: newLastStreakUpdate,
      hatchery: newHatchery
    };

    const newAchievements = checkAchievementsForState(nextUserState, { ...state.pet, totalEp: newTotalEp });

    return {
      user: nextUserState,
      pet: {
        ...state.pet,
        totalEp: newTotalEp,
        stage: newStage
      },
      activeBoss: newBoss,
      achievements: newAchievements
    };
  }),
  setView: (view) => set({ currentView: view }),
  linkHabitToEgg: (habitId) => set((state) => ({
    user: {
      ...state.user,
      hatchery: {
        ...state.user.hatchery,
        activeEgg: state.user.hatchery.activeEgg
          ? { ...state.user.hatchery.activeEgg, linkedHabitId: habitId }
          : null
      }
    }
  })),
  setState: (newState) => set((state) => ({ ...state, ...newState })),
  buyItem: (item) => {
    // ... (existing logic)
    // Re-implementing buyItem to keep closure scope correct or just reusing existing
    // Since I'm replacing the whole create object properties, I need to copy the functions too if I'm not careful.
    // The previous tool replace_file_content replaces a chunk. I should just replace lines 3-330 with the new content including properties.
    // The Prompt said "ReplacementContent", so I will assume I need to provide the full body of the create function or carefully target.

    // WAIT. I used a HUGE chunk in the tool call. I must include existing functions like buyItem in the replacement if I am overwriting them.
    // The previous snippet cutoff at line 330.
    // I will include the existing buyItem and useItem logic verbatim.

    const state = get();
    if (state.user.gold < item.cost) {
      return { success: false, message: "Not enough gold!" };
    }

    // Check for duplicate unlock
    if (item.type === 'unlock_costume' && state.user.unlockedCostumes?.includes(item.id)) {
      return { success: false, message: "Already owned!" };
    }
    if (item.type === 'unlock_decor' && state.user.unlockedDecor?.includes(item.id)) {
      return { success: false, message: "Already owned!" };
    }

    // Deduct gold
    const newGold = state.user.gold - item.cost;
    let updates: Partial<UserState> = { gold: newGold };

    if (item.type === 'unlock_costume') {
      updates.unlockedCostumes = [...(state.user.unlockedCostumes || []), item.id];
    } else if (item.type === 'unlock_decor') {
      updates.unlockedDecor = [...(state.user.unlockedDecor || []), item.id];
    } else {
      // Add to inventory (consumables etc)
      const newInventory = [...(state.user.inventory || [])];
      const existingItemIndex = newInventory.findIndex(i => i.itemId === item.id);

      if (existingItemIndex >= 0) {
        newInventory[existingItemIndex] = {
          ...newInventory[existingItemIndex],
          count: newInventory[existingItemIndex].count + 1
        };
      } else {
        newInventory.push({ itemId: item.id, count: 1 });
      }
      updates.inventory = newInventory;
    }

    set((state) => ({
      user: { ...state.user, ...updates }
    }));

    return { success: true, message: `Purchased ${item.name}!` };
  },
  useItem: (item: ShopItem) => {
    console.log("useItem called for:", item.name);
    const state = get();
    const inventory = state.user.inventory || [];
    const itemIndex = inventory.findIndex(i => i.itemId === item.id);

    if (itemIndex < 0 || inventory[itemIndex].count <= 0) {
      console.error("Item not found in inventory or count 0");
      return { success: false, message: "Item not in inventory!" };
    }

    console.log("Item found, reducing count...");
    // Decrement count
    const newInventory = [...inventory];
    newInventory[itemIndex] = { ...newInventory[itemIndex], count: newInventory[itemIndex].count - 1 };
    // Remove if 0
    if (newInventory[itemIndex].count <= 0) {
      newInventory.splice(itemIndex, 1);
    }

    let updates: Partial<ZenState> = {
      user: { ...state.user, inventory: newInventory }
    };

    // Apply Effects
    console.log("Applying effect for type:", item.type);
    switch (item.type) {
      case 'restore_ep':
        updates.user = {
          ...updates.user!,
          dailyEp: (state.user.dailyEp || 0) + item.value
        };
        // Also grant XP to the pet
        updates.pet = {
          ...state.pet,
          totalEp: state.pet.totalEp + item.value
        };
        break;

      case 'boost_compassion':
        updates.pet = {
          ...state.pet,
          traits: { ...state.pet.traits, compassion: state.pet.traits.compassion + item.value }
        };
        break;

      case 'boost_intelligence':
        updates.pet = {
          ...state.pet,
          traits: { ...state.pet.traits, intelligence: state.pet.traits.intelligence + item.value }
        };
        break;

      case 'reduce_adventure_time':
        if (!state.user.currentAdventure) {
          return { success: false, message: "No active adventure to speed up!" };
        }
        updates.user = {
          ...updates.user!,
          currentAdventure: {
            ...state.user.currentAdventure,
            reductionSeconds: (state.user.currentAdventure.reductionSeconds || 0) + item.value
          }
        };
        break;

      case 'hatchery_progress':
      case 'instant_hatch':
        if (!state.user.hatchery.activeEgg) {
          return { success: false, message: "No active egg in hatchery!" };
        }

        let progressToAdd = item.type === 'instant_hatch' ? state.user.hatchery.activeEgg.targetDays : item.value;
        let newProgress = state.user.hatchery.activeEgg.progress + progressToAdd;

        let newInventoryPets = [...state.user.hatchery.inventory];
        let newActiveEgg = { ...state.user.hatchery.activeEgg, progress: newProgress };

        if (newProgress >= state.user.hatchery.activeEgg.targetDays) {
          const newPet = {
            ...generateNewPet()
          };
          newInventoryPets.push(newPet);
          newActiveEgg = { linkedHabitId: null, progress: 0, targetDays: 7 };
        }

        updates.user = {
          ...updates.user!,
          hatchery: {
            ...state.user.hatchery,
            activeEgg: newActiveEgg,
            inventory: newInventoryPets
          }
        };
        break;

      case 'gamble_gold':
        const win = Math.floor(Math.random() * item.value);
        updates.user = {
          ...updates.user!,
          gold: (state.user.gold || 0) + win
        };
        set(updates);
        return { success: true, message: `Opened ${item.name} and found ${win} Gold!` };
    }

    set(updates);
    return { success: true, message: `Used ${item.name}!` };
  },
  resetDailyTasks: () => set((state) => ({
    user: {
      ...state.user,
      dailyEp: 0,
      lastResetDate: getIsoDate()
    },
    habits: state.habits.map(h => ({ ...h, completedToday: false }))
  })),

  spawnBoss: () => set((state) => {
    // Only spawn if no active boss
    if (state.activeBoss && state.activeBoss.active) return {};

    const bosses = [
      { name: "Procrastination Demon", hp: 100, reward: 50, emoji: "👹" },
      { name: "Chaos Dragon", hp: 200, reward: 100, emoji: "🐉" },
      { name: "Sloth Slime", hp: 50, reward: 25, emoji: "🦠" }
    ];
    const randomBoss = bosses[Math.floor(Math.random() * bosses.length)];

    return {
      activeBoss: {
        id: Date.now().toString(),
        name: randomBoss.name,
        description: "A fearsome foe appears! Complete habits to deal damage.",
        maxHp: randomBoss.hp,
        currentHp: randomBoss.hp,
        level: state.pet.level,
        reward: { gold: randomBoss.reward, ep: randomBoss.reward / 2 },
        image: randomBoss.emoji,
        active: true,
        defeated: false
      }
    };
  }),

  setOnboardingComplete: () => set((state) => ({ user: { ...state.user, hasCompletedOnboarding: true } })),

  setStarterPet: (petType: string) => set((state) => ({
    pet: {
      ...state.pet,
      stage: 'BABY',
      id: Date.now().toString(),
      happiness: 100,
      hunger: 100,
      level: 1,
      totalEp: 0,
      traits: {
        compassion: petType === 'Turtle' ? 5 : 0,
        strength: petType === 'Dragon' ? 5 : 0,
        intelligence: petType === 'Owl' ? 5 : 0,
        agility: petType === 'Cat' ? 5 : 0
      }
    }
  })),

  checkAchievements: () => set((_state) => {
    // Logic duplicated from processReward for manual checks if needed, 
    // but usually processReward handles it.
    return {};
  })
}));
