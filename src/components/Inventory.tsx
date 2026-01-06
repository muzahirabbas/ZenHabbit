import React, { useState } from 'react';
import { Package, Sparkles, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SHOP_ITEMS, getIconForCategory } from '../config/shopItems';

export const Inventory: React.FC = () => {
  const { user, useItem } = useStore();
  const [feedback, setFeedback] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);

  // Group inventory items by category
  const inventoryItems = (user.inventory || []).map(invItem => {
    const itemConfig = SHOP_ITEMS.find(i => i.id === invItem.itemId);
    return itemConfig ? { ...itemConfig, count: invItem.count } : null;
  }).filter((i): i is typeof i & { count: number } => i !== null);

  const handleUse = (item: any) => {
    const result = useItem(item);
    setFeedback({
      msg: result.message,
      type: result.success ? 'success' : 'error'
    });
    setTimeout(() => setFeedback(null), 3000);
  };

  if (inventoryItems.length === 0) {
    return (
      <div className="p-6 text-center text-white/40">
        <Package className="mx-auto mb-4 opacity-50" size={48} />
        <p>Your inventory is empty.</p>
        <p className="text-xs mt-2">Visit the Shop to buy items.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <Package className="text-purple-400" />
        Inventory
      </h2>

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

      <div className="space-y-4">
        {inventoryItems.map(item => {
           const Icon = getIconForCategory(item.category);
           return (
             <div key={item.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/10 relative">
                    <Icon size={20} className="text-white/80" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#0a0a0f]">
                      {item.count}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{item.name}</h3>
                    <p className="text-xs text-white/50">{item.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleUse(item)}
                  className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-500/30 text-sm font-bold transition-colors"
                >
                  Use
                </button>
             </div>
           );
        })}
      </div>
    </div>
  );
};