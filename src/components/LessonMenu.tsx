import type { Lesson, UserProgress } from '../types';
import { formatTime, getMedal } from '../utils/stats';

interface LessonMenuProps {
  lesson: Lesson;
  progress: UserProgress;
  onSelectExercise: (exerciseIndex: number) => void;
  onBack: () => void;
}

export default function LessonMenu({ lesson, progress, onSelectExercise, onBack }: LessonMenuProps) {
  const lessonProg = progress.lessons[lesson.id];
  const completedExercises = lessonProg?.completedExercises ?? [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      <div style={{ backgroundColor: '#222222', borderBottom: '1px solid #333' }} className="px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-sm px-3 py-1 rounded-lg transition-all"
          style={{ backgroundColor: '#333', color: '#9ca3af' }}
        >
          ← Zpět
        </button>
        <div>
          <h1 className="font-bold" style={{ color: '#8b5cf6' }}>Lekce {lesson.id} — {lesson.title}</h1>
          {lesson.newLetters.length > 0 && (
            <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>
              Nová písmena: {lesson.newLetters.map(l => l.toUpperCase()).join(', ')}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6">
        <div className="mb-3 text-sm" style={{ color: '#6b7280' }}>
          Splněno: {completedExercises.length}/{lesson.exercises.length}
        </div>
        <div className="flex flex-col gap-2">
          {lesson.exercises.map((ex, idx) => {
            const done = completedExercises.includes(ex.id);
            const score = lessonProg?.exerciseScores?.[ex.id];
            const medal = score ? getMedal(score) : null;

            return (
              <button
                key={ex.id}
                onClick={() => onSelectExercise(idx)}
                className="w-full text-left rounded-xl px-4 py-3 transition-all duration-150"
                style={{
                  backgroundColor: '#242424',
                  border: done ? '1px solid #22c55e44' : '1px solid #333',
                  cursor: 'pointer',
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-mono shrink-0" style={{ color: '#e5e7eb' }}>
                    {ex.text.slice(0, 24)}{ex.text.length > 24 ? '…' : ''}
                  </span>
                  <div className="flex items-center gap-4">
                    {score ? (
                      <>
                        <span className="text-xs font-mono" style={{ color: '#8b5cf6' }}>⚡ {score.cpm} ZPM</span>
                        <span className="text-xs font-mono" style={{ color: score.accuracy >= 95 ? '#22c55e' : score.accuracy >= 80 ? '#eab308' : '#ef4444' }}>🎯 {score.accuracy}%</span>
                        <span className="text-xs font-mono" style={{ color: score.errors === 0 ? '#22c55e' : '#ef4444' }}>✕ {score.errors}</span>
                        <span className="text-xs font-mono" style={{ color: '#06b6d4' }}>⏱ {formatTime(score.timeSeconds)}</span>
                        {medal && <span style={{ fontSize: '1.35rem' }}>{medal}</span>}
                      </>
                    ) : (
                      <span className="text-xs" style={{ color: '#4b5563' }}>—</span>
                    )}
                    {done && <span style={{ color: '#22c55e' }}>✓</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
