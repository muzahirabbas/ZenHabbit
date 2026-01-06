import React from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export const Achievements: React.FC = () => {
    const { achievements } = useStore();

    return (
        <div className="p-4">
            <h2 className="text-xl font-light text-white mb-6">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {achievements.map((ach) => (
                    <motion.div
                        key={ach.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`
                            relative p-4 rounded-xl border flex flex-col items-center text-center gap-3
                            ${ach.unlocked
                                ? 'bg-gradient-to-b from-blue-900/20 to-purple-900/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                : 'bg-slate-900/50 border-white/5 opacity-60 grayscale'
                            }
                        `}
                    >
                        <div className={`
                            text-3xl p-3 rounded-full 
                            ${ach.unlocked ? 'bg-blue-500/10' : 'bg-black/20'}
                        `}>
                            {ach.unlocked ? ach.icon : <Lock size={24} className="text-white/20" />}
                        </div>

                        <div>
                            <h3 className={`text-sm font-bold ${ach.unlocked ? 'text-white' : 'text-white/40'}`}>
                                {ach.title}
                            </h3>
                            <p className="text-[10px] text-white/40 mt-1 leading-tight">
                                {ach.description}
                            </p>
                        </div>

                        {ach.unlockedAt && (
                            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                        )}
                    </motion.div>
                ))}
            </div>
            {/* Stats Summary */}
            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="text-xs text-white/50 bg-black/20 text-center uppercase tracking-widest ">
                    Progression
                </div>
                <div className="flex justify-between mt-2 px-4">
                    <div className="text-center">
                        <span className="block text-xl font-bold text-white">{achievements.filter(a => a.unlocked).length}</span>
                        <span className="text-[10px] text-white/30 lowercase">Unlocked</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-xl font-bold text-white">{achievements.length}</span>
                        <span className="text-[10px] text-white/30 lowercase">Total</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
