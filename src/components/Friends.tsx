import React from 'react';
import { Users, Heart, Zap, UserPlus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Friend } from '../types';

export const Friends: React.FC = () => {
  const { user, updateUser, processReward } = useStore();

  // Mock friends if empty
  const friendsList = user.friends || [];

  const handleInteraction = (friendId: string, type: 'encourage' | 'hug') => {
    const today = new Date().toISOString().split('T')[0];
    const friendIndex = friendsList.findIndex(f => f.id === friendId);
    
    if (friendIndex === -1) return;

    const friend = friendsList[friendIndex];
    const lastInteractionDate = friend.lastInteraction ? friend.lastInteraction.split('T')[0] : '';

    // Check if already interacted today
    const isFirstInteraction = lastInteractionDate !== today;

    // Update friend interaction time
    const updatedFriends = [...friendsList];
    updatedFriends[friendIndex] = {
      ...friend,
      lastInteraction: new Date().toISOString()
    };

    updateUser({ friends: updatedFriends });

    if (isFirstInteraction && type === 'encourage') {
      // Reward EP or reduce adventure time
      // The prompt says: "Reduce the remaining time of an active adventure (e.g., by 5–10 minutes)."
      // OR "Help the Main Pet go on an adventure." (Add EP)
      // Let's Add 5 EP for simplicity and consistency with "Energy Points"
      processReward(5, 0); 
      alert(`Sent ${type}! Gained 5 Energy Points!`);
    } else {
      alert(`Sent ${type}!`);
    }
  };

  const handleAddMockFriend = () => {
    const newFriend: Friend = {
      id: Date.now().toString(),
      name: `Traveler ${friendsList.length + 1}`,
      avatar: '👤',
      lastInteraction: ''
    };
    updateUser({ friends: [...friendsList, newFriend] });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light text-white flex items-center gap-2">
          <Users className="text-blue-400" />
          Friends
        </h2>
        <button 
          onClick={handleAddMockFriend}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <UserPlus size={20} className="text-white" />
        </button>
      </div>

      {friendsList.length === 0 ? (
        <div className="text-center text-white/40 py-8">
          <p>No friends yet.</p>
          <p className="text-xs mt-2">Invite travelers to share the journey!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {friendsList.map(friend => {
             const isInteractedToday = friend.lastInteraction?.startsWith(new Date().toISOString().split('T')[0]);
             
             return (
               <div key={friend.id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-lg">
                     {friend.avatar}
                   </div>
                   <div>
                     <h3 className="font-medium text-white">{friend.name}</h3>
                     <p className="text-xs text-white/50">Level 3 Seeker</p>
                   </div>
                 </div>
                 
                 <div className="flex gap-2">
                   <button 
                     onClick={() => handleInteraction(friend.id, 'encourage')}
                     disabled={isInteractedToday}
                     className={`p-2 rounded-lg border transition-colors ${
                       isInteractedToday 
                         ? 'bg-white/5 border-white/5 text-white/20' 
                         : 'bg-green-500/20 border-green-500/30 text-green-300 hover:bg-green-500/30'
                     }`}
                     title={isInteractedToday ? "Already encouraged today" : "Send Encouragement (+5 EP)"}
                   >
                     <Zap size={18} />
                   </button>
                   <button 
                     onClick={() => handleInteraction(friend.id, 'hug')}
                     className="p-2 rounded-lg bg-pink-500/20 border border-pink-500/30 text-pink-300 hover:bg-pink-500/30 transition-colors"
                     title="Send Hug"
                   >
                     <Heart size={18} />
                   </button>
                 </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
};