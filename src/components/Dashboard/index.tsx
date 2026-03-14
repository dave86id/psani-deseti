import { sections, getAllLessons } from '../../data/lessons';
import type { UserProgress } from '../../types';
import { getLessonMedal } from '../../utils/stats';
import type { UserProfile } from '../../hooks/useAuth';

interface DashboardProps {
  progress: UserProgress;
  onSelectLesson: (lessonId: string) => void;
  profile?: UserProfile | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
  leaderboardSection?: React.ReactNode;
}

export default function Dashboard({ progress, onSelectLesson, profile, onSignIn, onSignOut, leaderboardSection }: DashboardProps) {
  const allLessons = getAllLessons();
  const completedCount = allLessons.filter(l => progress.lessons[l.id]?.completed).length;
  const totalCount = allLessons.length;
  const completedPct = Math.round((completedCount / totalCount) * 100);

  const allCpms = allLessons.map(l => progress.lessons[l.id]?.bestCpm ?? 0).filter(c => c > 0);
  const avgCpm = allCpms.length > 0 ? Math.round(allCpms.reduce((a, b) => a + b, 0) / allCpms.length) : 0;
  const allAccs = allLessons.map(l => progress.lessons[l.id]?.bestAccuracy ?? 0).filter(a => a > 0);
  const avgAcc = allAccs.length > 0 ? Math.round(allAccs.reduce((a, b) => a + b, 0) / allAccs.length) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#222222', borderBottom: '1px solid #333' }} className="px-6 py-2">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <h1 className="font-bold" style={{ color: '#8b5cf6', fontSize: '1rem' }}>psaní deseti</h1>
          <div className="flex items-center gap-2">
            {profile ? (
              <>
                <div className="rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                  style={{ width: '1.4rem', height: '1.4rem', backgroundColor: '#333', border: '1px solid #8b5cf6' }}>
                  {profile.avatarBase64
                    ? <img src={profile.avatarBase64} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '0.65rem' }}>👤</span>
                  }
                </div>
                <span className="text-xs" style={{ color: '#e5e7eb' }}>{profile.displayName}</span>
                {onSignOut && (
                  <button onClick={onSignOut} className="text-xs px-2 py-0.5 rounded"
                    style={{ backgroundColor: '#333', color: '#9ca3af', border: '1px solid #444' }}>
                    Odhlásit
                  </button>
                )}
              </>
            ) : (
              onSignIn && (
                <button onClick={onSignIn} className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{ backgroundColor: '#8b5cf6', color: '#fff' }}>
                  Přihlásit se
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Hero image */}
        <div className="rounded-xl overflow-hidden mb-6">
          <img
            src="/hero-keyboard.png"
            alt="Klávesnice s barevnými prsty"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Top row: progress + leaderboard side by side */}
        <div className="flex flex-col md:flex-row gap-4 mb-6" style={{ alignItems: 'stretch' }}>
          {/* Overall stats */}
          <div className="rounded-xl p-4 flex-1" style={{ backgroundColor: '#242424', border: '1px solid #333' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm" style={{ color: '#9ca3af' }}>Celkový postup</span>
              <span className="font-bold" style={{ color: '#8b5cf6' }}>{completedPct}%</span>
            </div>
            <div className="rounded-full h-2 mb-4" style={{ backgroundColor: '#333' }}>
              <div
                className="rounded-full h-2 transition-all duration-500"
                style={{ width: `${completedPct}%`, backgroundColor: '#22c55e' }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-bold text-lg" style={{ color: '#22c55e' }}>{completedCount}/{totalCount}</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>Lekcí dokončeno</div>
              </div>
              <div>
                <div className="font-bold text-lg" style={{ color: '#8b5cf6' }}>{avgCpm > 0 ? avgCpm : '—'}</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>Průměr CPM</div>
              </div>
              <div>
                <div className="font-bold text-lg" style={{ color: '#06b6d4' }}>{avgAcc > 0 ? `${avgAcc}%` : '—'}</div>
                <div className="text-xs" style={{ color: '#6b7280' }}>Průměr přesnost</div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          {leaderboardSection && (
            <div className="flex-1 min-w-0">
              {leaderboardSection}
            </div>
          )}
        </div>

        {/* Sections */}
        {sections.map(section => (
          <div key={section.id} className="mb-6">
            <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#6b7280' }}>
              {section.id}. {section.title}
            </h2>
            <div className="flex flex-col gap-2">
              {section.lessons.map(lesson => {
                const lessonProg = progress.lessons[lesson.id];
                const completedCount = lessonProg?.completedExercises.length ?? 0;
                const totalCount = lesson.exercises.length;
                const completed = (lessonProg?.completed ?? false) || completedCount >= totalCount;
                const medal = lessonProg?.exerciseScores ? getLessonMedal(lessonProg.exerciseScores) : null;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className="w-full text-left rounded-xl px-4 py-3 transition-all duration-150"
                    style={{
                      backgroundColor: '#242424',
                      border: completed ? '1px solid #22c55e44' : '1px solid #333',
                      cursor: 'pointer',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono" style={{ color: '#6b7280' }}>{lesson.id}</span>
                        <span className="font-medium" style={{ color: '#e5e7eb', fontSize: '0.9rem' }}>
                          {lesson.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#6b7280' }}>
                          {completedCount}/{totalCount}
                        </span>
                        {completed && medal && (
                          <span style={{ fontSize: '1.2rem' }}>{medal}</span>
                        )}
                        {completed
                          ? <span style={{ color: '#22c55e' }}>✓</span>
                          : <span style={{ color: '#8b5cf6', fontSize: '0.8rem' }}>→</span>
                        }
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
