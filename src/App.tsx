import { useState, useCallback, useEffect, useRef } from 'react';
import { useSound } from './hooks/useSound';
import { useProgress } from './hooks/useProgress';
import { useExercise } from './hooks/useExercise';
import { useAuth } from './hooks/useAuth';
import { useFirestoreProgress } from './hooks/useFirestoreProgress';
import { useLeaderboard } from './hooks/useLeaderboard';
import { getLessonById, getNextLessonId, getAllLessons } from './data/lessons';
import Dashboard from './components/Dashboard';
import LessonMenu from './components/LessonMenu';
import ExerciseScreen from './components/ExerciseScreen';
import ResultsScreen from './components/ResultsScreen';
import LoginScreen from './components/LoginScreen';
import ProfileSetup from './components/ProfileSetup';
import Leaderboard from './components/Leaderboard';
import FallingLettersMode from './components/FallingLettersMode';
import type { ExerciseResult } from './types';

type Screen = 'dashboard' | 'lesson-menu' | 'exercise' | 'results' | 'falling-test';

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

  // Track whether user explicitly chose to skip login


  const { syncToFirestore } = useFirestoreProgress(user?.uid ?? null);

  // Compute leaderboard score and push update when progress changes
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

  // Auth loading spinner
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a' }}>
        <div className="text-sm" style={{ color: '#6b7280' }}>Načítání…</div>
      </div>
    );
  }

  // Leaderboard node reused in multiple screens
  const leaderboardNode = (
    <Leaderboard
      entries={leaderboardEntries}
      loading={leaderboardLoading}
      currentUid={user?.uid ?? null}
      onRefresh={refreshLeaderboard}
    />
  );

  // Not logged in → show login screen (no skip allowed)
  if (!user) {
    return (
      <LoginScreen
        onSignIn={signInWithGoogle}
        leaderboardSection={leaderboardNode}
      />
    );
  }

  // Logged in but needs to set up profile
  if (user && needsProfile) {
    return (
      <ProfileSetup
        googleDisplayName={user.displayName}
        googleAvatar={user.photoURL}
        onSave={saveProfile}
      />
    );
  }

  if (screen === 'falling-test') {
    const lesson11 = getLessonById('1.1');
    const testText = lesson11?.exercises[0]?.text ?? 'f j f j f j f j f j';
    return (
      <FallingLettersMode
        text={testText}
        lessonTitle="F a J (1.1)"
        onBack={() => setScreen('dashboard')}
        onComplete={() => setScreen('dashboard')}
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
        onTestFalling={() => setScreen('falling-test')}
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
