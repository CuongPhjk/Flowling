import type { Grade, UserVocabulary } from "../../../shared/types/demo";
export function schedule(
  word: UserVocabulary,
  grade: Grade,
  now = Date.now(),
): UserVocabulary {
  let { ease, interval, repetitions } = word;
  if (grade === "AGAIN") {
    interval = 1;
    repetitions = 0;
    ease -= 0.2;
  }
  if (grade === "HARD") {
    interval = Math.max(1, interval * 1.2);
    ease -= 0.15;
  }
  if (grade === "GOOD") {
    interval = repetitions === 0 ? 1 : repetitions === 1 ? 6 : interval * ease;
    repetitions++;
  }
  if (grade === "EASY") {
    interval = Math.max(4, interval * ease * 1.3);
    ease += 0.15;
    repetitions++;
  }
  interval = Math.round(interval);
  ease = Math.max(1.3, ease);
  return {
    ...word,
    interval,
    ease,
    repetitions,
    nextReviewAt: now + interval * 86400000,
    status: repetitions >= 6 && interval >= 30 ? "MASTERED" : "LEARNING",
  };
}
