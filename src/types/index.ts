

export type HabitType = 'boolean' | 'numeric';

export interface Habit {
  id: string;
  title: string;
  type: HabitType;
  targetValue?: number;
  currentValue: number;
  completedToday: boolean;
  lastCompleted: string; // ISO String
  epReward: number;
}

export interface Pet {
  id: string;
  stage: 'EGG' | 'BABY' | 'ADULT';
  totalEp: number;
  level: number;
  hunger: number; // 0-100
  happiness: number; // 0-100
  traits: {
    compassion: number;
    intelligence: number;
    strength: number;
    agility: number;
  };
}

export interface SecondaryPet {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  dateHatched: string;
}

export interface Hatchery {
  activeEgg: {
    linkedHabitId: string | null;
    progress: number; // Days completed (0-7)
    targetDays: number;
  } | null;
  inventory: SecondaryPet[];
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  lastInteraction: string; // Date string
}

export interface UserState {
  displayName?: string;
  email?: string;
  phoneNumber?: string;
  photoURL?: string;
  about?: string;
  tagline?: string;
  hasCompletedOnboarding: boolean;
  lastResetDate?: string; // ISO String
  currentStreak: number;
  lastStreakUpdate?: string; // ISO String
  gold: number;
  dailyEp: number;
  debugDate?: string; // For testing: Overrides 'new Date()' logic if present
  currentAdventure: {
    startTime: string;
    reductionSeconds: number;
  } | null;
  hatchery: Hatchery;
  inventory: { itemId: string; count: number }[];
  friends: Friend[];
  unlockedCostumes: string[]; // List of Item IDs
  unlockedDecor: string[]; // List of Item IDs
  activeCostume: string | null;
  activeDecor: string | null;
}

export type ShopItemType =
  | 'restore_ep'
  | 'boost_compassion'
  | 'boost_intelligence'
  | 'reduce_adventure_time'
  | 'hatchery_progress'
  | 'instant_hatch'
  | 'gamble_gold'
  | 'unlock_costume'
  | 'unlock_decor';

export interface ItemModifiers {
  goldMultiplier?: number;
  epMultiplier?: number;
  bossDamageMultiplier?: number;
  adventureSpeedMultiplier?: number;
  happinessBonus?: number;
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: ShopItemType;
  value: number; // The magnitude of the effect (e.g. 10 EP, 30 mins)
  category: 'consumable' | 'pet' | 'adventure' | 'hatchery' | 'costume' | 'decor';
  assetUrl?: string;
  modifiers?: ItemModifiers;
}

export interface Boss {
  id: string;
  name: string;
  description: string;
  maxHp: number;
  currentHp: number;
  level: number;
  reward: {
    gold: number;
    ep: number;
    item?: ShopItem;
  };
  image: string; // Emoji or URL
  active: boolean;
  defeated: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (state: UserState) => boolean;
  unlocked: boolean;
  unlockedAt?: string;
}

