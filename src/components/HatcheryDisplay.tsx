import React, { useState } from 'react';
import { Egg, Link as LinkIcon } from 'lucide-react';
import { useStore } from '../store/useStore';

export const HatcheryDisplay: React.FC = () => {
  const { user, habits, linkHabitToEgg } = useStore();
  const [isLinking, setIsLinking] = useState(false);

  const activeEgg = user.hatchery.activeEgg;
  const linkedHabit = activeEgg?.linkedHabitId 
    ? habits.find(h => h.id === activeEgg.linkedHabitId) 
    : null;

  if (!activeEgg) return null;

  return (
    <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
      <div className="flex items-center gap-3 mb-4">
        <Egg className="text-pink-300" />
        <h3 className="text-lg font-medium text-white">Mystic Hatchery</h3>
      </div>

      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 mb-4 text-6xl flex items-center justify-center animate-bounce">
          🥚
        </div>
        
        {linkedHabit ? (
          <div className="w-full">
            <div className="flex justify-between text-sm text-white/70 mb-2">
              <span>Incubation Progress</span>
              <span>{activeEgg.progress} / {activeEgg.targetDays} Days</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-400 transition-all duration-500"
                style={{ width: `${(activeEgg.progress / activeEgg.targetDays) * 100}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-center text-white/50">
              Linked to: <span className="text-white">{linkedHabit.title}</span>
            </p>
          </div>
        ) : (
          <div className="w-full text-center">
            <p className="text-sm text-white/70 mb-4">
              This egg requires focused energy to hatch. Link a habit to nurture it for 7 days.
            </p>
            
            {!isLinking ? (
              <button 
                onClick={() => setIsLinking(true)}
                className="px-4 py-2 rounded-lg bg-pink-500/20 text-pink-300 border border-pink-500/30 hover:bg-pink-500/30 transition-colors flex items-center gap-2 mx-auto"
              >
                <LinkIcon size={16} /> Link a Habit
              </button>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {habits.map(habit => (
                  <button
                    key={habit.id}
                    onClick={() => {
                      linkHabitToEgg(habit.id);
                      setIsLinking(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded bg-white/5 hover:bg-white/10 text-xs text-white truncate transition-colors"
                  >
                    {habit.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {user.hatchery.inventory.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
            Companions ({user.hatchery.inventory.length})
          </h4>
          
          <div className="grid grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
             {user.hatchery.inventory.map((pet) => (
               <div 
                 key={pet.id}
                 className="flex flex-col items-center group relative p-2 rounded-xl bg-[#1a1a24] border border-white/10 hover:border-white/30 transition-colors"
               >
                 <div className="text-2xl mb-1 cursor-help">{pet.emoji || '👻'}</div>
                 <span className="text-[9px] text-white/50 w-full text-center truncate">{pet.name}</span>
                 
                 {/* Tooltip */}
                 <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-32 bg-black/90 text-white text-[10px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl border border-white/10">
                   <p className="font-bold text-center mb-1">{pet.name}</p>
                   <p className="text-white/70 italic text-center mb-1 leading-tight">{pet.description}</p>
                   <p className={`text-center font-bold uppercase tracking-wider ${
                      pet.rarity === 'Legendary' ? 'text-yellow-400' :
                      pet.rarity === 'Rare' ? 'text-purple-400' :
                      pet.rarity === 'Uncommon' ? 'text-blue-400' : 'text-gray-400'
                   }`}>{pet.rarity}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};