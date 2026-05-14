const STORAGE_KEY = 'psani-deseti-recent-errors';
const MAX_ENTRIES = 15;

export interface RecentErrorsSummary {
  count: number;
  aggregated: Record<string, number>;
}

function loadEntries(): Record<string, number>[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.slice(-MAX_ENTRIES);
  } catch {
    // ignore
  }
  return [];
}

export function recordExerciseErrors(errorsByChar: Record<string, number> | undefined): void {
  try {
    const entries = loadEntries();
    entries.push(errorsByChar ? { ...errorsByChar } : {});
    while (entries.length > MAX_ENTRIES) entries.shift();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore
  }
}

export function loadRecentErrors(): RecentErrorsSummary {
  const entries = loadEntries();
  const aggregated: Record<string, number> = {};
  for (const e of entries) {
    for (const [ch, n] of Object.entries(e)) {
      aggregated[ch] = (aggregated[ch] || 0) + n;
    }
  }
  return { count: entries.length, aggregated };
}

export function clearRecentErrors(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
