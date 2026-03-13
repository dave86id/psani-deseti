import { useState, useCallback, useEffect, useRef } from 'react';
import { useSound } from './hooks/useSound';
import { useProgress } from './hooks/useProgress';
import { useExercise } from './hooks/useExercise';
import { getLessonById, getNextLessonId } from './data/lessons';
import Dashboard from './components/Dashboard';
import LessonMenu from './components/LessonMenu';
import ExerciseScreen from './components/ExerciseScreen';
import ResultsScreen from './components/ResultsScreen';
import type { ExerciseResult } from './types';

type Screen = 'dashboard' | 'lesson-menu' | 'exercise' | 'results';

export default function App() {
  const { playCorrect, playWrong } = useSound();
  const { progress, completeExercise, completeLesson } = useProgress();

  const [screen, setScreen] = useState<Screen>('dashboard');
  const [currentLessonId, setCurrentLessonId] = useState<string>('1.1');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [lastResult, setLastResult] = useState<ExerciseResult | null>(null);

  const currentLesson = getLessonById(currentLessonId);
  const currentExerciseText = currentLesson?.exercises[currentExerciseIndex]?.text ?? '';
  const currentExerciseId = currentLesson?.exercises[currentExerciseIndex]?.id ?? 1;

  const {
    state,
    flashCorrect,
    wrongKeyFlash,
    exerciseResult,
    handleKey,
    resetExercise,
  } = useExercise(currentExerciseText);

  // Track if we've already processed this result
  const processedResultRef = useRef<ExerciseResult | null>(null);

  // Watch for exercise completion
  useEffect(() => {
    if (exerciseResult && exerciseResult !== processedResultRef.current && screen === 'exercise') {
      processedResultRef.current = exerciseResult;
      setLastResult(exerciseResult);
      completeExercise(currentLessonId, currentExerciseId, exerciseResult.cpm, exerciseResult.accuracy, currentLesson?.exercises.length ?? 1, exerciseResult.errors, exerciseResult.timeSeconds);
      setScreen('results');
    }
  }, [exerciseResult, screen, currentLessonId, currentExerciseId, completeExercise]);

  // Handle key in exercise
  const onKey = useCallback((key: string) => {
    handleKey(key, playCorrect, playWrong);
  }, [handleKey, playCorrect, playWrong]);

  // Navigate to exercise from lesson menu
  const handleSelectExercise = useCallback((exerciseIndex: number) => {
    const lesson = getLessonById(currentLessonId);
    const text = lesson?.exercises[exerciseIndex]?.text ?? '';
    setCurrentExerciseIndex(exerciseIndex);
    processedResultRef.current = null;
    resetExercise(text);
    setScreen('exercise');
  }, [currentLessonId, resetExercise]);

  // Next exercise
  const handleNext = useCallback(() => {
    if (!currentLesson) return;
    const nextIdx = currentExerciseIndex + 1;
    if (nextIdx < currentLesson.exercises.length) {
      const nextText = currentLesson.exercises[nextIdx].text;
      setCurrentExerciseIndex(nextIdx);
      processedResultRef.current = null;
      resetExercise(nextText);
      setScreen('exercise');
    } else {
      // All exercises in lesson done — mark lesson complete
      const nextLessonId = getNextLessonId(currentLessonId);
      completeLesson(currentLessonId, nextLessonId);
      setScreen('dashboard');
    }
  }, [currentLesson, currentExerciseIndex, currentLessonId, resetExercise, completeLesson]);

  const handleRestart = useCallback(() => {
    processedResultRef.current = null;
    resetExercise(currentExerciseText);
    setScreen('exercise');
  }, [currentExerciseText, resetExercise]);

  const handleRestartAll = useCallback(() => {
    if (!currentLesson) return;
    const firstText = currentLesson.exercises[0]?.text ?? '';
    setCurrentExerciseIndex(0);
    processedResultRef.current = null;
    resetExercise(firstText);
    setScreen('exercise');
  }, [currentLesson, resetExercise]);

  const handleSelectLesson = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId);
    setCurrentExerciseIndex(0);
    setScreen('lesson-menu');
  }, []);

  if (screen === 'dashboard') {
    return <Dashboard progress={progress} onSelectLesson={handleSelectLesson} />;
  }

  if (screen === 'lesson-menu' && currentLesson) {
    return (
      <LessonMenu
        lesson={currentLesson}
        progress={progress}
        onSelectExercise={handleSelectExercise}
        onBack={() => setScreen('dashboard')}
      />
    );
  }

  if (screen === 'results' && lastResult) {
    return (
      <ResultsScreen
        result={lastResult}
        exerciseIndex={currentExerciseIndex}
        totalExercises={currentLesson?.exercises.length ?? 1}
        lessonId={currentLessonId}
        lessonTitle={currentLesson?.title ?? ''}
        onNext={handleNext}
        onRestart={handleRestart}
        onRestartAll={handleRestartAll}
        onBack={() => setScreen('lesson-menu')}
      />
    );
  }

  // Exercise screen
  return (
    <ExerciseScreen
      state={state}
      exerciseIndex={currentExerciseIndex}
      totalExercises={currentLesson?.exercises.length ?? 8}
      lessonId={currentLessonId}
      lessonTitle={currentLesson?.title ?? ''}
      flashCorrect={flashCorrect}
      wrongKeyFlash={wrongKeyFlash}
      onKey={onKey}
      onComplete={(result) => {
        setLastResult(result);
        completeExercise(currentLessonId, currentExerciseId, result.cpm, result.accuracy, currentLesson?.exercises.length ?? 1, result.errors, result.timeSeconds);
        setScreen('results');
      }}
      onBack={() => setScreen('lesson-menu')}
      playCorrect={playCorrect}
      playWrong={playWrong}
    />
  );
}
