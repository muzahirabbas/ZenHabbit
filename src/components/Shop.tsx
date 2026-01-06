import React, { useState } from 'react';
import { ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SHOP_ITEMS, getIconForCategory } from '../config/shopItems';
import { ShopItem } from '../types';

export const Shop: React.FC = () => {
  const { user, buyItem } = useStore();
  const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  const handleBuy = (item: ShopItem) => {
    const result = buyItem(item);
    setFeedback({
      msg: result.message,
      type: result.success ? 'success' : 'error'
    });

    setTimeout(() => setFeedback(null), 3000);
  };

  const categories = ['consumable', 'pet', 'adventure', 'hatchery', 'costume', 'decor'] as const;

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-white flex items-center gap-2">
          <ShoppingBag className="text-blue-400" />
          Marketplace
        </h2>
        <div className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-sm font-bold">
          {user.gold}g
        </div>
      </div>

      {feedback && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl backdrop-blur-md border shadow-xl flex items-center gap-2 transition-all ${
          feedback.type === 'success' 
            ? 'bg-green-500/20 border-green-500/30 text-green-200' 
            : 'bg-red-500/20 border-red-500/30 text-red-200'
        }`}>
          {feedback.type === 'success' ? <Sparkles size={16} /> : <AlertCircle size={16} />}
          <span className="text-sm font-medium">{feedback.msg}</span>
        </div>
      )}
      
      <div className="space-y-8">
        {categories.map(cat => {
          const items = SHOP_ITEMS.filter(i => i.category === cat);
          if (items.length === 0) return null;
          
          const Icon = getIconForCategory(cat);

          return (
            <div key={cat}>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                 <Icon size={14} /> {cat}
              </h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      {/* Icon Placeholder or specific icon if we had map */}
                      <div className={`p-3 rounded-lg ${
                        cat === 'consumable' ? 'bg-green-500/20 text-green-300' :
                        cat === 'pet' ? 'bg-pink-500/20 text-pink-300' :
                        cat === 'adventure' ? 'bg-indigo-500/20 text-indigo-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                         <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{item.name}</h3>
                        <p className="text-xs text-white/50">{item.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleBuy(item)}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/20 transition-colors text-sm font-bold text-yellow-300 whitespace-nowrap"
                    >
                      {item.cost}g
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};