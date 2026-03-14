import { useEffect } from 'react';
import type { LeaderboardEntry } from '../hooks/useLeaderboard';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  loading: boolean;
  currentUid: string | null;
  onRefresh: () => void;
}

const RANK_COLORS = ['#f59e0b', '#9ca3af', '#b45309'];
const RANK_ICONS = ['🥇', '🥈', '🥉'];

export default function Leaderboard({ entries, loading, currentUid, onRefresh }: LeaderboardProps) {
  useEffect(() => { onRefresh(); }, [onRefresh]);

  return (
    <div className="rounded-xl overflow-hidden" style={{ backgroundColor: '#242424', border: '1px solid #333' }}>
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #333' }}>
        <h2 className="font-semibold text-sm" style={{ color: '#9ca3af' }}>🏆 ŽEBŘÍČEK</h2>
        <button onClick={onRefresh} className="lb-refresh text-xs" style={{ color: '#6b7280' }}>↻ Obnovit</button>
      </div>

      {loading ? (
        <div className="px-4 py-6 text-center text-sm" style={{ color: '#6b7280' }}>Načítání…</div>
      ) : entries.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm" style={{ color: '#6b7280' }}>
          Zatím žádní hráči. Buďte první!
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'auto' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
              <th style={{ padding: '6px 8px 6px 16px', textAlign: 'left', color: '#6b7280', fontSize: '0.7rem', fontWeight: 400, whiteSpace: 'nowrap', width: '1px' }}>#</th>
              <th style={{ padding: '6px 8px', textAlign: 'left', color: '#6b7280', fontSize: '0.7rem', fontWeight: 400 }}>Hráč</th>
              <th style={{ padding: '6px 8px', textAlign: 'right', color: '#6b7280', fontSize: '0.7rem', fontWeight: 400, whiteSpace: 'nowrap' }}>Lekce</th>
              <th style={{ padding: '6px 8px', textAlign: 'right', color: '#6b7280', fontSize: '0.7rem', fontWeight: 400, whiteSpace: 'nowrap' }}>Přesnost</th>
              <th style={{ padding: '6px 8px', textAlign: 'right', color: '#6b7280', fontSize: '0.7rem', fontWeight: 400, whiteSpace: 'nowrap' }}>CPM</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, idx) => {
              const isCurrent = entry.uid === currentUid;
              const isTop3 = idx < 3;
              return (
                <tr
                  key={entry.uid}
                  style={{
                    borderBottom: '1px solid #2a2a2a',
                    backgroundColor: isCurrent ? '#8b5cf611' : 'transparent',
                    borderLeft: isCurrent ? '3px solid #8b5cf6' : '3px solid transparent',
                  }}
                >
                  {/* Rank */}
                  <td style={{ padding: '10px 8px 10px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{
                      color: isTop3 ? RANK_COLORS[idx] : '#6b7280',
                      fontWeight: isTop3 ? 700 : 400,
                      fontSize: isTop3 ? '1.1rem' : '0.8rem',
                    }}>
                      {isTop3 ? RANK_ICONS[idx] : idx + 1}
                    </span>
                  </td>

                  {/* Player */}
                  <td style={{ padding: '10px 8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '50%',
                        flexShrink: 0, overflow: 'hidden', backgroundColor: '#333',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {entry.avatarBase64
                          ? <img src={entry.avatarBase64} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '0.7rem' }}>👤</span>
                        }
                      </div>
                      <span style={{ color: isCurrent ? '#a78bfa' : '#e5e7eb', fontSize: '0.8rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {entry.displayName}
                        {isCurrent && <span style={{ marginLeft: '4px', fontSize: '0.65rem', color: '#8b5cf6' }}>(vy)</span>}
                      </span>
                    </div>
                  </td>

                  {/* Stats */}
                  <td style={{ padding: '10px 8px', textAlign: 'right', color: '#22c55e', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {entry.completedLessons}
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', fontSize: '0.8rem', whiteSpace: 'nowrap', color: entry.avgAccuracy >= 90 ? '#22c55e' : '#eab308' }}>
                    {entry.avgAccuracy}%
                  </td>
                  <td style={{ padding: '10px 8px', textAlign: 'right', color: '#8b5cf6', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    {entry.avgCpm}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
