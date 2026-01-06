


export const GAME_CONFIG = {
  PET_STAGES: {
    EGG: { minEp: 0, label: 'Mystic Egg' },
    BABY: { minEp: 100, label: 'Wisp' },
    ADULT: { minEp: 500, label: 'Guardian' }
  },
  REWARDS: {
    CHECKBOX_EP: 5,
    CHECKBOX_GOLD: 5,
    ADVENTURE_EP_THRESHOLD: 35,
  },
  ADVENTURE: {
    BASE_DURATION_MS: 6 * 60 * 60 * 1000, // 6 Hours
    HABIT_REDUCTION_MS: 10 * 60 * 1000,   // 10 Minutes
  },
  COLORS: {
    PRIMARY: '#f8f1e9', // Ethereal Cream
    ACCENT: '#8fb3ff',  // Soft Blue
    SURFACE: 'rgba(255, 255, 255, 0.1)',
  }
};
