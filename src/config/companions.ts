export interface CompanionTemplate {
  name: string;
  emoji: string;
  description: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
}

export const COMPANIONS: CompanionTemplate[] = [
  // Common
  { name: "Moss Turtle", emoji: "🐢", description: "A steady friend who reminds you to breathe.", rarity: "Common" },
  { name: "Paper Crane", emoji: "🦢", description: "Carries your hopes on delicate wings.", rarity: "Common" },
  { name: "Lantern Firefly", emoji: "🏮", description: "A tiny light in the darkest times.", rarity: "Common" },
  { name: "Ripple Koi", emoji: "🐟", description: "Swims persistently against the current.", rarity: "Common" },
  { name: "Bonsai Ent", emoji: "🪴", description: "Patient growth leads to great strength.", rarity: "Common" },
  { name: "Root Golem", emoji: "🪨", description: "Grounded and unshakeable.", rarity: "Common" },
  { name: "Ink Squid", emoji: "🦑", description: "Flows with creativity and expression.", rarity: "Common" },
  { name: "Cloud Sheep", emoji: "🐑", description: "Soft, dreamy, and peaceful.", rarity: "Common" },
  
  // Uncommon
  { name: "Mist Fox", emoji: "🦊", description: "Clever and elusive, seen only in quiet moments.", rarity: "Uncommon" },
  { name: "Crystal Moth", emoji: "🦋", description: "Transformed by the light of focus.", rarity: "Uncommon" },
  { name: "Jade Serpent", emoji: "🐍", description: "Brings wisdom and good fortune.", rarity: "Uncommon" },
  { name: "Bloom Deer", emoji: "🦌", description: "Where it steps, flowers bloom.", rarity: "Uncommon" },
  { name: "Shadow Cat", emoji: "🐈‍⬛", description: "Observes the world with silent grace.", rarity: "Uncommon" },
  { name: "Ember Sprite", emoji: "🔥", description: "A spark of passion and energy.", rarity: "Uncommon" },

  // Rare
  { name: "Moon Owl", emoji: "🦉", description: "Keeper of secrets and nocturnal wisdom.", rarity: "Rare" },
  { name: "Storm Griffin", emoji: "🦅", description: "Rides the winds of change.", rarity: "Rare" },
  { name: "Star Jelly", emoji: "🪼", description: "Drifts through the cosmic ocean.", rarity: "Rare" },
  { name: "Cloud Whale", emoji: "🐋", description: "A gentle giant of the skies.", rarity: "Rare" },

  // Legendary
  { name: "Sun Phoenix", emoji: "🐦‍🔥", description: "Born anew from the ashes of old habits.", rarity: "Legendary" },
  { name: "Time Snail", emoji: "🐌", description: "Exists in the eternal now.", rarity: "Legendary" },
  { name: "Void Ray", emoji: "🛸", description: "Silent watcher from the deep unknown.", rarity: "Legendary" },
  { name: "Zen Dragon", emoji: "🐉", description: "The ultimate symbol of balance and power.", rarity: "Legendary" },
];

export const getRandomCompanion = (): CompanionTemplate => {
  const rand = Math.random();
  let rarityPool: 'Common' | 'Uncommon' | 'Rare' | 'Legendary';
  
  if (rand < 0.5) rarityPool = 'Common';       // 50%
  else if (rand < 0.8) rarityPool = 'Uncommon'; // 30%
  else if (rand < 0.95) rarityPool = 'Rare';    // 15%
  else rarityPool = 'Legendary';               // 5%

  const pool = COMPANIONS.filter(c => c.rarity === rarityPool);
  return pool[Math.floor(Math.random() * pool.length)];
};