import { czechWords } from '../data/words';

/**
 * Returns words that can be typed using only the allowed letters (case-insensitive).
 * Filters to words of length >= minLength and <= maxLength.
 */
export function filterWords(
  allowedLetters: string[],
  minLength = 2,
  maxLength = 12
): string[] {
  const allowed = new Set(allowedLetters.map(l => l.toLowerCase()));
  return czechWords.filter(word => {
    if (word.length < minLength || word.length > maxLength) return false;
    return [...word.toLowerCase()].every(ch => allowed.has(ch));
  });
}

/**
 * Pick N random words from an array (with repetition if needed).
 */
export function pickWords(words: string[], count: number): string[] {
  if (words.length === 0) return [];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(words[Math.floor(Math.random() * words.length)]);
  }
  return result;
}
