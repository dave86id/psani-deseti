import { useEffect } from 'react';
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
  const handleSelectLesson = (lessonId: string) => {
    console.log('[scroll] Saving scroll Y before navigation:', window.scrollY);
    sessionStorage.setItem('dashboardScrollY', String(window.scrollY));
    onSelectLesson(lessonId);
  };
  const allLessons = getAllLessons();
  const completedCount = allLessons.filter(l => progress.lessons[l.id]?.completed).length;

  useEffect(() => {
    const saved = sessionStorage.getItem('dashboardScrollY');
    console.log('[scroll] Dashboard mounted, saved Y:', saved);
    if (saved) {
      const y = parseInt(saved);
      sessionStorage.removeItem('dashboardScrollY');
      // Double RAF ensures DOM is fully painted before scrolling
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          console.log('[scroll] Restoring scroll to', y);
          window.scrollTo(0, y);
        });
      });
    }
  }, []);

  const hasStarted = allLessons.some(l => (progress.lessons[l.id]?.completedExercises.length ?? 0) > 0);
  const nextLesson = allLessons.find(l => {
    const done = progress.lessons[l.id]?.completedExercises.length ?? 0;
    return done < l.exercises.length;
  }) ?? allLessons[0];
  const nextLessonHint = nextLesson
    ? `Lekce ${nextLesson.id} — ${nextLesson.newLetters.length > 0 ? nextLesson.newLetters.map(c => c.toUpperCase()).join(', ') : nextLesson.title}`
    : '';
  const totalCount = allLessons.length;
  const completedPct = Math.round((completedCount / totalCount) * 100);

  const allCpms = allLessons.map(l => progress.lessons[l.id]?.bestCpm ?? 0).filter(c => c > 0);
  const avgCpm = allCpms.length > 0 ? Math.round(allCpms.reduce((a, b) => a + b, 0) / allCpms.length) : 0;
  const allAccs = allLessons.map(l => progress.lessons[l.id]?.bestAccuracy ?? 0).filter(a => a > 0);
  const avgAcc = allAccs.length > 0 ? Math.round(allAccs.reduce((a, b) => a + b, 0) / allAccs.length) : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1a1a1a' }} className="px-6 py-2">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="logo" style={{ height: '1.6rem', width: 'auto' }} />
            <h1 className="font-bold" style={{ color: '#8b5cf6', fontSize: '1rem' }}>psaní deseti</h1>
          </div>
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
        {/* Hero section */}
        <div className="text-center mb-8" style={{ padding: '2rem 1rem 1.5rem' }}>
          <h1 className="font-bold mb-3" style={{ fontSize: '1.6rem', color: '#ffffff', lineHeight: 1.2 }}>
            Nauč se psát všemi deseti.
          </h1>
          <p className="mb-5" style={{ fontSize: '0.8rem', color: '#9ca3af', maxWidth: '32rem', margin: '0 auto 1.5rem' }}>
            Procházej cvičení krok za krokem a sleduj, jak se zlepšuješ.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => nextLesson && handleSelectLesson(nextLesson.id)}
              style={{
                backgroundColor: '#8b5cf6',
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 700,
                padding: '0.65rem 2rem',
                borderRadius: '0.75rem',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 24px #8b5cf655',
              }}
            >
              Jdu na to! →
            </button>
            <button
              onClick={() => document.getElementById('lekce-sekce')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                backgroundColor: 'transparent',
                color: '#8b5cf6',
                fontSize: '0.95rem',
                fontWeight: 600,
                padding: '0.65rem 1.5rem',
                borderRadius: '0.75rem',
                border: '1px solid #8b5cf6',
                cursor: 'pointer',
              }}
            >
              Lekce ↓
            </button>
          </div>
          {nextLessonHint && (
            <div style={{ marginTop: '0.6rem', fontSize: '0.65rem', color: '#6b7280' }}>
              {hasStarted ? 'Pokračuješ v' : ''} {nextLessonHint}
            </div>
          )}
        </div>

        {/* Hero image */}
        <div className="rounded-xl overflow-hidden" style={{ marginBottom: '0.5rem' }}>
          <img
            src="/hero-keyboard.png"
            alt="Klávesnice s barevnými prsty"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
        <div className="mb-6 text-center">
          <span style={{ fontSize: '0.65rem', color: '#6b7280', backgroundColor: '#242424', border: '1px solid #333', borderRadius: '0.4rem', padding: '0.25rem 0.75rem' }}>
            💡 Takhle patří prsty na klávesnici.
          </span>
        </div>

        {/* Top row: progress + leaderboard side by side */}
        <div className="flex flex-col md:flex-row gap-4 mb-6" style={{ alignItems: 'stretch' }}>
          {/* Overall stats */}
          <div className="rounded-xl p-4" style={{ backgroundColor: '#242424', border: '1px solid #333', flex: '0 0 30%' }}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm" style={{ color: '#9ca3af' }}>Tvůj postup</span>
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
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              {leaderboardSection}
            </div>
          )}
        </div>

        {/* Sections */}
        <div id="lekce-sekce" />
        {sections.map(section => (
          <div key={section.id} className="mb-6">
            <h2 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{ color: '#6b7280' }}>
              {section.id}. {section.title}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
              {section.lessons.map(lesson => {
                const lessonProg = progress.lessons[lesson.id];
                const completedCount = lessonProg?.completedExercises.length ?? 0;
                const totalCount = lesson.exercises.length;
                const completed = (lessonProg?.completed ?? false) || completedCount >= totalCount;
                const medal = lessonProg?.exerciseScores ? getLessonMedal(lessonProg.exerciseScores) : null;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLesson(lesson.id)}
                    className="text-left rounded-xl transition-all duration-150"
                    style={{
                      backgroundColor: completed ? '#1a2e1a' : '#242424',
                      border: completed ? '1px solid #22c55e55' : '1px solid #333',
                      cursor: 'pointer',
                      padding: '10px 12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: '#6b7280' }}>{lesson.id}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {completed && medal && <span style={{ fontSize: '1.3rem' }}>{medal}</span>}
                        {completed
                          ? <span style={{ color: '#22c55e', fontSize: '0.75rem' }}>✓</span>
                          : <span style={{ color: '#8b5cf6', fontSize: '0.7rem' }}>→</span>
                        }
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 500, color: '#e5e7eb', marginBottom: '4px', lineHeight: 1.2 }}>
                      {lesson.title}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: completed ? '#22c55e99' : '#4b5563' }}>
                      {completedCount}/{totalCount} cvičení
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Info boxes — bottom */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '1rem', marginBottom: '1.5rem' }} className="info-boxes">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '0.5rem 0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#ffffff', lineHeight: 1.3 }}>Přesnost před rychlostí</div>
            <div style={{ fontSize: '0.6rem', color: '#9ca3af', lineHeight: 1.5 }}>Piš pomalu a přesně. Rychlost přijde sama. Tvé prsty se učí správné pohyby — nech je pracovat.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '0.5rem 0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#ffffff', lineHeight: 1.3 }}>Dva měsíce a máš to</div>
            <div style={{ fontSize: '0.6rem', color: '#9ca3af', lineHeight: 1.5 }}>Celý kurz zvládneš za zhruba 2 měsíce. Záleží na tobě, kolik času tomu věnuješ. Pravidelnost je klíč.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '0.5rem 0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#ffffff', lineHeight: 1.3 }}>Stačí 10 minut denně</div>
            <div style={{ fontSize: '0.6rem', color: '#9ca3af', lineHeight: 1.5 }}>Každý den krátké cvičení. Prsty si zapamatují správné pohyby a ty si vytvoříš návyk, který vydrží.</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', padding: '0.5rem 0.75rem' }}>
            <div style={{ fontSize: '0.7rem', color: '#ffffff', lineHeight: 1.3 }}>Dávej si pauzy</div>
            <div style={{ fontSize: '0.6rem', color: '#9ca3af', lineHeight: 1.5 }}>Protáhni si ruce, záda, odpočiň oči. Krátká přestávka mezi lekcemi vždy pomůže</div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}>
        <img src="/footer-characters.png" alt="" style={{ width: '75%', maxWidth: '36rem', height: 'auto', opacity: 0.6 }} />
      </div>
    </div>
  );
}
