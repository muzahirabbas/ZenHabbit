import React, { useState } from 'react';
import { Shirt, Home, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SHOP_ITEMS } from '../config/shopItems';

export const Wardrobe: React.FC = () => {
  const { user, setActiveCostume, setActiveDecor } = useStore();
  const [activeTab, setActiveTab] = useState<'costume' | 'decor'>('costume');

  const unlockedIds = activeTab === 'costume' ? user.unlockedCostumes : user.unlockedDecor;
  const currentActive = activeTab === 'costume' ? user.activeCostume : user.activeDecor;

  // Filter shop items to only show owned items of the current category
  const ownedItems = SHOP_ITEMS.filter(item => 
    item.category === activeTab && unlockedIds?.includes(item.id)
  );

  const handleEquip = (id: string) => {
    if (activeTab === 'costume') setActiveCostume(id === currentActive ? null : id); // Toggle off if clicked again
    else setActiveDecor(id === currentActive ? null : id);
  };

  return (
    <div className="bg-[#1a1a2e]/90 border border-white/10 rounded-2xl p-4 mt-6">
      <div className="flex gap-4 mb-4 border-b border-white/10 pb-2">
        <button 
          onClick={() => setActiveTab('costume')}
          className={`flex items-center gap-2 pb-2 transition-colors ${activeTab === 'costume' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-white/40'}`}
        >
          <Shirt size={18} /> Wardrobe
        </button>
        <button 
          onClick={() => setActiveTab('decor')}
          className={`flex items-center gap-2 pb-2 transition-colors ${activeTab === 'decor' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-white/40'}`}
        >
          <Home size={18} /> Decor
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
        {ownedItems.length === 0 ? (
          <div className="col-span-3 text-center text-white/30 py-8">
            <p>No unlocked {activeTab}s.</p>
            <p className="text-[10px]">Visit the Shop to expand your collection!</p>
          </div>
        ) : (
          ownedItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleEquip(item.id)}
              className={`relative p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                currentActive === item.id 
                  ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              {/* Placeholder for actual asset render */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                {activeTab === 'costume' ? '👕' : '🏠'}
              </div>
              <span className="text-[10px] text-white/80 text-center truncate w-full">{item.name}</span>
              
              {currentActive === item.id && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check size={10} className="text-white" />
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};