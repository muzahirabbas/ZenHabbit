import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Swords, Trophy, Skull } from 'lucide-react';
import { soundManager } from '../services/SoundManager';

export const BossArena: React.FC = () => {
    const { activeBoss, spawnBoss } = useStore();
    const [shake, setShake] = useState(0);

    // Auto-spawn boss if none exists
    useEffect(() => {
        if (!activeBoss) {
            setTimeout(() => spawnBoss(), 1000); // Small delay for effect
        }
    }, [activeBoss, spawnBoss]);

    useEffect(() => {
        // Trigger shake when HP drops
        if (activeBoss) {
            setShake(prev => prev + 1);
            if (activeBoss.currentHp < activeBoss.maxHp) {
                soundManager.playBossDamage();
            }
        }
    }, [activeBoss?.currentHp]);

    if (!activeBoss) return <div className="p-4 text-center text-white/50">Summoning a worthy foe...</div>;

    if (activeBoss.defeated) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-900/20 border border-green-500/30 rounded-xl p-6 text-center"
            >
                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-green-300">Victory!</h2>
                <p className="text-sm text-green-100/70 mt-2">
                    You defeated the {activeBoss.name}!
                </p>
                <div className="mt-4 flex justify-center gap-4 text-sm font-bold">
                    <span className="text-yellow-400">+{activeBoss.reward.gold} Gold</span>
                    <span className="text-purple-400">+{activeBoss.reward.ep} EP</span>
                </div>
                <button
                    onClick={spawnBoss}
                    className="mt-6 px-4 py-2 bg-green-600/50 hover:bg-green-600 rounded-lg text-sm font-medium transition-colors"
                >
                    Find New Challenger
                </button>
            </motion.div>
        );
    }

    const hpPercent = (activeBoss.currentHp / activeBoss.maxHp) * 100;

    return (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-950/40 to-slate-900/60 border border-red-500/20 p-6">

            {/* Background Effect */}
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Swords size={120} />
            </div>

            <div className="relative z-10 flex flex-col items-center">

                {/* Boss Header */}
                <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-red-100 flex items-center gap-2 justify-center">
                        <Skull size={18} className="text-red-400" />
                        {activeBoss.name}
                        <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                            Lvl {activeBoss.level}
                        </span>
                    </h3>
                    <p className="text-xs text-red-200/50 italic mt-1 max-w-[200px] mx-auto">
                        "{activeBoss.description}"
                    </p>
                </div>

                {/* Boss Avatar */}
                <motion.div
                    key={shake}
                    animate={{ x: [0, -10, 10, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                    className="text-6xl mb-6 filter drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                >
                    {activeBoss.image}
                </motion.div>

                {/* HP Bar */}
                <div className="w-full max-w-xs space-y-2">
                    <div className="flex justify-between text-xs font-bold text-red-200/70 uppercase tracking-wider">
                        <span>HP</span>
                        <span>{activeBoss.currentHp} / {activeBoss.maxHp}</span>
                    </div>
                    <div className="h-4 bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            initial={{ width: '100%' }}
                            animate={{ width: `${hpPercent}%` }}
                            className="h-full bg-gradient-to-r from-red-600 to-orange-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                        />
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-xs text-center text-white/30">
                    Complete habits to deal damage!
                </div>

            </div>
        </div>
    );
};
