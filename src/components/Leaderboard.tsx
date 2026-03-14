import { useEffect } from 'react';
import type { LeaderboardEntry } from '../hooks/useLeaderboard';
import { formatTime } from '../utils/stats';

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
        <button onClick={onRefresh} className="text-xs" style={{ color: '#6b7280' }}>↻ Obnovit</button>
      </div>

      {loading ? (
        <div className="px-4 py-6 text-center text-sm" style={{ color: '#6b7280' }}>Načítání…</div>
      ) : entries.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm" style={{ color: '#6b7280' }}>
          Zatím žádní hráči. Buďte první!
        </div>
      ) : (
        <div>
          {/* Header row */}
          <div className="grid px-4 py-2 text-xs" style={{
            gridTemplateColumns: '2rem 2fr 4rem 4rem 4rem 4rem 5rem',
            color: '#6b7280',
            borderBottom: '1px solid #2a2a2a'
          }}>
            <span>#</span>
            <span>Hráč</span>
            <span className="text-right">Lekce</span>
            <span className="text-right">Přesnost</span>
            <span className="text-right">ZPM</span>
            <span className="text-right">Čas</span>
            <span className="text-right">Skóre</span>
          </div>

          {entries.map((entry, idx) => {
            const isCurrent = entry.uid === currentUid;
            const isTop3 = idx < 3;
            return (
              <div
                key={entry.uid}
                className="grid px-4 py-3 items-center text-sm"
                style={{
                  gridTemplateColumns: '2rem 2fr 4rem 4rem 4rem 4rem 5rem',
                  borderBottom: '1px solid #2a2a2a',
                  backgroundColor: isCurrent ? '#8b5cf611' : 'transparent',
                  borderLeft: isCurrent ? '2px solid #8b5cf6' : '2px solid transparent',
                }}
              >
                {/* Rank */}
                <span style={{ color: isTop3 ? RANK_COLORS[idx] : '#6b7280', fontWeight: isTop3 ? 700 : 400 }}>
                  {isTop3 ? RANK_ICONS[idx] : idx + 1}
                </span>

                {/* Player */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                    style={{ width: '1.6rem', height: '1.6rem', backgroundColor: '#333' }}>
                    {entry.avatarBase64
                      ? <img src={entry.avatarBase64} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '0.7rem' }}>👤</span>
                    }
                  </div>
                  <span className="truncate font-medium" style={{ color: isCurrent ? '#a78bfa' : '#e5e7eb' }}>
                    {entry.displayName}
                    {isCurrent && <span className="ml-1 text-xs" style={{ color: '#8b5cf6' }}>(vy)</span>}
                  </span>
                </div>

                {/* Stats */}
                <span className="text-right" style={{ color: '#22c55e' }}>{entry.completedLessons}</span>
                <span className="text-right" style={{ color: entry.avgAccuracy >= 90 ? '#22c55e' : '#eab308' }}>
                  {entry.avgAccuracy}%
                </span>
                <span className="text-right" style={{ color: '#8b5cf6' }}>{entry.avgCpm}</span>
                <span className="text-right" style={{ color: '#06b6d4' }}>{formatTime(entry.totalTime)}</span>
                <span className="text-right font-bold" style={{ color: isTop3 ? RANK_COLORS[idx] : '#e5e7eb' }}>
                  {entry.score.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
