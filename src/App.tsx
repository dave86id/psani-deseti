import { useState, useCallback, useEffect, useRef } from 'react';
import { useSound } from './hooks/useSound';
import { useProgress } from './hooks/useProgress';
import { useExercise } from './hooks/useExercise';
import { useAuth } from './hooks/useAuth';
import { useFirestoreProgress } from './hooks/useFirestoreProgress';
import { useLeaderboard } from './hooks/useLeaderboard';
import { getLessonById, getNextLessonId, getAllLessons } from './data/lessons';
import { getExerciseMode } from './utils/exerciseMode';
import Dashboard from './components/Dashboard';
import LessonMenu from './components/LessonMenu';
import ExerciseScreen from './components/ExerciseScreen';
import ResultsScreen from './components/ResultsScreen';
import LoginScreen from './components/LoginScreen';
import ProfileSetup from './components/ProfileSetup';
import Leaderboard from './components/Leaderboard';
import FallingLettersMode from './components/FallingLettersMode';
import type { ExerciseResult } from './types';

type Screen = 'dashboard' | 'lesson-menu' | 'exercise' | 'falling' | 'results';

function isMobileDevice(): boolean {
  const ua = navigator.userAgent;
  const isTouchOnly = navigator.maxTouchPoints > 0 && !window.matchMedia('(pointer: fine)').matches;
  const isNarrow = window.innerWidth < 1024;
  const isMobileUA = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(ua);
  return (isMobileUA || isTouchOnly) && isNarrow;
}

function MobileBlock() {
  return (
    <div style={{
      minHeight: '100dvh',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
    }}>
      <p style={{ fontSize: '1rem', color: '#9ca3af', maxWidth: '22rem', lineHeight: 1.6 }}>
        Hele, kámo, tohle tě má naučit psát na klávesnici. Takže si ten telefon strč do kapsy a vrať se, až budeš u kompu.
      </p>
    </div>
  );
}

