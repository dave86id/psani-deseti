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
  ['ř','ě','š','č','á','é','í','ý','ž','ó','ď','ť','ň'],            // 3: diacritics
  ['?','!','1','2','3','4','5','6','7','8','9','0'],                // 4: special/numbers
];

const DIGITS = '0123456789';
const PUNCT = ',.-?!';

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

const MIN_POOL_SIZE = 3;

type WordMatch = (lowerWord: string) => boolean;

const ANY_WORD: WordMatch = () => true;
const containing = (ch: string): WordMatch => w => w.includes(ch);
const startingWith = (ch: string): WordMatch => w => w.startsWith(ch);

function buildWordPool(match: WordMatch, tier: number): string[] {
  const allowed = allowedLettersUpToTier(tier);
  return czechWords.filter(w => {
    if (w.length < 2 || w.length > 8) return false;
    if (!match(w.toLowerCase())) return false;
    for (const c of w) if (!allowed.has(c)) return false;
    return true;
  });
}

// Find smallest tier that yields a usable word pool. Starts at `startTier`,
// expands upward only if too few matching words exist there.
function findUsablePool(match: WordMatch, startTier: number): string[] {
  if (startTier < 0) return [];
  let bestPool: string[] = [];
  for (let t = startTier; t < ROW_TIERS.length; t++) {
    const pool = buildWordPool(match, t);
    if (pool.length >= MIN_POOL_SIZE) return pool;
    if (pool.length > bestPool.length) bestPool = pool;
  }
  return bestPool;
}

// Practice tokens for one problem character, preserving its case and kind:
// capital → capitalized words, punctuation → attached to a word, digit →
// short number groups, lowercase letter → plain words containing it.
function buildTokenPool(ch: string): string[] {
  const lower = ch.toLowerCase();
  const tier = tierOf(lower);
  if (tier < 0) return [];

  if (lower !== ch) {
    // Capital letter: words beginning with it, first letter uppercased.
    const starting = findUsablePool(startingWith(lower), tier).map(w => ch + w.slice(1));
    // Rare initial (Ň, Ů, Ó…): add a Xx drill so the key still gets practiced.
    if (starting.length >= MIN_POOL_SIZE) return starting;
    return [...starting, ch + lower, ch + lower + ch + lower];
  }

  if (DIGITS.includes(ch)) {
    const other = () => DIGITS[Math.floor(Math.random() * DIGITS.length)];
    return [ch + ch, ch + other(), other() + ch, ch + other() + ch, other() + ch + other()];
  }

  if (PUNCT.includes(ch)) {
    const words = findUsablePool(ANY_WORD, tier);
    if (words.length === 0) return [];
    const pick = () => words[Math.floor(Math.random() * words.length)];
    if (ch === '-') return words.map(() => `${pick()}-${pick()}`);
    return words.map(w => w + ch);
  }

  return findUsablePool(containing(ch), tier);
}

export function generateGlobalErrorExerciseText(
  errorsByChar: Record<string, number>,
  wordCount = 48
): string {
  // Case is preserved — a capital is a different practice target than its
  // lowercase form (Shift + key vs. key alone).
  const sortedErrors = Object.entries(errorsByChar)
    .filter(([c, n]) => n > 0 && c.trim() !== '' && tierOf(c.toLowerCase()) >= 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  if (sortedErrors.length === 0) {
    return generateSimpleSequence(['f','j','d','k'], 280);
  }

  // Build pools per letter; drop letters with no available words at all.
  const entries: { ch: string; weight: number; pool: string[] }[] = [];
  for (const [ch, n] of sortedErrors) {
    const pool = buildTokenPool(ch);
    if (pool.length > 0) entries.push({ ch, weight: n, pool });
  }

  if (entries.length === 0) {
    return generateSimpleSequence(['f','j','d','k'], 280);
  }

  const totalWeight = entries.reduce((s, e) => s + e.weight, 0);
  const picks: string[] = [];
  for (const e of entries) {
    const slots = Math.max(1, Math.round((e.weight / totalWeight) * wordCount));
    for (let i = 0; i < slots; i++) {
      picks.push(e.pool[Math.floor(Math.random() * e.pool.length)]);
    }
  }

  // Shuffle to interleave letters
  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  return picks.join(' ');
}
