import { useEffect } from 'react';
import { loadRecentErrors } from '../utils/recentErrors';

interface ErrorsModalProps {
  onClose: () => void;
}

function displayChar(ch: string): string {
  if (ch === ' ') return '␣ mezera';
  if (ch === '\n') return '⏎ enter';
  if (ch === '\t') return '⇥ tab';
  return ch;
}

export default function ErrorsModal({ onClose }: ErrorsModalProps) {
  const { count, aggregated } = loadRecentErrors();
  const rows = Object.entries(aggregated)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1]);
  const totalErrors = rows.reduce((sum, [, n]) => sum + n, 0);

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
          maxHeight: '80vh',
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
                : `Z posledních ${count} cvičení (max. 15)`}
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
      </div>
    </div>
  );
}
