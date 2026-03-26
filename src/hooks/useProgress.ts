import { useState, useCallback, useEffect, useRef } from 'react';
import type { UserProgress, LessonProgress } from '../types';

const STORAGE_KEY = 'psani-deseti-progress';

const emptyLesson = (id: string): LessonProgress => ({
  id,
  bestCpm: 0,
  bestAccuracy: 0,
  completedExercises: [],
  completed: false,
  exerciseScores: {},
  errorsByChar: {},
});

const defaultProgress = (): UserProgress => ({
  lessons: { '1.1': emptyLesson('1.1') },
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
      const existing = prev.lessons[lessonId] ?? emptyLesson(lessonId);
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

  const completeExercise = useCallback((lessonId: string, exerciseId: number, cpm: number, accuracy: number, totalExercises: number, errors: number, timeSeconds: number, errorsByChar?: Record<string, number>) => {
    setProgress(prev => {
      const lesson = prev.lessons[lessonId] || emptyLesson(lessonId);
      
      const updatedExercises = lesson.completedExercises.includes(exerciseId)
        ? lesson.completedExercises
        : [...lesson.completedExercises, exerciseId];

      const existingErrors = prev.lessons[lessonId]?.errorsByChar || {};
      const mergedErrors = { ...existingErrors };
      
      if (errorsByChar) {
        Object.entries(errorsByChar).forEach(([char, count]) => {
          mergedErrors[char] = (mergedErrors[char] || 0) + count;
        });
      }

      const updatedLesson: LessonProgress = {
        ...lesson,
        bestCpm: Math.max(lesson.bestCpm, cpm),
        bestAccuracy: Math.max(lesson.bestAccuracy, accuracy),
        completedExercises: updatedExercises,
        completed: updatedExercises.length === totalExercises,
        exerciseScores: {
          ...lesson.exerciseScores,
          [exerciseId]: { cpm, accuracy, errors, timeSeconds, errorsByChar: errorsByChar || {} },
        },
        errorsByChar: mergedErrors,
      };

      const newState = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: updatedLesson,
        },
      };

      saveProgress(newState);
      if (onSaveRef.current) onSaveRef.current(newState);
      return newState;
    });
  }, []);

  const completeLesson = useCallback((lessonId: string, nextLessonId: string | null) => {
    setProgress(prev => {
      const existing = prev.lessons[lessonId] ?? emptyLesson(lessonId);
      const newLessons: UserProgress['lessons'] = {
        ...prev.lessons,
        [lessonId]: { ...existing, completed: true },
      };
      // Unlock next lesson
      if (nextLessonId && !newLessons[nextLessonId]) {
        newLessons[nextLessonId] = emptyLesson(nextLessonId);
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

  const resetProgress = useCallback((p?: UserProgress) => {
    const fresh = p ?? defaultProgress();
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return { progress, updateLesson, completeExercise, completeLesson, isLessonUnlocked, isLessonCompleted, resetProgress };
}
