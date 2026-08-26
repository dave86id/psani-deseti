import type { ExerciseScore } from '../types';

// Procvičování chyb se neukládá do lekcí – poslední výsledek si držíme zvlášť.
const KEY = 'psani-deseti-last-error-practice';

export function getLastErrorPractice(): ExerciseScore | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setLastErrorPractice(score: ExerciseScore) {
  try {
    localStorage.setItem(KEY, JSON.stringify(score));
  } catch {
    // ignore
  }
}
