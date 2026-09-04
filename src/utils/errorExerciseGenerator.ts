import { czechWords } from '../data/words';

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
  ['?','!',':','1','2','3','4','5','6','7','8','9','0','+','%','='], // 4: special/numbers
];

const DIGITS = '0123456789';
const PUNCT = ',.-?!:';
const MATH = '+%=';

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
// short number groups, math sign → between digits, lowercase letter → plain
// words containing it. `poolFor` supplies the words allowed in the current
// scope (row tiers globally, the lesson's own letters per lesson).
function buildTokenPool(ch: string, poolFor: (match: WordMatch) => string[]): string[] {
  const lower = ch.toLowerCase();
  const digit = () => DIGITS[Math.floor(Math.random() * DIGITS.length)];

  if (lower !== ch) {
    // Capital letter: words beginning with it, first letter uppercased.
    const starting = poolFor(startingWith(lower)).map(w => ch + w.slice(1));
    // Rare initial (Ň, Ů, Ó…): add a Xx drill so the key still gets practiced.
    if (starting.length >= MIN_POOL_SIZE) return starting;
    return [...starting, ch + lower, ch + lower + ch + lower];
  }

  // Number pools are sampled from, so build enough variants to avoid repeats.
  const variants = (make: () => string) => Array.from({ length: 12 }, make);

  if (DIGITS.includes(ch)) {
    return variants(() => ch + digit() + (Math.random() < 0.5 ? '' : ch + digit()));
  }

  if (MATH.includes(ch)) {
    if (ch === '%') return variants(() => digit() + (Math.random() < 0.5 ? '' : digit()) + ch);
    return variants(() => digit() + ch + digit());
  }

  if (PUNCT.includes(ch)) {
    const words = poolFor(ANY_WORD);
    if (words.length === 0) return [];
    const pick = () => words[Math.floor(Math.random() * words.length)];
    if (ch === '-') return words.map(() => `${pick()}-${pick()}`);
    return words.map(w => w + ch);
  }

  return poolFor(containing(ch));
}

// ─────────────────────────────────────────────────────────────────────────────
// Ranking problem characters
//
// Ranking by raw error count only ever surfaces the letters that appear most
// often in the texts (e, a, o, …). Rare-but-hard keys — capitals, capitals with
// diacritics, colons, question marks, digits — can be missed almost every time
// they show up and still never reach the top of a raw-count list. So rank by
// error rate instead, smoothed so a single slip on a single attempt does not
// outrank a genuine weakness.
//
// With no attempt data (progress saved before attempts were tracked) the score
// degrades to errors / SMOOTHING, i.e. the old raw-count ordering.
// ─────────────────────────────────────────────────────────────────────────────

const SMOOTHING = 4;

export interface RankedChar {
  ch: string;
  weight: number;
}

function rankProblemChars(
  errorsByChar: Record<string, number>,
  attemptsByChar: Record<string, number>,
  limit: number,
  isEligible: (ch: string) => boolean
): RankedChar[] {
  return Object.entries(errorsByChar)
    .filter(([c, n]) => n > 0 && c.trim() !== '' && isEligible(c))
    .map(([ch, errors]) => ({
      ch,
      // Attempts can lag errors in old data; never let the rate exceed 1.
      weight: errors / (Math.max(attemptsByChar[ch] || 0, errors) + SMOOTHING),
    }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit);
}

// ─────────────────────────────────────────────────────────────────────────────
// Lesson error practice: same per-character token pools as the global variant,
// but words are restricted to the lesson's own letters instead of row tiers.
// ─────────────────────────────────────────────────────────────────────────────

function buildLessonWordPool(match: WordMatch, allowed: Set<string>): string[] {
  return czechWords.filter(w => {
    if (w.length < 2 || w.length > 8) return false;
    if (!match(w.toLowerCase())) return false;
    for (const c of w) if (!allowed.has(c)) return false;
    return true;
  });
}

/**
 * Generate a personalized exercise text based on characters where the user makes
 * the most mistakes in this lesson. Case and character kind are preserved, so
 * capitals, punctuation, digits and math signs stay part of the practice.
 */
export function generateErrorExerciseText(
  errorsByChar: Record<string, number>,
  allLetters: string[],
  attemptsByChar: Record<string, number> = {},
  wordCount = 12
): string {
  const allowed = new Set(allLetters.map(c => c.toLowerCase()));
  const fallback = () => generateSimpleSequence(allLetters.slice(0, 4), 60);

  const ranked = rankProblemChars(errorsByChar, attemptsByChar, 5, () => true);
  if (ranked.length === 0) return fallback();

  const entries: { weight: number; pool: string[] }[] = [];
  for (const { ch, weight } of ranked) {
    const pool = buildTokenPool(ch, m => buildLessonWordPool(m, allowed));
    if (pool.length > 0) entries.push({ weight, pool });
  }

  if (entries.length === 0) return fallback();

  return weightedShuffledPicks(entries, wordCount).join(' ');
}

// Weighted sampling from per-character pools, interleaved so one character
// never dominates a whole stretch of the text.
function weightedShuffledPicks(entries: { weight: number; pool: string[] }[], wordCount: number): string[] {
  const totalWeight = entries.reduce((s, e) => s + e.weight, 0);
  const picks: string[] = [];
  for (const e of entries) {
    const slots = Math.max(1, Math.round((e.weight / totalWeight) * wordCount));
    for (let i = 0; i < slots; i++) {
      picks.push(e.pool[Math.floor(Math.random() * e.pool.length)]);
    }
  }

  for (let i = picks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picks[i], picks[j]] = [picks[j], picks[i]];
  }

  return picks;
}

export function generateGlobalErrorExerciseText(
  errorsByChar: Record<string, number>,
  wordCount = 48,
  attemptsByChar: Record<string, number> = {}
): string {
  // Case is preserved — a capital is a different practice target than its
  // lowercase form (Shift + key vs. key alone).
  const ranked = rankProblemChars(
    errorsByChar,
    attemptsByChar,
    8,
    c => tierOf(c.toLowerCase()) >= 0
  );

  if (ranked.length === 0) {
    return generateSimpleSequence(['f','j','d','k'], 280);
  }

  // Build pools per letter; drop letters with no available words at all.
  const entries: { ch: string; weight: number; pool: string[] }[] = [];
  for (const { ch, weight } of ranked) {
    const tier = tierOf(ch.toLowerCase());
    const pool = buildTokenPool(ch, m => findUsablePool(m, tier));
    if (pool.length > 0) entries.push({ ch, weight, pool });
  }

  if (entries.length === 0) {
    return generateSimpleSequence(['f','j','d','k'], 280);
  }

  return weightedShuffledPicks(entries, wordCount).join(' ');
}
