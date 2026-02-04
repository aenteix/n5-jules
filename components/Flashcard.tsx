'use client';

import { motion } from 'framer-motion';

interface FlashcardProps {
  kanji: string;
  kana: string;
  meaning: string;
  isFlipped: boolean;
}

export default function Flashcard({ kanji, kana, meaning, isFlipped }: FlashcardProps) {
  return (
    <div className="w-full max-w-sm aspect-[3/4] perspective-[1000px]">
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 w-full h-full bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center shadow-xl backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-7xl font-bold text-slate-800">{kanji}</div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 w-full h-full bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex flex-col items-center justify-center shadow-xl backface-hidden"
          style={{
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="text-4xl font-bold text-indigo-700 mb-4">{kana}</div>
          <div className="text-2xl text-slate-600 font-medium">{meaning}</div>
        </div>
      </motion.div>
    </div>
  );
}
