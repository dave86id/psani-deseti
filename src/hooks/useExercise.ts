import { useState, useCallback, useRef } from 'react';
import type { ExerciseState, ExerciseResult } from '../types';
import { calculateStats } from '../utils/stats';

function createInitialState(text: string): ExerciseState {
  return {
    text,
    currentIndex: 0,
    errors: new Set<number>(),
    startTime: null,
    isComplete: false,
    totalErrors: 0,
    characterErrors: {},
  };
}

export function useExercise(initialText: string) {
  const [state, setState] = useState<ExerciseState>(
    () => createInitialState(initialText)
  );
  const [flashCorrect, setFlashCorrect] = useState(false);
  const [wrongKeyFlash, setWrongKeyFlash] = useState<string | null>(null);
  const [exerciseResult, setExerciseResult] = useState<ExerciseResult | null>(null);
  const endTimeRef = useRef<number>(0);

  const handleKey = useCallback(
    (key: string, onCorrect: () => void, onWrong: () => void) => {
      setState((prev) => {
        if (prev.isComplete) return prev;

        const expectedChar = prev.text[prev.currentIndex];

        // Start timer on first keystroke
        const startTime = prev.startTime ?? Date.now();

        if (key === expectedChar) {
          // Correct key
          onCorrect();
          const newIndex = prev.currentIndex + 1;
          const isComplete = newIndex >= prev.text.length;

          if (isComplete) {
            endTimeRef.current = Date.now();
          }

          // Flash correct
          setFlashCorrect(true);
          setTimeout(() => setFlashCorrect(false), 150);

          if (isComplete) {
            const res = calculateStats(
              prev.text,
              prev.totalErrors,
              startTime,
              endTimeRef.current
            );
            setExerciseResult({ ...res, characterErrors: prev.characterErrors });
          }

          return {
            ...prev,
            currentIndex: newIndex,
            startTime,
            isComplete,
          };
        } else {
          // Wrong key
          onWrong();
          const newErrors = new Set(prev.errors);
          newErrors.add(prev.currentIndex);

          const newCharErrors = { ...prev.characterErrors };
          newCharErrors[expectedChar] = (newCharErrors[expectedChar] || 0) + 1;

          // Flash wrong key on keyboard
          setWrongKeyFlash(key);
          setTimeout(() => setWrongKeyFlash(null), 200);

          return {
            ...prev,
            startTime,
            errors: newErrors,
            totalErrors: prev.totalErrors + 1,
            characterErrors: newCharErrors,
          };
        }
      });
    },
    []
  );

  const resetExercise = useCallback((newText?: string) => {
    setState(prev => createInitialState(newText ?? prev.text));
    setExerciseResult(null);
    setFlashCorrect(false);
    setWrongKeyFlash(null);
  }, []);

  return {
    state,
    exerciseResult,
    flashCorrect,
    wrongKeyFlash,
    handleKey,
    resetExercise,
  };
}
