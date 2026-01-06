import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Sparkles, ArrowRight } from 'lucide-react';
import { soundManager } from '../services/SoundManager';

const STARTER_PETS = [
    { id: 'Turtle', name: 'Moss Turtle', emoji: '🐢', desc: 'Steady and calm. Bonus: Compassion.' },
    { id: 'Owl', name: 'Moon Owl', emoji: '🦉', desc: 'Wise and observant. Bonus: Intelligence.' },
    { id: 'Cat', name: 'Shadow Cat', emoji: '🐈‍⬛', desc: 'Agile and mysterious. Bonus: Agility.' },
    { id: 'Dragon', name: 'Ember Dragon', emoji: '🐉', desc: 'Fiery and strong. Bonus: Strength.' },
];

export const OnboardingWizard: React.FC = () => {
    const { setOnboardingComplete, setStarterPet } = useStore();
    const [step, setStep] = useState<'welcome' | 'choose' | 'hatch'>('welcome');
    const [selectedPet, setSelectedPet] = useState<string | null>(null);

    const handlePetSelect = (id: string) => {
        setSelectedPet(id);
        soundManager.playClick();
    };

    const handleConfirmPet = () => {
        if (selectedPet) {
            setStep('hatch');
            setStarterPet(selectedPet);
            soundManager.playComplete();
        }
    };

    const finishOnboarding = () => {
        setOnboardingComplete();
        soundManager.playAchievement();
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#0a0a0f] flex items-center justify-center p-6">
            <div className="max-w-md w-full">
                <AnimatePresence mode="wait">

                    {step === 'welcome' && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-6xl mb-6"
                            >
                                ✨
                            </motion.div>
                            <h1 className="text-3xl font-light text-white mb-4">Welcome to <span className="text-blue-400">ZenHabit</span></h1>
                            <p className="text-white/60 mb-8 leading-relaxed">
                                Your journey of self-improvement begins here. But you won't be alone.
                                <br /><br />
                                A companion is waiting for you.
                            </p>
                            <button
                                onClick={() => setStep('choose')}
                                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 mx-auto"
                            >
                                Begin Journey <ArrowRight size={18} />
                            </button>
                        </motion.div>
                    )}

                    {step === 'choose' && (
                        <motion.div
                            key="choose"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h2 className="text-xl text-center text-white mb-6">Choose your Companion</h2>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {STARTER_PETS.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => handlePetSelect(p.id)}
                                        className={`
                      cursor-pointer p-4 rounded-xl border transition-all text-center
                      ${selectedPet === p.id
                                                ? 'bg-blue-500/20 border-blue-400 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10'}
                    `}
                                    >
                                        <div className="text-4xl mb-2">{p.emoji}</div>
                                        <h3 className="font-bold text-white text-sm">{p.name}</h3>
                                        <p className="text-[10px] text-white/50 mt-1">{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                            <button
                                disabled={!selectedPet}
                                onClick={handleConfirmPet}
                                className={`
                  w-full py-3 rounded-xl font-bold transition-all
                  ${selectedPet
                                        ? 'bg-blue-500 text-white shadow-lg hover:bg-blue-600'
                                        : 'bg-white/10 text-white/30 cursor-not-allowed'}
                `}
                            >
                                Adopt {selectedPet ? STARTER_PETS.find(p => p.id === selectedPet)?.name : ''}
                            </button>
                        </motion.div>
                    )}

                    {step === 'hatch' && (
                        <motion.div
                            key="hatch"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center"
                        >
                            <div className="relative mb-8">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: [0, 1.2, 1] }}
                                    transition={{ duration: 0.5 }}
                                    className="text-9xl filter drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                                >
                                    {STARTER_PETS.find(p => p.id === selectedPet)?.emoji}
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full w-32 h-32 mx-auto -z-10"
                                />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2"> It's Hatched!</h2>
                            <p className="text-white/60 mb-8 max-w-xs mx-auto">
                                Your new friend is ready to grow with you. Complete habits to earn EP and help them evolve!
                            </p>

                            <div className="bg-white/5 p-4 rounded-lg mb-8 text-left text-sm text-white/80 space-y-2">
                                <p className="flex items-center gap-2"><Sparkles size={14} className="text-yellow-400" /> <b>Feed</b> to reduce hunger.</p>
                                <p className="flex items-center gap-2"><Sparkles size={14} className="text-pink-400" /> <b>Play</b> to increase happiness.</p>
                                <p className="flex items-center gap-2"><Sparkles size={14} className="text-blue-400" /> <b>Train</b> to gain XP.</p>
                            </div>

                            <button
                                onClick={finishOnboarding}
                                className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-blue-50 w-full"
                            >
                                Enter Sanctuary
                            </button>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
