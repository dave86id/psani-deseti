import { useEffect, useRef, useState } from 'react';
import type { ExerciseState } from '../types';
import VirtualKeyboard from './VirtualKeyboard';
import ProgressBar from './ProgressBar';
import { playKeyAudio } from '../hooks/useSound';

// On macOS, pressing Shift+dead_key, Shift+letter does NOT produce a composed
// character in keydown events — the browser sends the raw letter (e.g. 'C' not 'Č').
// This function manually composes letter + diacritic using Unicode NFC normalization.
// Czech QWERTZ Mac: both dead keys use the same Equal key, distinguished by shiftKey:
//   Equal + shiftKey:true  → háček (caron ˇ)  → combining caron  U+030C
//   Equal + shiftKey:false → čárka (acute ´) → combining acute  U+0301
function composeDeadKey(deadCode: string, deadShift: boolean, letter: string): string | null {
  // Determine the primary combining diacritic from the dead key
  let primary: string | null = null;
  if (deadCode === 'Equal') {
    primary = deadShift ? '\u030C' : '\u0301'; // caron (háček) or acute (čárka)
  }
  // Try primary first, then the other one as fallback for unknown dead keys
  const order = primary
    ? [primary, primary === '\u030C' ? '\u0301' : '\u030C']
    : ['\u0301', '\u030C'];

  for (const combining of order) {
    const composed = (letter + combining).normalize('NFC');
    if (composed.length === 1 && composed !== letter) return composed;
  }
  return null;
}

interface ExerciseScreenProps {
  state: ExerciseState;
  exerciseIndex: number;
  totalExercises: number;
  lessonId: string;
  lessonTitle: string;
  flashCorrect: boolean;
  wrongKeyFlash: string | null;
  onKey: (key: string) => void;
  onDeadKey: (isShift: boolean) => void;
  onBack: () => void;
  isErrorPractice?: boolean;
  pendingDeadKey: string | null;
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
          width: '1.4rem',
          height: '1.2em',
          backgroundColor: bgColor,
          borderRadius: '2px',
          verticalAlign: 'middle',
          margin: '0',
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
        padding: '0',
        transition: 'all 0.1s',
        fontFamily: 'monospace',
        display: 'inline-block',
        minWidth: '1.4rem',
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
  onDeadKey,
  onBack,
  isErrorPractice,
  pendingDeadKey,
}: ExerciseScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  // Track pending dead key code for manual composition of uppercase diacritics.
  // macOS does not compose uppercase diacritics when Shift is held throughout the
  // dead key sequence — browser sends raw 'C' instead of composed 'Č'.
  const pendingDeadRef = useRef<{ code: string; shiftKey: boolean } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.add(e.key);
        return next;
      });

      if (['Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Shift'].includes(e.key)) {
        return;
      }

      if (e.key === 'Dead') {
        // Store dead key info so we can manually compose uppercase diacritics.
        pendingDeadRef.current = { code: e.code, shiftKey: e.shiftKey };
        onDeadKey(e.shiftKey);
        return;
      }

      if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Enter') {
        e.preventDefault();
        playKeyAudio(); // Instant acoustic feedback
        let actualKey = e.key;
        // macOS doesn't compose uppercase diacritics when Shift is held: browsers
        // send plain 'C' instead of 'Č'. Manually compose using Unicode NFC.
        if (pendingDeadRef.current && e.key.length === 1) {
          const composed = composeDeadKey(pendingDeadRef.current.code, pendingDeadRef.current.shiftKey, e.key);
          if (composed) actualKey = composed;
        }
        pendingDeadRef.current = null;
        onKey(actualKey);
      }
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
  }, [onKey, onDeadKey]);

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
        className="w-full max-w-3xl rounded-xl mb-6 relative"
        style={{
          backgroundColor: '#2a2a2a',
          border: '1px solid #3a3a3a',
          padding: '0.75rem 0',
          height: '5rem',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          className="flex items-center"
          style={{
            fontFamily: 'monospace',
            fontSize: '1.4rem',
            transition: 'transform 0.15s ease-out',
            transform: (() => {
              // Each char is 1.4rem wide. Container is max-w-3xl (~48rem).
              // Center is at ~24rem from left edge. Threshold: 24rem / 1.4rem ≈ 17 chars.
              const charWidthRem = 1.4;
              const centerOffsetRem = 22; // approx half of visible area
              const currentOffsetRem = state.currentIndex * charWidthRem + charWidthRem / 2;
              const shift = Math.max(0, currentOffsetRem - centerOffsetRem);
              return `translateX(-${shift}rem)`;
            })(),
            whiteSpace: 'nowrap',
            paddingLeft: '1rem',
          }}
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
        {/* Cursor indicator */}
        <div 
          style={{
            position: 'absolute',
            left: '50%',
            top: '0.75rem',
            bottom: '0.75rem',
            width: '2px',
            backgroundColor: '#8b5cf6',
            opacity: 0.3,
            pointerEvents: 'none',
            transform: 'translateX(-50%)'
          }}
        />
      </div>

      {state.status === 'idle' && (
        <div className="mb-4 text-sm text-gray-400 animate-pulse">
          Začni psát pro spuštění cvičení...
        </div>
      )}

      <div className="w-full max-w-3xl flex justify-center">
        <VirtualKeyboard 
          activeKey={activeKey} 
          wrongKeyFlash={wrongKeyFlash} 
          pressedKeys={pressedKeys}
          pendingDeadKey={pendingDeadKey}
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
