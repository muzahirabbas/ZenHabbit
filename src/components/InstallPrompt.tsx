import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const InstallPrompt: React.FC = () => {
    const { isInstallable, promptInstall } = usePWAInstall();
    const [isVisible, setIsVisible] = useState(true);

    if (!isInstallable || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -100, opacity: 0 }}
                className="fixed top-0 left-0 right-0 z-[100] px-4 py-3"
            >
                <div className="max-w-md mx-auto bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-md border border-white/20 rounded-xl p-3 shadow-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 p-2 rounded-lg">
                            <Download size={20} className="text-blue-300" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Install App</h3>
                            <p className="text-[10px] text-white/70">Enable offline mode & better performance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={promptInstall}
                            className="bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Install
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-white/50 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
