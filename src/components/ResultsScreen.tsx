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
        className="rounded-2xl p-8 w-full max-w-md text-center"
        style={{ backgroundColor: '#242424', border: '1px solid #3a3a3a' }}
      >
        {/* Header */}
        <div className="mb-6">
          <div className="text-5xl mb-2">
            {result.accuracy >= 95 ? '🎯' : result.accuracy >= 80 ? '👍' : '💪'}
          </div>
          <h2
            className="text-2xl font-bold mb-1"
            style={{ color: '#8b5cf6' }}
          >
            Cvičení dokončeno!
          </h2>
          <p className="text-gray-400 text-sm">
            Lekce {lessonId} — {lessonTitle} — Cvičení {exerciseIndex + 1}/{totalExercises}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            <div
              className="text-3xl font-bold font-mono"
              style={{ color: '#8b5cf6' }}
            >
              {result.cpm}
            </div>
            <div className="text-gray-400 text-sm mt-1">CPM</div>
            <div className="text-xs mt-1" style={{ color: '#8b5cf6' }}>
              {getCpmRating(result.cpm)}
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            <div
              className="text-3xl font-bold font-mono"
              style={{ color: getAccuracyColor(result.accuracy) }}
            >
              {result.accuracy}%
            </div>
            <div className="text-gray-400 text-sm mt-1">Přesnost</div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            <div
              className="text-3xl font-bold font-mono"
              style={{ color: result.errors === 0 ? '#22c55e' : '#ef4444' }}
            >
              {result.errors}
            </div>
            <div className="text-gray-400 text-sm mt-1">Chyby</div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: '#2a2a2a' }}
          >
            <div
              className="text-3xl font-bold font-mono"
              style={{ color: '#06b6d4' }}
            >
              {formatTime(result.timeSeconds)}
            </div>
            <div className="text-gray-400 text-sm mt-1">Čas</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          {!isLastExercise && (
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={onNext}
                className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: '#8b5cf6' }}
              >
                Další cvičení →
              </button>
              <span style={{ color: '#6b7280', fontSize: '0.65rem' }}>nebo stiskni mezerník</span>
            </div>
          )}

          {isLastExercise && (
            <div
              className="py-3 px-4 rounded-xl text-sm mb-2"
              style={{ backgroundColor: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e55' }}
            >
              Gratulujeme! Dokončil jsi všechna cvičení lekce {lessonId}!
            </div>
          )}

          <button
            onClick={onRestart}
            className="w-full py-3 rounded-xl font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #4b5563',
              color: '#d1d5db',
            }}
          >
            Zopakovat cvičení
          </button>

          <button
            onClick={onRestartAll}
            className="w-full py-2 rounded-xl text-sm transition-all duration-200 hover:opacity-90"
            style={{ color: '#6b7280' }}
          >
            Začít lekci od začátku
          </button>

          <button
            onClick={onBack}
            className="w-full py-2 rounded-xl text-sm transition-all duration-200 hover:opacity-90"
            style={{ color: '#6b7280' }}
          >
            ← Zpět na seznam cvičení
          </button>
        </div>
      </div>
    </div>
  );
}
