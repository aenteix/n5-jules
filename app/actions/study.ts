'use server'

import { prisma } from '../../lib/prisma';
import { calculateReview } from '../../lib/srs';
import { revalidatePath } from 'next/cache';

const USER_EMAIL = 'test@example.com';

export async function getStudySession() {
  const user = await prisma.user.findUnique({
    where: { email: USER_EMAIL },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();

  // 1. Get Due Items (StudyProgress exists and nextReviewDate <= now)
  const dueProgress = await prisma.studyProgress.findMany({
    where: {
      userId: user.id,
      nextReviewDate: { lte: now },
    },
    orderBy: {
      nextReviewDate: 'asc',
    },
    take: 10,
    include: {
      vocabulary: true,
    },
  });

  const dueVocabs = dueProgress.map((p) => ({
    ...p.vocabulary,
    studyProgress: p,
  }));

  if (dueVocabs.length >= 10) {
    return dueVocabs;
  }

  const remaining = 10 - dueVocabs.length;

  // 2. Get New Items (No StudyProgress for this user)
  // We exclude items that already have progress for this user
  const newVocabs = await prisma.vocabulary.findMany({
    where: {
      studyProgress: {
        none: {
          userId: user.id,
        },
      },
    },
    take: remaining,
  });

  const newVocabsWithNullProgress = newVocabs.map((v) => ({
    ...v,
    studyProgress: null,
  }));

  // Combine and shuffle "New" items? Or just append.
  // Usually new items are appended.
  return [...dueVocabs, ...newVocabsWithNullProgress];
}

export async function submitReview(vocabId: number, quality: number) {
  const user = await prisma.user.findUnique({
    where: { email: USER_EMAIL },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const currentProgress = await prisma.studyProgress.findFirst({
    where: {
      userId: user.id,
      vocabId: vocabId,
    },
  });

  const result = calculateReview({
    quality,
    previousProgress: currentProgress,
  });

  if (currentProgress) {
    await prisma.studyProgress.update({
      where: { id: currentProgress.id },
      data: {
        nextReviewDate: result.nextReviewDate,
        interval: result.interval,
        easeFactor: result.easeFactor,
        streak: result.streak,
      },
    });
  } else {
    await prisma.studyProgress.create({
      data: {
        userId: user.id,
        vocabId: vocabId,
        nextReviewDate: result.nextReviewDate,
        interval: result.interval,
        easeFactor: result.easeFactor,
        streak: result.streak,
      },
    });
  }

  revalidatePath('/study');
}
