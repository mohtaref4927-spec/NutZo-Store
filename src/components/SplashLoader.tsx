import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashLoaderProps {
  onComplete: () => void;
  logoUrl?: string;
  storeName?: string;
}

export const SplashLoader: React.FC<SplashLoaderProps> = ({
  onComplete,
  logoUrl = '/src/assets/images/nutzo_squirrel_logo_1793324006358.jpg',
  storeName = 'NUTZO STORE',
}) => {
  const [progress, setProgress] = useState(12);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setProgress(45), 250);
    const timer2 = setTimeout(() => setProgress(82), 650);
    const timer3 = setTimeout(() => setProgress(100), 1050);
    const timer4 = setTimeout(() => {
      setIsFinished(true);
      setTimeout(onComplete, 400);
    }, 1250);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0400] text-amber-50 select-none overflow-hidden"
          dir="rtl"
        >
          {/* Subtle Ambient Glowing Orange Orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

          {/* Floating Subtle Translucent Square Particles */}
          <div className="absolute w-24 h-24 border border-orange-500/20 bg-orange-950/30 rounded-2xl top-16 right-20 animate-float-slow -rotate-6" />
          <div className="absolute w-16 h-16 border border-amber-500/25 bg-amber-900/20 rounded-xl bottom-20 left-24 animate-float-reverse rotate-12" />
          <div className="absolute w-12 h-12 border border-orange-500/15 bg-orange-900/15 rounded-lg top-1/3 left-16 animate-float-slow rotate-45" />

          {/* Logo & Brand Card */}
          <div className="relative z-10 flex flex-col items-center text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative mb-6"
            >
              {/* Outer Glow Ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-orange-600 to-amber-400 opacity-40 blur-xl animate-pulse" />
              
              <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-3xl overflow-hidden p-1 bg-gradient-to-b from-orange-500/60 to-orange-900/80 shadow-2xl shadow-orange-950/80 border border-orange-400/40">
                <img
                  src={logoUrl}
                  alt={storeName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-2xl"
                  onError={(e) => {
                    // Fallback to text initials if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            </motion.div>

            {/* Store Name Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-2xl md:text-3xl font-extrabold tracking-wider bg-gradient-to-r from-amber-200 via-orange-300 to-amber-100 bg-clip-text text-transparent font-['Plus_Jakarta_Sans',sans-serif]"
            >
              {storeName}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-orange-200/70 text-xs md:text-sm mt-1.5 font-medium"
            >
              عالمك الرقمي يبدأ من هنا
            </motion.p>

            {/* Fast Elegant Progress Bar */}
            <div className="w-56 md:w-64 mt-7">
              <div className="h-1.5 w-full bg-orange-950/80 rounded-full overflow-hidden p-[1px] border border-orange-700/40 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.8)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-orange-400/80 mt-2 font-mono tabular-nums">
                <span>جاري الدخول...</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
