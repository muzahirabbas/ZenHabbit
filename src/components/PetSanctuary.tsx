import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Dumbbell, Utensils, Gamepad2, Shirt } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Wardrobe } from './Wardrobe';
import { SHOP_ITEMS } from '../config/shopItems';

export const PetSanctuary: React.FC = () => {
  const { pet, user, interactWithPet } = useStore();
  const [showWardrobe, setShowWardrobe] = useState(false);

  // Derive visuals from active items
  const activeDecorItem = SHOP_ITEMS.find(i => i.id === user.activeDecor);
  const activeCostumeItem = SHOP_ITEMS.find(i => i.id === user.activeCostume);

  // Mock background styles based on decor name (in a real app, use assetUrl)
  const getBackgroundStyle = () => {
    if (!activeDecorItem) return 'bg-[#1a1a2e]';
    if (activeDecorItem.id.includes('garden')) return 'bg-gradient-to-b from-green-900 to-[#1a1a2e]';
    if (activeDecorItem.id.includes('magma')) return 'bg-gradient-to-b from-red-900 to-[#1a1a2e]';
    if (activeDecorItem.id.includes('cloud')) return 'bg-gradient-to-b from-blue-900 to-[#1a1a2e]';
    return 'bg-[#1a1a2e]';
  };

  const getPetEmoji = () => {
    switch (pet.stage) {
      case 'EGG': return '🥚';
      case 'BABY': return '☁️';
      case 'ADULT': return '🐉';
    }
  };

  // Visual Effects State
  const [effects, setEffects] = useState<{ id: number; text: string; x: number; y: number; color: string }[]>([]);

  const spawnEffect = (text: string, color: string, x: number, y: number) => {
    const id = Date.now() + Math.random();
    setEffects(prev => [...prev, { id, text, x, y, color }]);
    setTimeout(() => setEffects(prev => prev.filter(e => e.id !== id)), 1000);
  };

  const handleInteraction = (type: 'feed' | 'play' | 'train') => {
    // Center effects on the pet area (approx 50% 50%)
    if (type === 'feed') {
      spawnEffect("+30 Hunger", "text-orange-400", 50, 50);
      spawnEffect("+Compassion", "text-pink-300", 50, 40);
      spawnEffect("-5 Gold", "text-yellow-400", 50, 60);
    } else if (type === 'play') {
      spawnEffect("+20 Mood", "text-pink-400", 50, 50);
      spawnEffect("+Agility", "text-green-300", 50, 40);
      spawnEffect("-5 Gold", "text-yellow-400", 50, 60);
    } else if (type === 'train') {
      spawnEffect("+20 EP", "text-blue-400", 50, 30);
      spawnEffect("+STR / INT", "text-red-300", 50, 40);
      spawnEffect("-Energy", "text-gray-400", 50, 60);
    }

    interactWithPet(type);
  };

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 ${getBackgroundStyle()} transition-colors duration-1000 min-h-[500px] flex flex-col`}>

      {/* Floating Effects Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {effects.map(effect => (
          <motion.div
            key={effect.id}
            initial={{ opacity: 0, y: "50%", x: "50%", scale: 0.5 }}
            animate={{ opacity: [1, 0], y: ["50%", "30%"], scale: 1.2 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`absolute top-0 left-0 w-full h-full flex items-center justify-center font-bold text-lg ${effect.color} text-shadow-md`}
            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
          >
            <div style={{ transform: `translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px)` }}>
              {effect.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* HUD Layer */}
      <div className="absolute top-0 left-0 right-0 p-4 z-20 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex flex-col gap-2 w-1/3">
          {/* Hunger Bar */}
          <div className="w-full">
            <div className="flex justify-between text-[10px] text-white/70 mb-1">
              <span className="flex items-center gap-1"><Utensils size={8} /> Hunger</span>
              <span>{Math.round(pet.hunger)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-orange-400"
                animate={{ width: `${pet.hunger}%` }}
              />
            </div>
          </div>
          {/* Happiness Bar */}
          <div className="w-full">
            <div className="flex justify-between text-[10px] text-white/70 mb-1">
              <span className="flex items-center gap-1"><Heart size={8} /> Mood</span>
              <span>{Math.round(pet.happiness)}%</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-pink-400"
                animate={{ width: `${pet.happiness}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <h3 className="text-white font-bold text-lg tracking-tight">Lv. {pet.level}</h3>
          <p className="text-[10px] text-white/50 uppercase tracking-widest">{pet.stage}</p>
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 mt-12">
        <div className="relative group">
          {/* Aura/Decor Effect */}
          {user.activeDecor && (
            <motion.div
              className="absolute inset-0 bg-white/5 blur-xl rounded-full scale-150"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          )}

          {/* Pet Sprite */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-9xl relative z-10 filter drop-shadow-2xl cursor-pointer"
            whileTap={{ scale: 0.9 }}
            onClick={() => interactWithPet('play')}
          >
            {getPetEmoji()}

            {/* Costume Overlay (Badge style) */}
            {activeCostumeItem && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -bottom-2 -right-2 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-full text-2xl shadow-lg"
                title={activeCostumeItem.name}
              >
                👕
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Stats Radar (Simplified visual) */}
        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs px-6 opacity-80">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-blue-300 uppercase">INT</span>
            <span className="text-white font-bold">{pet.traits.intelligence}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-red-300 uppercase">STR</span>
            <span className="text-white font-bold">{pet.traits.strength}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-green-300 uppercase">AGI</span>
            <span className="text-white font-bold">{pet.traits.agility}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-pink-300 uppercase">COM</span>
            <span className="text-white font-bold">{pet.traits.compassion}</span>
          </div>
        </div>
      </div>

      {/* Active Modifiers Display */}
      {(activeCostumeItem?.modifiers || activeDecorItem?.modifiers) && (
        <div className="absolute top-20 left-4 flex flex-col gap-1 z-10 pointer-events-none">
          {activeCostumeItem?.modifiers?.goldMultiplier && <div className="bg-yellow-500/20 text-yellow-300 text-[10px] px-2 py-0.5 rounded-full border border-yellow-500/30">+{((activeCostumeItem.modifiers.goldMultiplier) * 100)}% Gold</div>}
          {activeCostumeItem?.modifiers?.epMultiplier && <div className="bg-blue-500/20 text-blue-300 text-[10px] px-2 py-0.5 rounded-full border border-blue-500/30">+{((activeCostumeItem.modifiers.epMultiplier) * 100)}% EP</div>}
          {activeDecorItem?.modifiers?.adventureSpeedMultiplier && <div className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-500/30">Time Speedup</div>}
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-[#13131a] p-4 z-20 border-t border-white/10">
        <div className="flex justify-around mb-4">
          <button
            onClick={() => handleInteraction('feed')}
            disabled={user.gold < 5}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-orange-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group relative"
          >
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none border border-white/10 z-50">
              -5 Gold <br /> +30 Hunger <br /> +Compassion
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-orange-500/20 group-hover:border-orange-500/50">
              <Utensils size={20} />
            </div>
            <span className="text-[10px] font-medium flex items-center gap-1">FEED <span className="text-yellow-500 text-[9px]">-5G</span></span>
          </button>

          <button
            onClick={() => handleInteraction('play')}
            disabled={user.gold < 5}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-pink-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group relative"
          >
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none border border-white/10 z-50">
              -5 Gold <br /> +20 Mood <br /> +Agility
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-pink-500/20 group-hover:border-pink-500/50">
              <Gamepad2 size={20} />
            </div>
            <span className="text-[10px] font-medium flex items-center gap-1">PLAY <span className="text-yellow-500 text-[9px]">-5G</span></span>
          </button>

          <button
            onClick={() => handleInteraction('train')}
            disabled={pet.hunger < 20 || pet.happiness < 20}
            className="flex flex-col items-center gap-1 text-white/50 hover:text-blue-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group relative"
          >
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[10px] whitespace-nowrap pointer-events-none border border-white/10 z-50">
              -Energy <br /> +STR / INT <br /> +20 EP
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:bg-blue-500/20 group-hover:border-blue-500/50">
              <Dumbbell size={20} />
            </div>
            <span className="text-[10px] font-medium flex items-center gap-1">TRAIN <span className="text-orange-400 text-[9px]">-NRG</span></span>
          </button>

          <button
            onClick={() => setShowWardrobe(!showWardrobe)}
            className={`flex flex-col items-center gap-1 transition-colors ${showWardrobe ? 'text-purple-400' : 'text-white/50 hover:text-purple-400'}`}
          >
            <div className={`p-3 rounded-xl border transition-all ${showWardrobe ? 'bg-purple-500/20 border-purple-500/50' : 'bg-white/5 border-white/10 hover:bg-purple-500/20'}`}>
              <Shirt size={20} />
            </div>
            <span className="text-[10px] font-medium">STYLE</span>
          </button>
        </div>

        {/* Collapsible Wardrobe */}
        {showWardrobe && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden"
          >
            <Wardrobe />
          </motion.div>
        )}
      </div>
    </div>
  );
};