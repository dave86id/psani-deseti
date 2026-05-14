import { czechWords } from '../data/words';
import { filterWords, pickWords } from './wordFilter';

/**
 * Generate a personalized exercise text based on characters where the user makes the most mistakes.
 * characterErrors: Record of char -> error count
 * allLetters: all letters available in the current context (to mix in)
 */
export function generateErrorExerciseText(
  errorsByChar: Record<string, number>,
  allLetters: string[],
  length = 60,
  wordCount = 10
): string {
  // Sort characters by error count descending
  const sortedErrors = Object.entries(errorsByChar)
    .filter(([char]) => char !== ' ') // Ignore spaces
    .sort((a, b) => b[1] - a[1]);

  if (sortedErrors.length === 0) {
    // Fallback if no errors recorded yet
    return generateSimpleSequence(allLetters.slice(0, 4), length);
  }

  // Take top 4 most problematic characters
  const problematicChars = sortedErrors.slice(0, 4).map(([char]) => char.toLowerCase());

  // Try to find words containing these characters
  const wordsWithErrors = filterWords(allLetters, 2, 8).filter(word =>
    problematicChars.some(char => word.toLowerCase().includes(char))
  );

  if (wordsWithErrors.length >= 5) {
    // Generate a mix of words and sequences
    const pickedWords = pickWords(wordsWithErrors, wordCount);
    return pickedWords.join(' ');
  }

  // If not enough words, generate sequences focusing on the problematic characters
  return generateErrorSequence(problematicChars, allLetters, length);
}

function generateErrorSequence(problemChars: string[], allChars: string[], length: number): string {
  const result: string[] = [];
  let groupCount = 0;

  while (result.join('').replace(/ /g, '').length < length) {
    // 70% chance to pick a problematic character, 30% chance for a random context character
    const isErrorChar = Math.random() < 0.7;
    const char = isErrorChar
      ? problemChars[Math.floor(Math.random() * problemChars.length)]
      : allChars[Math.floor(Math.random() * allChars.length)];

    // Group of 2-4 same characters
    const groupLen = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < groupLen; i++) {
      result.push(char);
    }

    groupCount++;
    if (groupCount % 2 === 0) {
      result.push(' ');
    }
  }

  return result.join('').trim().slice(0, length * 1.5);
}

function generateSimpleSequence(letters: string[], length: number): string {
  const result: string[] = [];
  for (let i = 0; i < length / 2; i++) {
    result.push(letters[i % letters.length]);
    if (i % 3 === 0) result.push(' ');
  }
  return result.join('').trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// Global error practice: per-letter row-tier constrained word selection.
// A word for problem letter X may only contain letters from X's row and rows
// before it. Example: practicing `z` (top row) → words from home+top only,
// no bottom-row letters and no diacritics.
// ─────────────────────────────────────────────────────────────────────────────

const ROW_TIERS: string[][] = [
  ['f','j','d','k','s','l','a','ů','g','h'],                        // 0: home
  ['r','u','t','z','e','i','w','o','p','q','ú'],                    // 1: top
  ['v','m','b','n','c','x','y',',','.','-'],                        // 2: bottom
  ['ř','ě','š','č','á','í','ž','ó','ď','ť','ň'],                    // 3: diacritics
  ['?','!','1','2','3','4','5','6','7','8','9','0'],                // 4: special/numbers
];

function tierOf(ch: string): number {
  const c = ch.toLowerCase();
  for (let i = 0; i < ROW_TIERS.length; i++) {
    if (ROW_TIERS[i].includes(c)) return i;
  }
  return -1;
}

function allowedLettersUpToTier(tier: number): Set<string> {
  const out = new Set<string>();
  for (let i = 0; i <= tier; i++) ROW_TIERS[i].forEach(c => out.add(c));
  return out;
}

export function generateGlobalErrorExerciseText(
  errorsByChar: Record<string, number>,
  wordCount = 48
): string {
  const sortedErrors = Object.entries(errorsByChar)
    .map(([c, n]) => [c.toLowerCase(), n] as [string, number])
    .filter(([c]) => c !== ' ' && c.trim() !== '' && tierOf(c) >= 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (sortedErrors.length === 0) {
    return generateSimpleSequence(['f','j','d','k'], 280);
  }

  const totalWeight = sortedErrors.reduce((s, [, n]) => s + n, 0);

  const picks: string[] = [];
  for (const [ch, n] of sortedErrors) {
    const tier = tierOf(ch);
    const allowed = allowedLettersUpToTier(tier);
    const pool = czechWords.filter(w => {
      if (w.length < 2 || w.length > 8) return false;
      const lower = w.toLowerCase();
      if (!lower.includes(ch)) return false;
      for (const c of lower) if (!allowed.has(c)) return false;
      return true;
    });

    const slots = Math.max(1, Math.round((n / totalWeight) * wordCount));

    if (pool.length === 0) {
      // No valid words → repetitive char drill respecting tier
      picks.push(generateLetterDrill(ch, slots));
    } else {
      for (let i = 0; i < slots; i++) {
        picks.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    }
  }

  // Shuffle to interleave letters
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  return picks.join(' ');
}

function generateLetterDrill(ch: string, groups: number): string {
  const out: string[] = [];
  for (let i = 0; i < groups; i++) {
    const groupLen = 2 + Math.floor(Math.random() * 3);
    out.push(ch.repeat(groupLen));
  }
  return out.join(' ');
}
