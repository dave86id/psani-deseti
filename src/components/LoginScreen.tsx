import { useState } from 'react';

interface LoginScreenProps {
  onSignIn: () => Promise<void>;
  onSkip: () => void;
  leaderboardSection: React.ReactNode;
}

export default function LoginScreen({ onSignIn, onSkip, leaderboardSection }: LoginScreenProps) {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try { await onSignIn(); } catch { setLoading(false); }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      <div style={{ backgroundColor: '#222222', borderBottom: '1px solid #333' }} className="px-6 py-4">
        <h1 className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>psaní deseti</h1>
        <p className="text-sm mt-1" style={{ color: '#9ca3af' }}>Naučte se psát všemi deseti prsty</p>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="rounded-2xl p-8 text-center mb-8" style={{ backgroundColor: '#242424', border: '1px solid #333' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⌨️</div>
          <h2 className="text-xl font-bold mb-2">Přihlaste se a sledujte svůj pokrok</h2>
          <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>
            Váš postup se uloží do cloudu a zobrazíte se v žebříčku
          </p>
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all hover:opacity-90"
            style={{ backgroundColor: '#ffffff', color: '#1a1a1a', fontSize: '0.9rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Přihlašování…' : 'Přihlásit se přes Google'}
          </button>
          <div className="mt-4">
            <button onClick={onSkip} className="text-xs underline" style={{ color: '#6b7280' }}>
              Pokračovat bez přihlášení
            </button>
          </div>
        </div>
        {leaderboardSection}
      </div>
    </div>
  );
}
