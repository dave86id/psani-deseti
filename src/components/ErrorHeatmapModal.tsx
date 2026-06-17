import { useEffect } from 'react';
import { loadRecentErrors } from '../utils/recentErrors';
import { buildHeatmap, heatColor } from '../utils/errorHeatmap';
import VirtualKeyboard from './VirtualKeyboard';

interface ErrorHeatmapModalProps {
  onClose: () => void;
}

export default function ErrorHeatmapModal({ onClose }: ErrorHeatmapModalProps) {
  const { count, aggregated } = loadRecentErrors();
  const { colors, max, total } = buildHeatmap(aggregated);
  const hasErrors = total > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#242424',
          border: '1px solid #3a3a3a',
          borderRadius: '0.75rem',
          padding: '1.25rem',
          maxWidth: '46rem',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
              Heat mapa chyb
            </h2>
            <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
              {hasErrors
                ? `Z posledních ${count} cvičení · klávesy obarvené podle podílu chyb`
                : 'Zatím žádné chyby k zobrazení'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#9ca3af',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0 0.25rem',
              lineHeight: 1,
            }}
            aria-label="Zavřít"
          >
            ×
          </button>
        </div>

        <VirtualKeyboard heatmap={colors} />

        {hasErrors && (
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>nejméně chyb</span>
            <div
              style={{
                width: '12rem',
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(to right, ${[0, 1, 2, 3, 4, 5, 6].map(i => heatColor(i, 6)).join(', ')})`,
              }}
            />
            <span style={{ fontSize: '0.6rem', color: '#9ca3af' }}>nejvíc chyb ({max})</span>
          </div>
        )}
      </div>
    </div>
  );
}
