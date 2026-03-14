import type { Lesson } from '../types';

/**
 * Returns true if all space-separated tokens in the text are ≤ 3 chars.
 * These are candidates for falling-letters mode.
 */
function isFallingCandidate(text: string): boolean {
  const words = text.trim().split(/\s+/);
  return words.every(w => w.length <= 3);
}

/**
 * Determines the display mode for an exercise.
 * Among exercises that are falling candidates, every other one gets 'falling'
 * (starting with classic for the first candidate).
 */
export function getExerciseMode(lesson: Lesson, exerciseIndex: number): 'classic' | 'falling' {
  const text = lesson.exercises[exerciseIndex]?.text ?? '';
  if (!isFallingCandidate(text)) return 'classic';

  let candidatesBefore = 0;
  for (let i = 0; i < exerciseIndex; i++) {
    if (isFallingCandidate(lesson.exercises[i].text)) candidatesBefore++;
  }

  return candidatesBefore % 2 === 1 ? 'falling' : 'classic';
}
