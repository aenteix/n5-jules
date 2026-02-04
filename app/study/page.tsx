'use client';

import { useEffect, useRef, useState } from 'react';
import { useStudyStore } from '@/lib/store';
import Flashcard from '@/components/Flashcard';
import { getStudySession, submitReview } from '@/app/actions/study';
import * as wanakana from 'wanakana';
import { clsx } from 'clsx';

export default function StudyPage() {
  const {
    deck, currentIndex, isFlipped, inputValue, feedback,
    setDeck, nextCard, setFlipped, setInputValue, setFeedback
  } = useStudyStore();

  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function initSession() {
      try {
        const session = await getStudySession();
        setDeck(session);
      } catch (error) {
        console.error("Failed to load session", error);
      } finally {
        setIsLoading(false);
      }
    }
    initSession();
  }, [setDeck]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(wanakana.toKana(e.target.value, { IMEMode: true }));
  };

  const currentCard = deck[currentIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (feedback) {
      // Move to next card
      nextCard();
      return;
    }

    if (!currentCard) return;

    // Normalize answer (toKana just in case, though bind handles it)
    // Sometimes users might paste or something.
    const answer = wanakana.toKana(inputValue).trim();
    const isCorrect = answer === currentCard.kana;

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    setFlipped(true);

    // Calculate Quality
    const quality = isCorrect ? 5 : 0;

    try {
      await submitReview(currentCard.id, quality);
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <div className="animate-pulse">Loading Study Session...</div>
      </div>
    );
  }

  if (currentIndex >= deck.length) {
     return (
       <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-slate-50 p-4">
         <h1 className="text-4xl font-bold text-slate-800">Session Complete! 🎉</h1>
         <p className="text-xl text-slate-600">You have reviewed {deck.length} cards.</p>
         <button
           onClick={() => window.location.reload()}
           className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-lg font-semibold"
         >
            Start New Session
         </button>
       </div>
     );
  }

  // Safety check if deck is empty initially
  if (!currentCard) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
         <h1 className="text-2xl font-bold text-slate-800">No cards due for review!</h1>
         <p className="text-slate-600">Check back later or add more vocabulary.</p>
       </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-slate-50">
       <div className="w-full max-w-md flex flex-col items-center gap-8">

          <div className="w-full flex justify-between text-sm font-medium text-slate-500">
             <span>Card {currentIndex + 1} / {deck.length}</span>
             <span className="flex items-center gap-1">
               Streak: <span className="text-indigo-600">{currentCard.studyProgress?.streak || 0}</span>
             </span>
          </div>

          <Flashcard
             kanji={currentCard.kanji}
             kana={currentCard.kana}
             meaning={currentCard.meaning}
             isFlipped={isFlipped}
          />

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
             <div className="relative">
               <input
                 ref={inputRef}
                 type="text"
                 value={inputValue}
                 onChange={handleInput}
                 placeholder="Type reading in Hiragana..."
                 className={clsx(
                   "w-full px-4 py-4 text-lg text-center border-2 rounded-xl outline-none transition-all shadow-sm",
                   feedback === 'correct' && "border-green-500 bg-green-50 text-green-900",
                   feedback === 'incorrect' && "border-red-500 bg-red-50 text-red-900",
                   !feedback && "border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                 )}
                 autoFocus
                 disabled={!!feedback}
                 autoComplete="off"
               />
             </div>

             {feedback && (
               <div className={clsx(
                 "p-4 rounded-xl text-center font-bold text-lg animate-in fade-in slide-in-from-bottom-2",
                 feedback === 'correct' ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"
               )}>
                 {feedback === 'correct' ? '✨ Correct!' : `❌ Wrong! It's ${currentCard.kana}`}
               </div>
             )}

             <button
               type="submit"
               className={clsx(
                 "w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg active:scale-[0.98]",
                 feedback === 'correct' ? "bg-green-500 hover:bg-green-600 shadow-green-500/20" :
                 feedback === 'incorrect' ? "bg-red-500 hover:bg-red-600 shadow-red-500/20" :
                 "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
               )}
             >
               {feedback ? 'Next Card →' : 'Check Answer'}
             </button>
          </form>
       </div>
    </div>
  );
}
