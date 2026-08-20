import type { Lesson } from '../types';

/**
 * Returns true if all space-separated tokens in the text are ≤ 3 chars
 * and the text contains no diacritics (dead-key typing doesn't fit the
 * falling-letters flow). These are candidates for falling-letters mode.
 */
function isFallingCandidate(text: string): boolean {
  if (/[áčďéěíňóřšťúůýž]/i.test(text)) return false;
  const words = text.trim().split(/\s+/);
  return words.every(w => w.length <= 3);
}

/**
 * Determines the display mode for an exercise.
 * Among exercises that are falling candidates, every other one gets 'falling'
 * (starting with classic for the first candidate).
 * Section 8 (Čísla) is always classic.
 */
export function getExerciseMode(lesson: Lesson, exerciseIndex: number): 'classic' | 'falling' {
  if (lesson.id.startsWith('8.')) return 'classic';

  const text = lesson.exercises[exerciseIndex]?.text ?? '';
  if (!isFallingCandidate(text)) return 'classic';

  let candidatesBefore = 0;
  for (let i = 0; i < exerciseIndex; i++) {
    if (isFallingCandidate(lesson.exercises[i].text)) candidatesBefore++;
  }

  return candidatesBefore % 2 === 1 ? 'falling' : 'classic';
}
