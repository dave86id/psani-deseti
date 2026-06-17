import { keyboardRows } from '../data/keyboardLayout';

// Diacritics that have no dedicated key and are typed via a dead key + base
// letter. We attribute their errors to the base letter's physical key.
const DIACRITIC_BASE: Record<string, string> = {
  'Č': 'C', 'č': 'c', 'Ď': 'D', 'ď': 'd', 'Ě': 'E', 'ě': 'e',
  'Ľ': 'L', 'ľ': 'l', 'Ň': 'N', 'ň': 'n', 'Ř': 'R', 'ř': 'r',
  'Š': 'S', 'š': 's', 'Ť': 'T', 'ť': 't', 'Ž': 'Z', 'ž': 'z',
  'Á': 'A', 'á': 'a', 'É': 'E', 'é': 'e', 'Í': 'I', 'í': 'i',
  'Ó': 'O', 'ó': 'o', 'Ú': 'U', 'ú': 'u', 'Ý': 'Y', 'ý': 'y',
};

// char -> physical key (keyDef.key) for everything directly typable on the layout
const directKeyMap: Record<string, string> = {};
keyboardRows.forEach(row => row.forEach(k => {
  if (k.key) directKeyMap[k.key] = k.key;
  if (k.shift) directKeyMap[k.shift] = k.key;
  if (k.altChar) directKeyMap[k.altChar] = k.key;
}));

// Resolve an error character to the physical key it lives on.
// Precedence: dedicated key (incl. shift/alt) > lowercase form > base letter.
function resolveKey(ch: string): string | null {
  if (ch === ' ') return ' ';
  if (ch === '\n') return 'Enter';
  if (ch === '\t') return 'Tab';
  if (directKeyMap[ch] !== undefined) return directKeyMap[ch];
  const lower = ch.toLowerCase();
  if (lower !== ch && directKeyMap[lower] !== undefined) return directKeyMap[lower];
  const base = DIACRITIC_BASE[ch];
  if (base) {
    const baseLower = base.toLowerCase();
    if (directKeyMap[baseLower] !== undefined) return directKeyMap[baseLower];
  }
  return null;
}

// Aggregate error counts per physical key.
export function buildKeyErrorCounts(aggregated: Record<string, number>): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const [ch, n] of Object.entries(aggregated)) {
    if (n <= 0) continue;
    const key = resolveKey(ch);
    if (!key) continue;
    counts[key] = (counts[key] || 0) + n;
  }
  return counts;
}

// Heatmap scale, low -> high errors.
// dark blue, light blue, light green, yellow, orange, red, dark red.
const HEAT_STOPS: [number, number, number][] = [
  [30, 64, 175],    // tmavě modrá
  [96, 165, 250],   // světle modrá
  [134, 239, 172],  // světle zelená
  [250, 204, 21],   // žlutá
  [249, 115, 22],   // oranžová
  [239, 68, 68],    // červená
  [127, 29, 29],    // tmavě červená
];

// Map a key's error count to a heatmap color, given the max count.
export function heatColor(count: number, max: number): string {
  const ratio = max > 0 ? Math.min(count / max, 1) : 0;
  const pos = ratio * (HEAT_STOPS.length - 1);
  const i = Math.min(Math.floor(pos), HEAT_STOPS.length - 2);
  const t = pos - i;
  const [r1, g1, b1] = HEAT_STOPS[i];
  const [r2, g2, b2] = HEAT_STOPS[i + 1];
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

// Build a key -> color map for the heatmap-enabled VirtualKeyboard.
export function buildHeatmap(aggregated: Record<string, number>): {
  colors: Record<string, string>;
  max: number;
  total: number;
} {
  const counts = buildKeyErrorCounts(aggregated);
  const values = Object.values(counts);
  const max = values.length ? Math.max(...values) : 0;
  const total = values.reduce((s, n) => s + n, 0);
  const colors: Record<string, string> = {};
  for (const [key, n] of Object.entries(counts)) {
    colors[key] = heatColor(n, max);
  }
  return { colors, max, total };
}
