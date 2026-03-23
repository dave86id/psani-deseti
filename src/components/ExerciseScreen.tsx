import { useEffect, useRef, useState } from 'react';
import type { ExerciseState } from '../types';
import VirtualKeyboard from './VirtualKeyboard';
import ProgressBar from './ProgressBar';

interface ExerciseScreenProps {
  state: ExerciseState;
  exerciseIndex: number;
  totalExercises: number;
  lessonId: string;
  lessonTitle: string;
  flashCorrect: boolean;
  wrongKeyFlash: string | null;
  onKey: (key: string) => void;
  onBack: () => void;
  playCorrect: () => void;
  playWrong: () => void;
  isErrorPractice?: boolean;
}

function CharDisplay({
  char,
  index,
  currentIndex,
  errors,
  flashCorrect,
}: {
  char: string;
  index: number;
  currentIndex: number;
  errors: Set<number>;
  flashCorrect: boolean;
}) {
  const isCurrent = index === currentIndex;
  const isTyped = index < currentIndex;
  const hasError = errors.has(index);

  let bgColor = 'transparent';
  let textColor = '#9ca3af';

  if (isCurrent) {
    bgColor = '#7c3aed';
    textColor = '#ffffff';
  } else if (isTyped) {
    if (hasError) {
      textColor = '#ef4444';
    } else if (flashCorrect) {
      bgColor = '#16a34a';
      textColor = '#ffffff';
    } else {
      textColor = '#6b7280';
    }
  } else {
    textColor = '#e5e7eb';
  }

  if (char === ' ') {
    return (
      <span
        style={{
          display: 'inline-block',
          width: isCurrent ? '0.6em' : '0.5em',
          height: '1.2em',
          backgroundColor: bgColor,
          borderRadius: '2px',
          verticalAlign: 'middle',
          margin: '0 1px',
          transition: 'background-color 0.1s',
        }}
      />
    );
  }

  return (
    <span
      style={{
        color: textColor,
        backgroundColor: bgColor,
        borderRadius: '3px',
        padding: isCurrent ? '0 2px' : '0 1px',
        transition: 'all 0.1s',
        fontFamily: 'monospace',
        display: 'inline-block',
        minWidth: '0.6em',
        textAlign: 'center',
      }}
    >
      {char}
    </span>
  );
}

export default function ExerciseScreen({
  state,
  exerciseIndex,
  totalExercises,
  lessonId,
  lessonTitle,
  flashCorrect,
  wrongKeyFlash,
  onKey,
  onBack,
  isErrorPractice,
}: ExerciseScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add(e.key);
        return next;
      });

      if (
        ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Dead'].includes(e.key)
      ) {
        return;
      }

      e.preventDefault();
      onKey(e.key);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key);
        return next;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [onKey]);

  const activeKey = state.text[state.currentIndex] ?? '';
  const chars = state.text.split('');

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 py-8"
      style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
      ref={containerRef}
    >
      <div className="w-full max-w-3xl mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="text-sm px-3 py-1 rounded-lg transition-all"
              style={{ backgroundColor: '#333', color: '#9ca3af' }}
            >
              ← Zpět
            </button>
            <h1 className="text-xl font-bold tracking-wide" style={{ color: '#8b5cf6' }}>
              psaní deseti
            </h1>
          </div>
          <span className="text-sm text-gray-400">
            {isErrorPractice 
              ? <span style={{ color: '#a78bfa', fontWeight: 700 }}>Procvičování chyb</span>
              : `Lekce ${lessonId} — ${lessonTitle} — Cvičení ${exerciseIndex + 1}/${totalExercises}`
            }
          </span>
        </div>
        <ProgressBar current={state.currentIndex} total={state.text.length} />
      </div>

      <div
        className="w-full max-w-3xl rounded-xl mb-6"
        style={{
          backgroundColor: '#2a2a2a',
          border: '1px solid #3a3a3a',
          padding: '0.75rem 1.5rem',
          height: '6rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          className="leading-relaxed flex flex-wrap justify-center items-center gap-y-1"
          style={{ fontFamily: 'monospace', letterSpacing: '0.05em', fontSize: '1.4rem' }}
        >
          {chars.map((char, i) => (
            <CharDisplay
              key={i}
              char={char}
              index={i}
              currentIndex={state.currentIndex}
              errors={state.errors}
              flashCorrect={flashCorrect && i === state.currentIndex - 1}
            />
          ))}
        </div>
      </div>

      {!state.startTime && (
        <div className="mb-4 text-sm text-gray-400 animate-pulse">
          Začni psát pro spuštění cvičení...
        </div>
      )}

      <div className="w-full max-w-3xl flex justify-center">
        <VirtualKeyboard 
          activeKey={activeKey} 
          wrongKeyFlash={wrongKeyFlash} 
          pressedKeys={pressedKeys}
        />
      </div>

      <div className="mt-4 flex gap-4 text-xs text-gray-500">
        <span><span style={{ color: '#8b5cf6' }}>■</span> Aktuální znak</span>
        <span><span style={{ color: '#22c55e' }}>■</span> Správně</span>
        <span><span style={{ color: '#ef4444' }}>■</span> Chyba</span>
      </div>
    </div>
  );
}
