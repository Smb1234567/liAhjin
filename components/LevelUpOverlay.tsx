'use client';

import { AnimatePresence, motion } from 'framer-motion';

export default function LevelUpOverlay({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#070a11]/92 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.25, ease: 'easeOut' } }}
          exit={{ opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
        >
          <div className="text-center">
            <p className="font-display text-4xl text-gold drop-shadow-[0_0_24px_rgba(248,184,78,0.45)]">
              LEVEL UP - The System acknowledges your growth.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
