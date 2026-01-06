import React from 'react';
import { Home, PersonStanding, ShoppingBag, User, Users } from 'lucide-react';
import { useStore } from '../store/useStore';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'pet', icon: PersonStanding, label: 'Pet' },
  { id: 'shop', icon: ShoppingBag, label: 'Shop' },
  { id: 'friends', icon: Users, label: 'Friends' },
  { id: 'profile', icon: User, label: 'Profile' },
] as const;

export const Navigation: React.FC = () => {
  const { currentView, setView } = useStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-[#0a0a0f] to-transparent">
      <div className="max-w-md mx-auto flex justify-between items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-3">
        {navItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => setView(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentView === item.id ? 'text-blue-400' : 'text-white/30 hover:text-white/60'
            }`}
          >
            <item.icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} />
            <span className="text-[10px] font-medium uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};