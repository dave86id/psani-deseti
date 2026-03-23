import type { ExerciseResult, ExerciseScore } from '../types';

export function getMedal(score: ExerciseScore): '🥇' | '🥈' | '🥉' | null {
  if (score.accuracy >= 97 && score.cpm >= 120 && score.errors <= 1) return '🥇';
  if (score.accuracy >= 90 && score.cpm >= 70  && score.errors <= 3) return '🥈';
  if (score.accuracy >= 80 && score.cpm >= 40)                        return '🥉';
  return null;
}

export function getLessonMedal(scores: Record<number, ExerciseScore>): '🥇' | '🥈' | '🥉' | null {
  const entries = Object.values(scores);
  if (entries.length === 0) return null;
  const points = entries.map(s => {
    const m = getMedal(s);
    return (m === '🥇' ? 3 : m === '🥈' ? 2 : m === '🥉' ? 1 : 0) as number;
  });
  const avg = points.reduce((a, b) => a + b, 0) / points.length;
  if (avg >= 2.5) return '🥇';
  if (avg >= 1.5) return '🥈';
  if (avg >= 0.8) return '🥉';
  return null;
}

export function calculateStats(
  text: string,
  totalErrors: number,
  startTime: number,
  endTime: number
): ExerciseResult {
  const timeSeconds = (endTime - startTime) / 1000;
  const timeMinutes = timeSeconds / 60;

  // CPM = characters typed / time in minutes
  const cpm = timeMinutes > 0 ? Math.round(text.length / timeMinutes) : 0;

  // Accuracy = (correct presses / total presses) * 100
  const totalPresses = text.length + totalErrors;
  const accuracy =
    totalPresses > 0
      ? Math.round(((text.length - totalErrors) / totalPresses) * 100)
      : 100;

  return {
    cpm,
    accuracy: Math.max(0, accuracy),
    errors: totalErrors,
    timeSeconds: Math.round(timeSeconds),
    errorsByChar: {},
  };
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}
