const STORAGE_KEY = 'psani-deseti-recent-errors';
const MAX_ENTRIES = 15;

export interface RecentErrorsSummary {
  count: number;
  aggregated: Record<string, number>;
  attempts: Record<string, number>;
}

interface Entry {
  errors: Record<string, number>;
  attempts: Record<string, number>;
}

// Entries written before attempt tracking are plain error maps; read them as
// entries with no attempt data rather than dropping the user's history.
function normalize(raw: unknown): Entry | null {
  if (!raw || typeof raw !== 'object') return null;
  const obj = raw as Record<string, unknown>;
  if (obj.errors && typeof obj.errors === 'object') {
    return {
      errors: obj.errors as Record<string, number>,
      attempts: (obj.attempts as Record<string, number>) || {},
    };
  }
  return { errors: obj as Record<string, number>, attempts: {} };
}

function loadEntries(): Entry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.slice(-MAX_ENTRIES).map(normalize).filter((e): e is Entry => e !== null);
    }
  } catch {
    // ignore
  }
  return [];
}

export function recordExerciseErrors(
  errorsByChar: Record<string, number> | undefined,
  attemptsByChar?: Record<string, number>
): void {
  try {
    const entries = loadEntries();
    entries.push({ errors: { ...(errorsByChar || {}) }, attempts: { ...(attemptsByChar || {}) } });
    while (entries.length > MAX_ENTRIES) entries.shift();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function loadRecentErrors(): RecentErrorsSummary {
  const entries = loadEntries();
  const aggregated: Record<string, number> = {};
  const attempts: Record<string, number> = {};
  for (const e of entries) {
    for (const [ch, n] of Object.entries(e.errors)) {
      aggregated[ch] = (aggregated[ch] || 0) + n;
    }
    for (const [ch, n] of Object.entries(e.attempts)) {
      attempts[ch] = (attempts[ch] || 0) + n;
    }
  }
  return { count: entries.length, aggregated, attempts };
}

export function clearRecentErrors(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
