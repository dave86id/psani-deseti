import { useEffect, useState } from 'react';
import { loadRecentErrors, clearRecentErrors } from '../utils/recentErrors';
import ErrorHeatmapModal from './ErrorHeatmapModal';

interface ErrorsModalProps {
  onClose: () => void;
  onPracticeErrors: () => void;
}

const TOP_N = 10;

function displayChar(ch: string): string {
  if (ch === ' ') return '␣ mezera';
  if (ch === '\n') return '⏎ enter';
  if (ch === '\t') return '⇥ tab';
  return ch;
}

export default function ErrorsModal({ onClose, onPracticeErrors }: ErrorsModalProps) {
  const [version, setVersion] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { count, aggregated } = loadRecentErrors();
  const allRows = Object.entries(aggregated)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const rows = allRows.slice(0, TOP_N);
  const totalErrors = allRows.reduce((sum, [, n]) => sum + n, 0);
  const hasErrors = allRows.length > 0;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleReset = () => {
    if (!hasErrors) return;
    if (!window.confirm('Opravdu vynulovat počítadlo chyb?')) return;
    clearRecentErrors();
    setVersion(v => v + 1);
  };

  // version is in the dependency so re-render reads fresh storage
  void version;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
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
          maxWidth: '28rem',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.2rem' }}>
              Nejčastější chyby
            </h2>
            <p style={{ fontSize: '0.65rem', color: '#9ca3af' }}>
              {count === 0
                ? 'Zatím žádná dokončená cvičení'
                : `Z posledních ${count} cvičení (max. 15) · top ${Math.min(TOP_N, allRows.length)}`}
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

        {hasErrors && (
          <div style={{ marginBottom: '0.6rem' }}>
            <button
              type="button"
              onClick={() => setShowHeatmap(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '0.7rem',
                color: '#8b5cf6',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              🔥 Heat mapa chyb →
            </button>
          </div>
        )}

        <div style={{ overflowY: 'auto', flex: 1 }}>
          {rows.length === 0 ? (
            <div style={{ padding: '1.5rem 0', textAlign: 'center', color: '#6b7280', fontSize: '0.75rem' }}>
              {count === 0 ? 'Dokonči cvičení a uvidíš, kde děláš nejvíc chyb.' : '🎯 Žádné chyby v posledních cvičeních!'}
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: '#6b7280', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Znak</th>
                  <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem', color: '#6b7280', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chyb</th>
                  <th style={{ textAlign: 'right', padding: '0.4rem 0.5rem', color: '#6b7280', fontWeight: 500, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Podíl</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([ch, n]) => {
                  const pct = totalErrors > 0 ? Math.round((n / totalErrors) * 100) : 0;
                  return (
                    <tr key={ch} style={{ borderBottom: '1px solid #2a2a2a' }}>
                      <td style={{ padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 600, color: '#e5e7eb' }}>
                        {displayChar(ch)}
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', fontFamily: 'monospace', color: '#ef4444', fontWeight: 600 }}>
                        {n}
                      </td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.4rem' }}>
                          <div style={{ width: '4rem', height: '4px', backgroundColor: '#333', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#ef4444' }} />
                          </div>
                          <span style={{ color: '#9ca3af', fontSize: '0.65rem', minWidth: '2.2rem', textAlign: 'right' }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {hasErrors && (
          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => {
                onClose();
                onPracticeErrors();
              }}
              style={{
                backgroundColor: '#8b5cf6',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.55rem 1.4rem',
                borderRadius: '0.6rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 18px #8b5cf655',
              }}
            >
              Procvičovat moje chyby →
            </button>
            <button
              type="button"
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.2rem 0.4rem',
                fontSize: '0.6rem',
                color: '#6b7280',
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              Resetovat chyby
            </button>
          </div>
        )}
      </div>

      {showHeatmap && <ErrorHeatmapModal onClose={() => setShowHeatmap(false)} />}
    </div>
  );
}
