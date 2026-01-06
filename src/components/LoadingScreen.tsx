import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-[100]">
            <motion.div
                animate={{
                    y: [-20, 0, -20],
                    scaleY: [1.1, 0.9, 1.1]
                }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="text-6xl mb-8"
            >
                🥚
            </motion.div>

            <motion.div
                className="flex gap-1"
                initial="hidden"
                animate="show"
                variants={{
                    hidden: { opacity: 0 },
                    show: { opacity: 1, transition: { staggerChildren: 0.2, repeat: Infinity } }
                }}
            >
                <motion.span variants={{ hidden: { opacity: 0.2 }, show: { opacity: 1 } }} className="text-white/50 tracking-widest uppercase text-xs">L</motion.span>
                <motion.span variants={{ hidden: { opacity: 0.2 }, show: { opacity: 1 } }} className="text-white/50 tracking-widest uppercase text-xs">O</motion.span>
                <motion.span variants={{ hidden: { opacity: 0.2 }, show: { opacity: 1 } }} className="text-white/50 tracking-widest uppercase text-xs">A</motion.span>
                <motion.span variants={{ hidden: { opacity: 0.2 }, show: { opacity: 1 } }} className="text-white/50 tracking-widest uppercase text-xs">D</motion.span>
                <motion.span variants={{ hidden: { opacity: 0.2 }, show: { opacity: 1 } }} className="text-white/50 tracking-widest uppercase text-xs">I</motion.span>
                <motion.span variants={{ hidden: { opacity: 0.2 }, show: { opacity: 1 } }} className="text-white/50 tracking-widest uppercase text-xs">N</motion.span>
                <motion.span variants={{ hidden: { opacity: 0.2 }, show: { opacity: 1 } }} className="text-white/50 tracking-widest uppercase text-xs">G</motion.span>
            </motion.div>
        </div>
    );
};
