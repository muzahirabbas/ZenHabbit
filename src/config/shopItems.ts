import { Zap, Heart, Clock, Egg, Sparkles, Shirt, Home } from 'lucide-react';
import { ShopItem } from '../types';

export const SHOP_ITEMS: ShopItem[] = [
  // Consumables (EP Restoration)
  {
    id: 'green_tea',
    name: 'Green Tea Elixir',
    description: 'A soothing brew that restores 10 Energy Points.',
    cost: 50,
    type: 'restore_ep',
    value: 10,
    category: 'consumable',
    // icon: Coffee
  },
  {
    id: 'lotus_nectar',
    name: 'Lotus Nectar',
    description: 'Potent essence that restores 25 Energy Points.',
    cost: 100,
    type: 'restore_ep',
    value: 25,
    category: 'consumable',
    // icon: Zap
  },

  // Pet Stats
  {
    id: 'scroll_wisdom',
    name: 'Scroll of Wisdom',
    description: 'Ancient texts that increase your Pet\'s Intelligence by 5.',
    cost: 200,
    type: 'boost_intelligence',
    value: 5,
    category: 'pet',
    // icon: Scroll
  },
  {
    id: 'spirit_treat',
    name: 'Spirit Treat',
    description: 'A glowing snack that increases your Pet\'s Compassion by 5.',
    cost: 200,
    type: 'boost_compassion',
    value: 5,
    category: 'pet',
    // icon: Heart
  },

  // Adventure
  {
    id: 'wind_chime',
    name: 'Wind Chime',
    description: 'Calls a favorable wind. Reduces Adventure time by 30 minutes.',
    cost: 150,
    type: 'reduce_adventure_time',
    value: 30 * 60, // seconds
    category: 'adventure',
    // icon: Clock
  },
  {
    id: 'dragon_incense',
    name: 'Dragon Incense',
    description: 'Intense aroma that speeds up time. Reduces Adventure time by 2 hours.',
    cost: 400,
    type: 'reduce_adventure_time',
    value: 2 * 60 * 60, // seconds
    category: 'adventure',
    // icon: Flame
  },

  // Hatchery
  {
    id: 'warm_lamp',
    name: 'Incubation Lamp',
    description: 'Provides gentle warmth. Advances current egg progress by 1 day.',
    cost: 500,
    type: 'hatchery_progress',
    value: 1,
    category: 'hatchery',
    // icon: Egg
  },
  {
    id: 'phoenix_ash',
    name: 'Phoenix Ash',
    description: 'Legendary dust that instantly hatches the current egg.',
    cost: 1200,
    type: 'instant_hatch',
    value: 1,
    category: 'hatchery',
    // icon: Sparkles
  },

  // Special / Gamble
  {
    id: 'fortune_cookie',
    name: 'Fortune Cookie',
    description: 'Crack it open! Grants 0-100 Gold randomly.',
    cost: 50,
    type: 'gamble_gold',
    value: 100, // Max reward
    category: 'consumable',
    // icon: Clover
  },
  {
    id: 'zen_pebble',
    name: 'Zen Pebble',
    description: 'A small token of mindfulness. Grants +1 to all stats (EP, Gold, Int, Comp).',
    cost: 300,
    type: 'restore_ep', // We'll handle the special multi-effect in store logic for this ID if needed, or stick to single type. 
    // Actually let's make it a simple big EP restore for now to fit types, or create a new type. 
    // Re-using restore_ep type but high value for simplicity in this iteration.
    value: 50,
    category: 'consumable',
    // icon: Brain
  },

  // Costumes
  {
    id: 'ninja_headband',
    name: 'Ninja Headband',
    description: 'A sleek headband for the stealthy pet.',
    cost: 500,
    type: 'unlock_costume',
    value: 1,
    category: 'costume',
    modifiers: { bossDamageMultiplier: 0.1, epMultiplier: 0.05 }
  },
  {
    id: 'wizard_hat',
    name: 'Wizard Hat',
    description: 'Sparkling with arcane energy.',
    cost: 750,
    type: 'unlock_costume',
    value: 1,
    category: 'costume',
    modifiers: { epMultiplier: 0.15 }
  },
  {
    id: 'samurai_armor',
    name: 'Samurai Armor',
    description: 'Traditional plating for the warrior spirit.',
    cost: 1200,
    type: 'unlock_costume',
    value: 1,
    category: 'costume',
    modifiers: { bossDamageMultiplier: 0.2 }
  },
  {
    id: 'flower_crown',
    name: 'Flower Crown',
    description: 'Blooming with eternal spring.',
    cost: 300,
    type: 'unlock_costume',
    value: 1,
    category: 'costume',
    modifiers: { goldMultiplier: 0.1, happinessBonus: 0.1 }
  },
  {
    id: 'mech_suit',
    name: 'Mech Suit',
    description: 'High-tech protection from the future.',
    cost: 2000,
    type: 'unlock_costume',
    value: 1,
    category: 'costume',
    modifiers: { bossDamageMultiplier: 0.15, goldMultiplier: 0.15 }
  },

  // Home Decor
  {
    id: 'zen_garden',
    name: 'Zen Garden',
    description: 'Raked sand and peaceful stones.',
    cost: 800,
    type: 'unlock_decor',
    value: 1,
    category: 'decor',
    modifiers: { epMultiplier: 0.1 }
  },
  {
    id: 'bamboo_grove',
    name: 'Bamboo Grove',
    description: 'Tall bamboo swaying in the wind.',
    cost: 600,
    type: 'unlock_decor',
    value: 1,
    category: 'decor',
  },
  {
    id: 'cherry_blossom',
    name: 'Cherry Blossom Tree',
    description: 'Pink petals falling gently.',
    cost: 1000,
    type: 'unlock_decor',
    value: 1,
    category: 'decor',
    modifiers: { happinessBonus: 0.2 }
  },
  {
    id: 'hot_spring',
    name: 'Hot Spring',
    description: 'Steaming water for relaxation.',
    cost: 1500,
    type: 'unlock_decor',
    value: 1,
    category: 'decor',
  },
  {
    id: 'floating_island',
    name: 'Floating Island',
    description: 'Defy gravity with this magical base.',
    cost: 2500,
    type: 'unlock_decor',
    value: 1,
    category: 'decor',
    modifiers: { adventureSpeedMultiplier: 0.2, epMultiplier: 0.1 }
  },
];

// Helper to get icon component (since we can't store component in JSON-like structure easily if we were fetching) 
// But here we are importing.
export const getIconForCategory = (category: string) => {
  switch (category) {
    case 'consumable': return Zap;
    case 'pet': return Heart;
    case 'adventure': return Clock;
    case 'hatchery': return Egg;
    case 'costume': return Shirt;
    case 'decor': return Home;
    default: return Sparkles;
  }
};
