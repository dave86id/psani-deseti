import { useState, useEffect, useRef, useMemo } from 'react';
import VirtualKeyboard from './VirtualKeyboard';
import { fingerColors, keyFingerMap } from '../data/fingerMapping';

interface FallingLettersModeProps {
  text: string;
  lessonTitle: string;
  playCorrect: () => void;
  playWrong: () => void;
  onComplete: (stats: { correct: number; errors: number; timeSeconds: number }) => void;
  onBack: () => void;
}

const VISIBLE_ROWS = 5;
const ROW_HEIGHT = 72; // px

interface KeyMetrics { x: number; width: number; }

export default function FallingLettersMode({ text, lessonTitle, playCorrect, playWrong, onComplete, onBack }: FallingLettersModeProps) {
  const chars = useMemo(() => text.split(''), [text]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime] = useState(() => Date.now());
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);
  const [exitingItem, setExitingItem] = useState<{ char: string; x: number | null; w: number } | null>(null);
  const [keyMetrics, setKeyMetrics] = useState<Record<string, KeyMetrics>>({});

  const kbRef = useRef<HTMLDivElement>(null);
  const lettersAreaRef = useRef<HTMLDivElement>(null);

  // Measure key center X + width, relative to the letters area container
  useEffect(() => {
    const measure = () => {
      if (!kbRef.current || !lettersAreaRef.current) return;
      const containerLeft = lettersAreaRef.current.getBoundingClientRect().left;
      const map: Record<string, KeyMetrics> = {};
      kbRef.current.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key')!;
        const rect = el.getBoundingClientRect();
        map[key] = { x: rect.left + rect.width / 2 - containerLeft, width: rect.width };
      });
      setKeyMetrics(map);
    };
    const t = setTimeout(measure, 100);
    window.addEventListener('resize', measure);
    return () => { clearTimeout(t); window.removeEventListener('resize', measure); };
  }, []);

  // Build visible queue: slot 0 = top (future), slot VISIBLE_ROWS-1 = bottom (active)
  const queueItems = useMemo(() => {
    const items: Array<{ slot: number; textIndex: number; char: string; isNew: boolean }> = [];
    for (let slot = 0; slot < VISIBLE_ROWS; slot++) {
      const ti = currentIndex + (VISIBLE_ROWS - 1 - slot);
      if (ti >= 0 && ti < chars.length) {
        items.push({ slot, textIndex: ti, char: chars[ti], isNew: slot === 0 && currentIndex > 0 });
      }
    }
    return items;
  }, [currentIndex, chars]);

  const activeChar = currentIndex < chars.length ? chars[currentIndex] : null;
  const isFinished = currentIndex >= chars.length;

  // Keydown handler
  useEffect(() => {
    if (isFinished) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onBack(); return; }
      if (['Shift', 'Control', 'Alt', 'Dead', 'Meta', 'Tab', 'CapsLock'].includes(e.key)) return;
      e.preventDefault();

      const expected = chars[currentIndex];
      if (e.key === expected) {
        playCorrect();
        const m = keyMetrics[expected];
        setExitingItem({ char: expected, x: m?.x ?? null, w: m?.width ?? 48 });
        setTimeout(() => setExitingItem(null), 250);

        const next = currentIndex + 1;
        setCurrentIndex(next);

        if (next >= chars.length) {
          const elapsed = (Date.now() - startTime) / 1000;
          setTimeout(() => onComplete({ correct: chars.length, errors, timeSeconds: elapsed }), 300);
        }
      } else {
        playWrong();
        setErrors(prev => prev + 1);
        setWrongFlash(e.key);
        setTimeout(() => setWrongFlash(null), 300);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIndex, isFinished, chars, errors, startTime, onBack, onComplete, keyMetrics, playCorrect, playWrong]);

  const activeColor = activeChar && keyFingerMap[activeChar] ? fingerColors[keyFingerMap[activeChar]] : '#8b5cf6';
  const activeMetrics = activeChar ? (keyMetrics[activeChar] ?? null) : null;

  // Line extends from bottom of active slot into keyboard area (approx 80px to reach key center)
  const lineTop = (VISIBLE_ROWS - 1) * ROW_HEIGHT + ROW_HEIGHT * 0.75;
  const lineHeight = ROW_HEIGHT * 0.25 + 88; // through letters area bottom + into keyboard

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a1a1a', padding: '0.4rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #2a2a2a' }}>
        <button
          onClick={onBack}
          style={{ backgroundColor: '#333', color: '#9ca3af', padding: '0.2rem 0.6rem', borderRadius: '0.5rem', border: 'none', fontSize: '0.75rem' }}
        >
          ← Zpět
        </button>
        <span style={{ color: '#8b5cf6', fontWeight: 700, fontSize: '0.8rem' }}>
          🧪 Padající písmena — {lessonTitle}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: '#6b7280' }}>
          {currentIndex}/{chars.length} · chyby: {errors}
        </span>
      </div>

      {/* Main — same width as ExerciseScreen (max-w-3xl) */}
      <div className="w-full max-w-3xl mx-auto" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 1rem' }}>

        {/* Falling letters area */}
        <div
          ref={lettersAreaRef}
          style={{ position: 'relative', width: '100%', height: `${VISIBLE_ROWS * ROW_HEIGHT}px`, overflow: 'visible' }}
        >
          {/* Row backgrounds */}
          {Array.from({ length: VISIBLE_ROWS }).map((_, slot) => (
            <div key={slot} style={{
              position: 'absolute',
              top: `${slot * ROW_HEIGHT}px`,
              left: 0, right: 0,
              height: `${ROW_HEIGHT}px`,
              backgroundColor: slot === VISIBLE_ROWS - 1 ? '#8b5cf60d' : 'transparent',
              borderBottom: slot === VISIBLE_ROWS - 1
                ? `2px solid ${activeColor}44`
                : '1px solid #1e1e1e',
            }} />
          ))}

          {/* Gradient connector: from active slot bottom down to the keyboard key */}
          {activeMetrics !== null && (
            <div style={{
              position: 'absolute',
              left: `${activeMetrics.x}px`,
              top: `${lineTop}px`,
              width: '3px',
              height: `${lineHeight}px`,
              background: `linear-gradient(to bottom, ${activeColor}cc 0%, ${activeColor}88 30%, ${activeColor}22 80%, transparent 100%)`,
              transform: 'translateX(-50%)',
              borderRadius: '2px',
              pointerEvents: 'none',
            }} />
          )}

          {/* Letter tokens */}
          {queueItems.map(({ slot, textIndex, char, isNew }) => {
            const m = keyMetrics[char];
            const x = m?.x ?? null;
            const w = m?.width ?? 48;
            const isActive = slot === VISIBLE_ROWS - 1;
            const finger = keyFingerMap[char];
            const color = finger ? fingerColors[finger] : '#8b5cf6';
            const opacity = 0.3 + (slot / (VISIBLE_ROWS - 1)) * 0.7;

            return (
              <div
                key={textIndex}
                style={{
                  position: 'absolute',
                  top: `${slot * ROW_HEIGHT + ROW_HEIGHT / 2}px`,
                  left: x !== null ? `${x}px` : '50%',
                  transform: 'translate(-50%, -50%)',
                  transition: 'top 130ms ease-in-out',
                  animation: isNew ? 'fadeInTop 150ms ease forwards' : undefined,
                  width: `${w}px`,
                  height: isActive ? `${Math.max(w, 52)}px` : `${Math.min(w, ROW_HEIGHT - 12)}px`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // Same font as VirtualKeyboard keys
                  fontSize: isActive ? '0.9rem' : '0.75rem',
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  textTransform: 'uppercase',
                  backgroundColor: isActive ? `${color}33` : '#242424',
                  border: isActive ? `2px solid ${color}` : `1px solid #333`,
                  color: isActive ? '#fff' : '#e5e7eb',
                  boxShadow: isActive ? `0 0 24px ${color}44` : 'none',
                  opacity,
                  zIndex: isActive ? 3 : 1,
                }}
              >
                {char === ' ' ? '␣' : char.toUpperCase()}
              </div>
            );
          })}

          {/* Exiting letter (correct keypress animation) */}
          {exitingItem && (
            <div style={{
              position: 'absolute',
              top: `${(VISIBLE_ROWS - 1) * ROW_HEIGHT + ROW_HEIGHT / 2}px`,
              left: exitingItem.x !== null ? `${exitingItem.x}px` : '50%',
              transform: 'translate(-50%, -50%)',
              animation: 'fallOut 250ms ease forwards',
              width: `${exitingItem.w}px`,
              height: `${Math.max(exitingItem.w, 52)}px`,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
              fontWeight: 700,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
              textTransform: 'uppercase',
              backgroundColor: '#22c55e33',
              border: '2px solid #22c55e',
              color: '#22c55e',
              zIndex: 4,
            }}>
              {exitingItem.char === ' ' ? '␣' : exitingItem.char.toUpperCase()}
            </div>
          )}
        </div>

        {/* Virtual keyboard */}
        <div ref={kbRef} style={{ width: '100%' }}>
          <VirtualKeyboard activeKey={activeChar ?? ''} wrongKeyFlash={wrongFlash} />
        </div>
      </div>
    </div>
  );
}
