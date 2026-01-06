import React, { useState } from 'react';
import { Trophy, Star, LogOut, Mail, Phone, Camera } from 'lucide-react';
import { useStore } from '../store/useStore';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

export const Profile: React.FC = () => {
  const { user, pet, updateUser, setState } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit state
  const [formData, setFormData] = useState({
    displayName: user.displayName || '',
    tagline: user.tagline || '',
    about: user.about || '',
    phoneNumber: user.phoneNumber || '',
    photoURL: user.photoURL || ''
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setState({
        habits: [],
        user: { ...user, gold: 0, dailyEp: 0, currentAdventure: null, hatchery: { activeEgg: null, inventory: [] } }
      });
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const handleSaveProfile = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6">
      {/* Header / Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/10 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
            {formData.photoURL ? (
              <img src={formData.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              formData.displayName ? formData.displayName.charAt(0).toUpperCase() : 'Z'
            )}
          </div>
          {isEditing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
               <Camera size={24} className="text-white/80" />
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="w-full space-y-3">
             <input 
              type="text" 
              placeholder="Image URL"
              value={formData.photoURL}
              onChange={(e) => handleChange('photoURL', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm w-full focus:outline-none focus:border-blue-400 text-center"
            />
            <input 
              type="text" 
              placeholder="Display Name"
              value={formData.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-lg font-bold w-full focus:outline-none focus:border-blue-400 text-center"
            />
            <input 
              type="text" 
              placeholder="Tagline (e.g. Seeking Inner Peace)"
              value={formData.tagline}
              onChange={(e) => handleChange('tagline', e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white/70 text-sm w-full focus:outline-none focus:border-blue-400 text-center"
            />
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{user.displayName || 'Zen Master'}</h2>
            <p className="text-sm text-blue-300 mb-1">{user.tagline || 'Beginner Seeker'}</p>
            <p className="text-xs text-white/40">Level {Math.floor(pet.totalEp / 100) + 1}</p>
          </div>
        )}
        
        <button 
          onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          className={`mt-4 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            isEditing 
              ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Details Section */}
      <div className="space-y-4 mb-8">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">About</h3>
        
        {isEditing ? (
          <>
             <textarea 
               placeholder="Tell us about your journey..."
               value={formData.about}
               onChange={(e) => handleChange('about', e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:border-blue-400 min-h-[80px]"
             />
             <div className="grid grid-cols-1 gap-3">
               <div className="relative">
                 <Mail className="absolute left-3 top-2.5 text-white/30" size={16} />
                 <input 
                   type="text" 
                   value={user.email || ''}
                   disabled
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white/50 text-sm cursor-not-allowed"
                 />
               </div>
               <div className="relative">
                 <Phone className="absolute left-3 top-2.5 text-white/30" size={16} />
                 <input 
                   type="text" 
                   placeholder="Phone Number"
                   value={formData.phoneNumber}
                   onChange={(e) => handleChange('phoneNumber', e.target.value)}
                   className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-blue-400"
                 />
               </div>
             </div>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4">
             <p className="text-sm text-white/80 italic">"{user.about || 'No bio yet.'}"</p>
             <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <Mail size={14} /> {user.email || 'No email linked'}
                </div>
                {user.phoneNumber && (
                  <div className="flex items-center gap-3 text-sm text-white/60">
                    <Phone size={14} /> {user.phoneNumber}
                  </div>
                )}
             </div>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2 text-yellow-400">
            <Trophy size={18} />
            <span className="text-xs uppercase tracking-wider">Gold</span>
          </div>
          <p className="text-2xl font-bold text-white">{user.gold}</p>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Star size={18} />
            <span className="text-xs uppercase tracking-wider">EP</span>
          </div>
          <p className="text-2xl font-bold text-white">{pet.totalEp}</p>
        </div>
      </div>

      {/* Companions Section */}
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Companions</h3>
        <div className="flex gap-3 overflow-x-auto pb-4">
           {/* Current Active Pet */}
           <div className="min-w-[80px] p-3 rounded-xl bg-blue-500/20 border border-blue-500/30 flex flex-col items-center">
             <span className="text-2xl mb-1">{pet.stage === 'EGG' ? '🥚' : pet.stage === 'BABY' ? '☁️' : '🐉'}</span>
             <span className="text-[10px] text-blue-200 font-bold uppercase">Active</span>
           </div>

           {/* Inventory */}
           {user.hatchery.inventory.map((p, idx) => (
             <div key={idx} className="min-w-[80px] p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
               <span className="text-2xl mb-1">{p.emoji || '👻'}</span>
               <span className="text-[10px] text-white/50 truncate w-full text-center">{p.name}</span>
             </div>
           ))}
           
           {user.hatchery.inventory.length === 0 && (
             <div className="text-xs text-white/30 flex items-center p-2">
               No other companions yet.
             </div>
           )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 border-t border-white/10 pt-6">
        <button 
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};