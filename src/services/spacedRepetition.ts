export interface ReviewState {
  intervalDays: number
  easeFactor: number
  repetitions: number
}

export const defaultReviewState: ReviewState = {
  intervalDays: 1,
  easeFactor: 2.5,
  repetitions: 0,
}

export function scheduleNextReview(
  quality: 0 | 1 | 2 | 3 | 4 | 5,
  state: ReviewState = defaultReviewState,
): ReviewState {
  if (quality < 3) {
    return { intervalDays: 1, easeFactor: Math.max(1.3, state.easeFactor - 0.2), repetitions: 0 }
  }

  const repetitions = state.repetitions + 1
  const easeFactor = Math.max(1.3, state.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))

  if (repetitions === 1) {
    return { repetitions, easeFactor, intervalDays: 1 }
  }

  if (repetitions === 2) {
    return { repetitions, easeFactor, intervalDays: 3 }
  }

  return {
    repetitions,
    easeFactor,
    intervalDays: Math.round(state.intervalDays * easeFactor),
  }
}