export default function App() {
  if (isMobileDevice()) return <MobileBlock />;

  const { playCorrect, playWrong } = useSound();
  const { user, profile, loading: authLoading, needsProfile, signInWithGoogle, signOutUser, saveProfile } = useAuth();
  const { entries: leaderboardEntries, loading: leaderboardLoading, updateLeaderboard, refresh: refreshLeaderboard } = useLeaderboard();

  const { syncToFirestore } = useFirestoreProgress(user?.uid ?? null);

  const handleProgressSave = useCallback((p: typeof progress) => {
    if (!profile) return;
    const allLessons = getAllLessons();
    const completedLessons = allLessons.filter(l => p.lessons[l.id]?.completed).length;
    const allCpms = allLessons.map(l => p.lessons[l.id]?.bestCpm ?? 0).filter(c => c > 0);
    const avgCpm = allCpms.length > 0 ? Math.round(allCpms.reduce((a, b) => a + b, 0) / allCpms.length) : 0;
    const allAccs = allLessons.map(l => p.lessons[l.id]?.bestAccuracy ?? 0).filter(a => a > 0);
    const avgAccuracy = allAccs.length > 0 ? Math.round(allAccs.reduce((a, b) => a + b, 0) / allAccs.length) : 0;
    const totalExercises = allLessons.reduce((sum, l) => sum + (p.lessons[l.id]?.completedExercises.length ?? 0), 0);
    const totalTime = allLessons.reduce((sum, l) => {
      const scores = p.lessons[l.id]?.exerciseScores ?? {};
      return sum + Object.values(scores).reduce((s, sc) => s + sc.timeSeconds, 0);
    }, 0);
    const score = completedLessons * 100 + avgAccuracy * 10 + avgCpm;

    syncToFirestore(p);
    updateLeaderboard({
      uid: profile.uid,
      displayName: profile.displayName,
      avatarBase64: profile.avatarBase64,
      completedLessons,
      totalExercises,
      avgAccuracy,
      avgCpm,
      totalTime,
      score,
    });
  }, [profile, syncToFirestore, updateLeaderboard]);

  const { progress, completeExercise, completeLesson } = useProgress(
    profile ? handleProgressSave : undefined
  );

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

  const processedResultRef = useRef<ExerciseResult | null>(null);

  useEffect(() => {
    if (exerciseResult && exerciseResult !== processedResultRef.current && screen === 'exercise') {
      processedResultRef.current = exerciseResult;
      setLastResult(exerciseResult);
      completeExercise(currentLessonId, currentExerciseId, exerciseResult.cpm, exerciseResult.accuracy, currentLesson?.exercises.length ?? 1, exerciseResult.errors, exerciseResult.timeSeconds);
      setScreen('results');
    }
  }, [exerciseResult, screen, currentLessonId, currentExerciseId, completeExercise]);

  const onKey = useCallback((key: string) => {
    handleKey(key, playCorrect, playWrong);
  }, [handleKey, playCorrect, playWrong]);

  const handleSelectExercise = useCallback((exerciseIndex: number) => {
    const lesson = getLessonById(currentLessonId);
    const text = lesson?.exercises[exerciseIndex]?.text ?? '';
    setCurrentExerciseIndex(exerciseIndex);
    processedResultRef.current = null;
    resetExercise(text);
    const mode = lesson ? getExerciseMode(lesson, exerciseIndex) : 'classic';
    setScreen(mode === 'falling' ? 'falling' : 'exercise');
  }, [currentLessonId, resetExercise]);

  const handleNext = useCallback(() => {
    if (!currentLesson) return;
    const nextIdx = currentExerciseIndex + 1;
    if (nextIdx < currentLesson.exercises.length) {
      const nextText = currentLesson.exercises[nextIdx].text;
      setCurrentExerciseIndex(nextIdx);
      processedResultRef.current = null;
      resetExercise(nextText);
      const mode = getExerciseMode(currentLesson, nextIdx);
      setScreen(mode === 'falling' ? 'falling' : 'exercise');
    } else {
      const nextLessonId = getNextLessonId(currentLessonId);
      completeLesson(currentLessonId, nextLessonId);
      setScreen('dashboard');
    }
  }, [currentLesson, currentExerciseIndex, currentLessonId, resetExercise, completeLesson]);

  const handleRestart = useCallback(() => {
    processedResultRef.current = null;
    resetExercise(currentExerciseText);
    const mode = currentLesson ? getExerciseMode(currentLesson, currentExerciseIndex) : 'classic';
    setScreen(mode === 'falling' ? 'falling' : 'exercise');
  }, [currentExerciseText, resetExercise, currentLesson, currentExerciseIndex]);

  const handleRestartAll = useCallback(() => {
    if (!currentLesson) return;
    const firstText = currentLesson.exercises[0]?.text ?? '';
    setCurrentExerciseIndex(0);
    processedResultRef.current = null;
    resetExercise(firstText);
    const mode = getExerciseMode(currentLesson, 0);
    setScreen(mode === 'falling' ? 'falling' : 'exercise');
  }, [currentLesson, resetExercise]);

  const handleSelectLesson = useCallback((lessonId: string) => {
    setCurrentLessonId(lessonId);
    setCurrentExerciseIndex(0);
    setScreen('lesson-menu');
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="text-sm" style={{ color: '#6b7280' }}>Načítání…</div>
      </div>
    );
  }

  const leaderboardNode = (
    <Leaderboard
      entries={leaderboardEntries}
      loading={leaderboardLoading}
      currentUid={user?.uid ?? null}
      onRefresh={refreshLeaderboard}
    />
  );

  if (!user) {
    return (
      <LoginScreen
        onSignIn={signInWithGoogle}
        leaderboardSection={leaderboardNode}
      />
    );
  }

  if (user && needsProfile) {
    return (
      <ProfileSetup
        googleDisplayName={user.displayName}
        googleAvatar={user.photoURL}
        onSave={saveProfile}
      />
    );
  }

  if (screen === 'falling') {
    return (
      <FallingLettersMode
        text={currentExerciseText}
        lessonTitle={currentLesson?.title ?? ''}
        playCorrect={playCorrect}
        playWrong={playWrong}
        onBack={() => setScreen('lesson-menu')}
        onComplete={(stats) => {
          const total = stats.correct + stats.errors;
          const result: ExerciseResult = {
            cpm: stats.timeSeconds > 0 ? Math.round((stats.correct / stats.timeSeconds) * 60) : 0,
            accuracy: total > 0 ? Math.round((stats.correct / total) * 100) : 100,
            errors: stats.errors,
            timeSeconds: stats.timeSeconds,
          };
          setLastResult(result);
          completeExercise(currentLessonId, currentExerciseId, result.cpm, result.accuracy, currentLesson?.exercises.length ?? 1, result.errors, result.timeSeconds);
          setScreen('results');
        }}
      />
    );
  }

  if (screen === 'dashboard') {
    return (
      <Dashboard
        progress={progress}
        onSelectLesson={handleSelectLesson}
        profile={profile}
        onSignIn={!user ? signInWithGoogle : undefined}
        onSignOut={user ? signOutUser : undefined}
        leaderboardSection={leaderboardNode}
      />
    );
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
