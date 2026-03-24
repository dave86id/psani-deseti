import { useState, useCallback, useRef } from 'react';
import type { ExerciseState, ExerciseResult } from '../types';
import { calculateStats } from '../utils/stats';

function createInitialState(text: string): ExerciseState {
  return {
    text,
    currentIndex: 0,
    totalErrors: 0,
    errorsByChar: {},
    errors: new Set<number>(),
    status: 'idle',
  };
}

export function useExercise(initialText: string) {
  const [state, setState] = useState<ExerciseState>(() => createInitialState(initialText));
  const [flashCorrect, setFlashCorrect] = useState(false);
  const [wrongKeyFlash, setWrongKeyFlash] = useState<string | null>(null);
  const [exerciseResult, setExerciseResult] = useState<ExerciseResult | null>(null);
  const startTimeRef = useRef<number>(0);
  const endTimeRef = useRef<number>(0);

  const handleKey = useCallback(
    (key: string) => {
      setState((prev) => {
        if (prev.status === 'completed') return prev;

        // Start timer on first keystroke
        if (prev.status === 'idle') {
          startTimeRef.current = Date.now();
          prev = { ...prev, status: 'running' };
        }

        const expectedChar = prev.text[prev.currentIndex];

        if (key === expectedChar) {
          // Correct key
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
              startTimeRef.current,
              endTimeRef.current
            );
            setExerciseResult({ ...res, errorsByChar: prev.errorsByChar });
            return {
              ...prev,
              currentIndex: newIndex,
              status: 'completed',
            };
          }

          return {
            ...prev,
            currentIndex: newIndex,
          };
        } else {
          // Wrong key
          const char = prev.text[prev.currentIndex];
          const newTotalErrors = prev.totalErrors + 1;
          const newErrorsByChar = { ...prev.errorsByChar };
          newErrorsByChar[char] = (newErrorsByChar[char] || 0) + 1;
          
          const newErrors = new Set(prev.errors);
          newErrors.add(prev.currentIndex);

          // Flash wrong key on keyboard
          setWrongKeyFlash(key);
          setTimeout(() => setWrongKeyFlash(null), 200);

          return {
            ...prev,
            totalErrors: newTotalErrors,
            errorsByChar: { ...prev.errorsByChar, [char]: (prev.errorsByChar[char] || 0) + 1 },
            errors: newErrors,
          };
        }
      });
    },
    []
  );

  const resetExercise = useCallback((newText: string) => {
    setState({
      text: newText,
      currentIndex: 0,
      totalErrors: 0,
      errorsByChar: {},
      errors: new Set<number>(),
      status: 'idle',
    });
    setExerciseResult(null);
    setFlashCorrect(false);
    setWrongKeyFlash(null);
    startTimeRef.current = 0;
    endTimeRef.current = 0;
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
