import { useState } from 'react';

interface LoginScreenProps {
  onSignIn: () => Promise<void>;
  onSkip: () => void;
  leaderboardSection: React.ReactNode;
}

export default function LoginScreen({ onSignIn, onSkip }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try { await onSignIn(); } catch { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      <div style={{ textAlign: 'center', maxWidth: '32rem', width: '100%', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="logo" style={{ height: '1.8rem', width: 'auto' }} />
          <span style={{ fontWeight: 700, color: '#8b5cf6', fontSize: '1.1rem' }}>psaní deseti</span>
        </div>

        <p style={{ color: '#9ca3af', fontSize: '0.7rem', marginBottom: '1.5rem' }}>
          Přihlas se, aby se tvůj pokrok uložil. Nebo pokračuj jako host.
        </p>

        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 1rem', borderRadius: '0.6rem',
              backgroundColor: '#ffffff', color: '#1a1a1a',
              fontSize: '0.65rem', fontWeight: 600, border: 'none',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Přihlašování…' : 'Přihlásit se přes Google'}
          </button>

          <button
            onClick={onSkip}
            style={{
              padding: '0.45rem 1rem', borderRadius: '0.6rem',
              backgroundColor: 'transparent', color: '#9ca3af',
              fontSize: '0.65rem', fontWeight: 500,
              border: '1px solid #444',
            }}
          >
            Pokračovat bez přihlášení
          </button>
        </div>
      </div>
    </div>
  );
}
