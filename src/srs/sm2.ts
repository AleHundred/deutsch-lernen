import type { SRSState, ISODate } from '@/db/schema';

/**
 * SM-2 algorithm implementation
 * @param state Current SRS state for the item (or undefined for new items)
 * @param grade User's grade: 0-2 = incorrect, 3-5 = correct with increasing quality
 * @param now Current date/time
 * @returns Updated SRS state
 */
export function sm2(
  state: SRSState | undefined,
  grade: 0 | 1 | 2 | 3 | 4 | 5,
  now: Date
): SRSState {
  // Initialize state for new items
  const currentState: SRSState = state || {
    itemId: '',  // Will be set by caller
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: now.toISOString() as ISODate,
    totalAttempts: 0,
    totalCorrect: 0,
    recentAttempts: [],
  };

  // Clone to avoid mutation
  const newState: SRSState = {
    ...currentState,
    lastReview: now.toISOString() as ISODate,
    lastGrade: grade,
    totalAttempts: currentState.totalAttempts + 1,
    totalCorrect: currentState.totalCorrect + (grade >= 3 ? 1 : 0),
  };

  // Calculate new ease factor
  // EF' = EF + (0.1 - (5-grade) * (0.08 + (5-grade) * 0.02))
  const efChange = 0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02);
  newState.easeFactor = Math.max(1.3, Math.min(3.0, currentState.easeFactor + efChange));

  // Handle incorrect response (grade < 3)
  if (grade < 3) {
    newState.repetitions = 0;
    newState.interval = 1;
  } else {
    // Correct response (grade >= 3)
    newState.repetitions = currentState.repetitions + 1;

    if (newState.repetitions === 1) {
      newState.interval = 1;
    } else if (newState.repetitions === 2) {
      newState.interval = 6;
    } else {
      // Round to nearest integer
      newState.interval = Math.round(currentState.interval * newState.easeFactor);
    }
  }

  // Calculate next review date
  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + newState.interval);
  newState.nextReview = nextReviewDate.toISOString() as ISODate;

  return newState;
}