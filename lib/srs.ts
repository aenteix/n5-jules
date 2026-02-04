import { addDays } from 'date-fns';

export interface ReviewInput {
  quality: number; // 0-5
  previousProgress?: {
    interval: number;
    easeFactor: number;
    streak: number;
  } | null;
}

export interface ReviewResult {
  interval: number;
  easeFactor: number;
  streak: number;
  nextReviewDate: Date;
}

export function calculateReview({ quality, previousProgress }: ReviewInput): ReviewResult {
  // Default values for new items
  const prevInterval = previousProgress?.interval ?? 0;
  const prevEaseFactor = previousProgress?.easeFactor ?? 2.5;
  const prevStreak = previousProgress?.streak ?? 0;

  let newInterval: number;
  let newEaseFactor: number;
  let newStreak: number;

  if (quality < 3) {
    // Forgot / Wrong
    newInterval = 1;
    newEaseFactor = prevEaseFactor;
    newStreak = 0;
  } else {
    // Correct / Easy
    if (prevStreak === 0) {
      newInterval = 1;
    } else if (prevStreak === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(prevInterval * prevEaseFactor);
    }

    newStreak = prevStreak + 1;

    // Calculate new Ease Factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    const qFactor = 5 - quality;
    const delta = 0.1 - qFactor * (0.08 + qFactor * 0.02);
    newEaseFactor = prevEaseFactor + delta;

    // Floor EF at 1.3
    if (newEaseFactor < 1.3) {
      newEaseFactor = 1.3;
    }
  }

  const nextReviewDate = addDays(new Date(), newInterval);

  return {
    interval: newInterval,
    easeFactor: newEaseFactor,
    streak: newStreak,
    nextReviewDate,
  };
}
