import { useState, useCallback, useEffect, useRef } from 'react';
import type { UserProgress, LessonProgress } from '../types';

const STORAGE_KEY = 'psani-deseti-progress';

const emptyLesson = (): LessonProgress => ({
  completed: false, bestCpm: 0, bestAccuracy: 0, completedExercises: [], exerciseScores: {}, characterErrors: {},
});

const defaultProgress = (): UserProgress => ({
  lessons: { '1.1': emptyLesson() },
  settings: { soundEnabled: true },
});

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return defaultProgress();
}

function saveProgress(p: UserProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ignore
  }
}

export function useProgress(onSave?: (p: UserProgress) => void) {
  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  const updateLesson = useCallback((lessonId: string, update: Partial<LessonProgress>) => {
    setProgress(prev => {
      const existing = prev.lessons[lessonId] ?? emptyLesson();
      const updated: UserProgress = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: { ...existing, ...update },
        },
      };
      saveProgress(updated);
      onSaveRef.current?.(updated);
      return updated;
    });
  }, []);

  const completeExercise = useCallback((lessonId: string, exerciseId: number, cpm: number, accuracy: number, totalExercises: number, errors: number, timeSeconds: number, characterErrors: Record<string, number>) => {
    setProgress(prev => {
      const existing = prev.lessons[lessonId] ?? emptyLesson();
      const completedExercises = existing.completedExercises.includes(exerciseId)
        ? existing.completedExercises
        : [...existing.completedExercises, exerciseId];
      const allDone = completedExercises.length >= totalExercises;

      const newCharacterErrors = { ...existing.characterErrors };
      Object.entries(characterErrors).forEach(([char, count]) => {
        newCharacterErrors[char] = (newCharacterErrors[char] || 0) + count;
      });

      const updated: UserProgress = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            ...existing,
            completed: existing.completed || allDone,
            completedExercises,
            exerciseScores: { ...existing.exerciseScores, [exerciseId]: { cpm, accuracy, errors, timeSeconds, characterErrors } },
            bestCpm: Math.max(existing.bestCpm, cpm),
            bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
            characterErrors: newCharacterErrors,
          },
        },
      };
      saveProgress(updated);
      onSaveRef.current?.(updated);
      return updated;
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, nextLessonId: string | null) => {
    setProgress(prev => {
      const existing = prev.lessons[lessonId] ?? emptyLesson();
      const newLessons: UserProgress['lessons'] = {
        ...prev.lessons,
        [lessonId]: { ...existing, completed: true },
      };
      // Unlock next lesson
      if (nextLessonId && !newLessons[nextLessonId]) {
        newLessons[nextLessonId] = emptyLesson();
      }
      const updated: UserProgress = { ...prev, lessons: newLessons };
      saveProgress(updated);
      onSaveRef.current?.(updated);
      return updated;
    });
  }, []);

  const isLessonUnlocked = useCallback((lessonId: string): boolean => {
    return lessonId === '1.1' || !!progress.lessons[lessonId];
  }, [progress]);

  const isLessonCompleted = useCallback((lessonId: string): boolean => {
    return progress.lessons[lessonId]?.completed ?? false;
  }, [progress]);

  return { progress, updateLesson, completeExercise, completeLesson, isLessonUnlocked, isLessonCompleted };
}
