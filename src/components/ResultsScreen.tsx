import { useEffect } from 'react';
import type { ExerciseResult, ExerciseScore } from '../types';
import { formatTime } from '../utils/stats';

interface ResultsScreenProps {
  result: ExerciseResult;
  exerciseIndex: number;
  totalExercises: number;
  lessonId: string;
  lessonTitle: string;
  isErrorPractice?: boolean;
  previousScore?: ExerciseScore | null;
  onNext: () => void;
  onRestart: () => void;
  onBack: () => void;
}

// Zelená = zlepšení, žlutá = beze změny, červená = zhoršení.
function trendColor(improvedBy: number) {
  return improvedBy > 0 ? '#22c55e' : improvedBy < 0 ? '#ef4444' : '#eab308';
}

function Trend({ improvedBy }: { improvedBy: number }) {
  const mark = improvedBy > 0 ? '↑' : improvedBy < 0 ? '↓' : '–';
  return <span style={{ fontSize: '0.9rem', marginLeft: '0.15rem', color: trendColor(improvedBy) }}>{mark}</span>;
}

function LastTime({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.5rem', color: '#6b7280', marginTop: '0.2rem' }}>{children}</div>;
}

function chybyLabel(n: number) {
  if (n === 1) return '1 chyba';
  if (n >= 2 && n <= 4) return `${n} chyby`;
  return `${n} chyb`;
}

export default function ResultsScreen({
  result,
  exerciseIndex,
  totalExercises,
  lessonId,
  lessonTitle,
  isErrorPractice,
  previousScore,
  onNext,
  onRestart,
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

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
    >
      <div
        className="rounded-xl w-full text-center"
        style={{ backgroundColor: '#242424', border: '1px solid #3a3a3a', maxWidth: '32rem', padding: '1.25rem' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>
            {result.accuracy >= 95 ? '🎯' : result.accuracy >= 80 ? '👍' : '💪'}
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
            Cvičení dokončeno!
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.55rem' }}>
            {isErrorPractice ? 'Speciální cvičení: Procvičování chyb' : `Lekce ${lessonId} — ${lessonTitle} — Cvičení ${exerciseIndex + 1}/${totalExercises}`}
          </p>
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '0.6rem', padding: '0.5rem 0.4rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', color: previousScore ? trendColor(result.cpm - previousScore.cpm) : '#d1d5db' }}>
              {result.cpm}
              {previousScore && <Trend improvedBy={result.cpm - previousScore.cpm} />}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.5rem', marginTop: '0.1rem' }}>CPM</div>
            {previousScore && <LastTime>minule {previousScore.cpm} CPM</LastTime>}
          </div>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '0.6rem', padding: '0.5rem 0.4rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', color: previousScore ? trendColor(result.accuracy - previousScore.accuracy) : getAccuracyColor(result.accuracy) }}>
              {result.accuracy}%
              {previousScore && <Trend improvedBy={result.accuracy - previousScore.accuracy} />}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.5rem', marginTop: '0.1rem' }}>Přesnost</div>
            {previousScore && <LastTime>minule {previousScore.accuracy} %</LastTime>}
          </div>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '0.6rem', padding: '0.5rem 0.4rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', color: previousScore ? trendColor(previousScore.errors - result.errors) : (result.errors === 0 ? '#22c55e' : '#ef4444') }}>
              {result.errors}
              {previousScore && <Trend improvedBy={previousScore.errors - result.errors} />}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.5rem', marginTop: '0.1rem' }}>Chyby</div>
            {previousScore && <LastTime>minule {chybyLabel(previousScore.errors)}</LastTime>}
          </div>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '0.6rem', padding: '0.5rem 0.4rem' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'monospace', color: previousScore ? trendColor(previousScore.timeSeconds - result.timeSeconds) : '#06b6d4' }}>
              {formatTime(result.timeSeconds)}
              {previousScore && <Trend improvedBy={previousScore.timeSeconds - result.timeSeconds} />}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.5rem', marginTop: '0.1rem' }}>Čas</div>
            {previousScore && <LastTime>minule {formatTime(previousScore.timeSeconds)}</LastTime>}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {isLastExercise && (
            <div style={{ padding: '0.4rem', borderRadius: '0.6rem', fontSize: '0.6rem', marginBottom: '0.2rem', backgroundColor: '#22c55e22', color: '#22c55e', border: '1px solid #22c55e55' }}>
              Gratulujeme! Dokončil jsi všechna cvičení lekce {lessonId}!
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {!isLastExercise && (
              <button
                onClick={onNext}
                style={{ flex: 1, padding: '0.5rem', borderRadius: '0.6rem', fontWeight: 600, fontSize: '0.7rem', color: '#fff', backgroundColor: '#4b5563', border: 'none' }}
              >
                Další cvičení →
              </button>
            )}
            <button
              onClick={onRestart}
              style={{ flex: 1, padding: '0.5rem', borderRadius: '0.6rem', fontWeight: 600, fontSize: '0.7rem', backgroundColor: 'transparent', border: '1px solid #4b5563', color: '#d1d5db' }}
            >
              Zopakovat cvičení
            </button>
          </div>

          {!isLastExercise && (
            <span style={{ color: '#6b7280', fontSize: '0.5rem' }}>nebo stiskni mezerník</span>
          )}

          <button
            onClick={onBack}
            style={{ width: '100%', padding: '0.35rem', borderRadius: '0.6rem', fontSize: '0.6rem', color: '#6b7280', backgroundColor: 'transparent', border: 'none' }}
          >
            ← Zpět na seznam lekcí
          </button>
        </div>
      </div>
    </div>
  );
}
