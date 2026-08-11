// On macOS, pressing Shift+dead_key, Shift+letter does NOT produce a composed
// character in keydown events — the browser sends the raw letter (e.g. 'C' not 'Č').
// This function manually composes letter + diacritic using Unicode NFC normalization.
// Czech QWERTZ Mac: both dead keys use the same Equal key, distinguished by shiftKey:
//   Equal + shiftKey:true  → háček (caron ˇ)  → combining caron  U+030C
//   Equal + shiftKey:false → čárka (acute ´) → combining acute  U+0301
export function composeDeadKey(deadCode: string, deadShift: boolean, letter: string): string | null {
  // Determine the primary combining diacritic from the dead key
  let primary: string | null = null;
  if (deadCode === 'Equal') {
    primary = deadShift ? '\u030C' : '\u0301'; // caron (háček) or acute (čárka)
  }
  // Try primary first, then the other one as fallback for unknown dead keys
  const order = primary
    ? [primary, primary === '\u030C' ? '\u0301' : '\u030C']
    : ['\u0301', '\u030C'];

  for (const combining of order) {
    // Czech layout quirk: háček over u yields ů/Ů (ring), not ǔ/Ǔ.
    const mark = combining === '\u030C' && (letter === 'u' || letter === 'U')
      ? '\u030A' // combining ring above
      : combining;
    const composed = (letter + mark).normalize('NFC');
    if (composed.length === 1 && composed !== letter) return composed;
  }
  return null;
}
