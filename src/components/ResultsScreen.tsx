import { useEffect } from 'react';
import type { ExerciseResult } from '../types';
import { formatTime } from '../utils/stats';

interface ResultsScreenProps {
  result: ExerciseResult;
  exerciseIndex: number;
  totalExercises: number;
  lessonId: string;
  lessonTitle: string;
  onNext: () => void;
  onRestart: () => void;
  onRestartAll: () => void;
  onBack: () => void;
}

export default function ResultsScreen({
  result,
  exerciseIndex,
  totalExercises,
  lessonId,
  lessonTitle,
  onNext,
  onRestart,
  onRestartAll,
  onBack,
}: ResultsScreenProps) {
  const isLastExercise = exerciseIndex >= totalExercises - 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        if (!isLastExercise) {
          onNext();
        } else {
          onRestart();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isLastExercise, onNext, onRestart]);

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy >= 95) return '#22c55e';
    if (accuracy >= 80) return '#eab308';
    return '#ef4444';
  };

  const getCpmRating = (cpm: number): string => {
    if (cpm >= 200) return 'Výborně!';
    if (cpm >= 150) return 'Skvěle!';
    if (cpm >= 100) return 'Dobře!';
    if (cpm >= 60) return 'Slušně';
    return 'Trénuj dál';
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
    >
      <div
        className="rounded-xl w-full text-center"
        style={{ backgroundColor: '#242424', border: '1px solid #3a3a3a', maxWidth: '22rem', padding: '1.25rem' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>
            {result.accuracy >= 95 ? '🎯' : result.accuracy >= 80 ? '👍' : '💪'}
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.2rem' }}>
            Cvičení dokončeno!
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.55rem' }}>
            Lekce {lessonId} — {lessonTitle} — Cvičení {exerciseIndex + 1}/{totalExercises}
          </p>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '0.6rem', padding: '0.5rem 0.4rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', color: '#8b5cf6' }}>
              {result.cpm}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.5rem', marginTop: '0.1rem' }}>CPM</div>
            <div style={{ fontSize: '0.5rem', color: '#8b5cf6', marginTop: '0.1rem' }}>
              {getCpmRating(result.cpm)}
            </div>
          </div>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '0.6rem', padding: '0.5rem 0.4rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', color: getAccuracyColor(result.accuracy) }}>
              {result.accuracy}%
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.5rem', marginTop: '0.1rem' }}>Přesnost</div>
          </div>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '0.6rem', padding: '0.5rem 0.4rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', color: result.errors === 0 ? '#22c55e' : '#ef4444' }}>
              {result.errors}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.5rem', marginTop: '0.1rem' }}>Chyby</div>
          </div>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '0.6rem', padding: '0.5rem 0.4rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', color: '#06b6d4' }}>
              {formatTime(result.timeSeconds)}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.5rem', marginTop: '0.1rem' }}>Čas</div>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {!isLastExercise && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.15rem' }}>
              <button
                onClick={onNext}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '0.6rem', fontWeight: 600, fontSize: '0.7rem', color: '#fff', backgroundColor: '#8b5cf6', border: 'none' }}
              >
                Další cvičení →
              </button>
              <span style={{ color: '#6b7280', fontSize: '0.5rem' }}>nebo stiskni mezerník</span>
            </div>
          )}

          {isLastExercise && (
            <div style={{ padding: '0.4rem', borderRadius: '0.6rem', fontSize: '0.6rem', marginBottom: '0.2rem', backgroundColor: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e55' }}>
              Gratulujeme! Dokončil jsi všechna cvičení lekce {lessonId}!
            </div>
          )}

          <button
            onClick={onRestart}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '0.6rem', fontWeight: 600, fontSize: '0.7rem', backgroundColor: 'transparent', border: '1px solid #4b5563', color: '#d1d5db' }}
          >
            Zopakovat cvičení
          </button>

          <button
            onClick={onRestartAll}
            style={{ width: '100%', padding: '0.35rem', borderRadius: '0.6rem', fontSize: '0.6rem', color: '#6b7280', backgroundColor: 'transparent', border: 'none' }}
          >
            Začít lekci od začátku
          </button>

          <button
            onClick={onBack}
            style={{ width: '100%', padding: '0.35rem', borderRadius: '0.6rem', fontSize: '0.6rem', color: '#6b7280', backgroundColor: 'transparent', border: 'none' }}
          >
            ← Zpět na seznam cvičení
          </button>
        </div>
      </div>
    </div>
  );
}
