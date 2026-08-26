import { useEffect, useState } from 'react';
import { isSoundEnabled, setSoundEnabled } from '../hooks/useSound';
import { useKeyboardVisible, setKeyboardVisible } from '../hooks/useKeyboardVisible';

const GOAL_SECONDS = 900;
const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  elapsedSeconds: number;
  isComplete: boolean;
}

export default function DailyGoalTimer({ elapsedSeconds, isComplete }: Props) {
  const [showMessage, setShowMessage] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [soundOn, setSoundOn] = useState(isSoundEnabled);
  const [soundHovered, setSoundHovered] = useState(false);
  const keyboardVisible = useKeyboardVisible();
  const [kbHovered, setKbHovered] = useState(false);
  const progress = Math.min(elapsedSeconds / GOAL_SECONDS, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeLabel = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const tooltipText = isComplete
    ? 'Dnes jste splnili cíl 15 min.'
    : `Váš denní cíl cvičení: ${timeLabel}`;

  useEffect(() => {
    if (isComplete) {
      const t = setTimeout(() => setShowMessage(true), 100);
      return () => clearTimeout(t);
    } else {
      setShowMessage(false);
    }
  }, [isComplete]);

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      {/* Message pill (after goal complete) */}
      <div style={{
        backgroundColor: '#1a1a1a',
        border: '1px solid #22c55e',
        borderRadius: '999px',
        padding: '0.35rem 0.85rem',
        color: '#22c55e',
        fontSize: '0.875rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        opacity: showMessage ? 1 : 0,
        transform: showMessage ? 'translateX(0)' : 'translateX(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: 'none',
      }}>
        Splnili jste denní cíl!
      </div>

      {/* Keyboard toggle */}
      <div
        style={{ position: 'relative', flexShrink: 0 }}
        onMouseEnter={() => setKbHovered(true)}
        onMouseLeave={() => setKbHovered(false)}
      >
        <button
          type="button"
          aria-label={keyboardVisible ? 'Skrýt klávesnici' : 'Zobrazit klávesnici'}
          // Keep focus on the exercise — a focused button would swallow Space.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setKeyboardVisible(!keyboardVisible)}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            border: '1px solid #3a3a3a',
            borderRadius: '999px',
            color: keyboardVisible ? '#d1d5db' : '#6b7280',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <line x1="6" y1="10" x2="6" y2="10" />
            <line x1="10" y1="10" x2="10" y2="10" />
            <line x1="14" y1="10" x2="14" y2="10" />
            <line x1="18" y1="10" x2="18" y2="10" />
            <line x1="8" y1="14" x2="16" y2="14" />
            {!keyboardVisible && <line x1="3" y1="21" x2="21" y2="3" />}
          </svg>
        </button>

        {/* Tooltip */}
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: 0,
          backgroundColor: '#1a1a1a',
          border: '1px solid #3a3a3a',
          borderRadius: '0.5rem',
          padding: '0.4rem 0.75rem',
          color: '#d1d5db',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: kbHovered ? 1 : 0,
          transform: kbHovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}>
          {keyboardVisible ? 'Skrýt klávesnici' : 'Zobrazit klávesnici'}
        </div>
      </div>

      {/* Sound toggle */}
      <div
        style={{ position: 'relative', flexShrink: 0 }}
        onMouseEnter={() => setSoundHovered(true)}
        onMouseLeave={() => setSoundHovered(false)}
      >
        <button
          type="button"
          aria-label={soundOn ? 'Vypnout zvuk kláves' : 'Zapnout zvuk kláves'}
          // Keep focus on the exercise — a focused button would swallow Space.
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            const next = !soundOn;
            setSoundEnabled(next);
            setSoundOn(next);
          }}
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1a1a1a',
            border: '1px solid #3a3a3a',
            borderRadius: '999px',
            color: soundOn ? '#d1d5db' : '#6b7280',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            {soundOn ? (
              <>
                <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                <path d="M18.5 5.5a9 9 0 0 1 0 13" />
              </>
            ) : (
              <>
                <line x1="22" y1="9" x2="16" y2="15" />
                <line x1="16" y1="9" x2="22" y2="15" />
              </>
            )}
          </svg>
        </button>

        {/* Tooltip */}
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: 0,
          backgroundColor: '#1a1a1a',
          border: '1px solid #3a3a3a',
          borderRadius: '0.5rem',
          padding: '0.4rem 0.75rem',
          color: '#d1d5db',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: soundHovered ? 1 : 0,
          transform: soundHovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}>
          {soundOn ? 'Vypnout zvuk kláves' : 'Zapnout zvuk kláves'}
        </div>
      </div>

      {/* Circle + tooltip wrapper */}
      <div
        style={{ position: 'relative', width: 56, height: 56, flexShrink: 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="#333" strokeWidth="3" />
          {/* Progress arc */}
          <circle
            cx="28"
            cy="28"
            r={RADIUS}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease' }}
          />
        </svg>

        {/* Center: check icon when complete, empty otherwise */}
        {isComplete && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}

        {/* Tooltip */}
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          right: 0,
          backgroundColor: '#1a1a1a',
          border: '1px solid #3a3a3a',
          borderRadius: '0.5rem',
          padding: '0.4rem 0.75rem',
          color: '#d1d5db',
          fontSize: '0.875rem',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
        }}>
          {tooltipText}
        </div>
      </div>
    </div>
  );
}
