import { create } from 'zustand';
import { Vocabulary, StudyProgress } from '@prisma/client';

export type StudyItem = Vocabulary & {
  studyProgress: StudyProgress | null;
};

interface StudyState {
  deck: StudyItem[];
  currentIndex: number;
  isFlipped: boolean;
  inputValue: string;
  feedback: 'correct' | 'incorrect' | null;

  setDeck: (deck: StudyItem[]) => void;
  nextCard: () => void;
  setFlipped: (isFlipped: boolean) => void;
  setInputValue: (inputValue: string) => void;
  setFeedback: (feedback: 'correct' | 'incorrect' | null) => void;
  resetCardState: () => void;
}

export const useStudyStore = create<StudyState>((set) => ({
  deck: [],
  currentIndex: 0,
  isFlipped: false,
  inputValue: '',
  feedback: null,

  setDeck: (deck) => set({ deck, currentIndex: 0, isFlipped: false, inputValue: '', feedback: null }),
  nextCard: () => set((state) => ({
    currentIndex: state.currentIndex + 1,
    isFlipped: false,
    inputValue: '',
    feedback: null
  })),
  setFlipped: (isFlipped) => set({ isFlipped }),
  setInputValue: (inputValue) => set({ inputValue }),
  setFeedback: (feedback) => set({ feedback }),
  resetCardState: () => set({ isFlipped: false, inputValue: '', feedback: null }),
}));
