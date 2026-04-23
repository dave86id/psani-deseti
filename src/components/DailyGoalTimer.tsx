import { useEffect, useState } from 'react';

const GOAL_SECONDS = 600;
const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  elapsedSeconds: number;
  isComplete: boolean;
}

export default function DailyGoalTimer({ elapsedSeconds, isComplete }: Props) {
  const [showMessage, setShowMessage] = useState(false);
  const [hovered, setHovered] = useState(false);
  const progress = Math.min(elapsedSeconds / GOAL_SECONDS, 1);
  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeLabel = `${minutes}:${String(seconds).padStart(2, '0')}`;
  const tooltipText = isComplete
    ? 'Dnes jste splnili cíl 10 min.'
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
        fontSize: '0.7rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        opacity: showMessage ? 1 : 0,
        transform: showMessage ? 'translateX(0)' : 'translateX(8px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
        pointerEvents: 'none',
      }}>
        Splnili jste denní cíl!
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
            stroke={isComplete ? '#22c55e' : '#8b5cf6'}
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
          fontSize: '0.7rem',
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
