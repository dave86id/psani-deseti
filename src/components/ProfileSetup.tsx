import { useState, useRef } from 'react';

interface ProfileSetupProps {
  googleDisplayName: string | null;
  googleAvatar: string | null;
  onSave: (displayName: string, avatarBase64: string | null) => Promise<void>;
}

export default function ProfileSetup({ googleDisplayName, googleAvatar, onSave }: ProfileSetupProps) {
  const [name, setName] = useState(googleDisplayName ?? '');
  const [avatar, setAvatar] = useState<string | null>(googleAvatar);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onSave(name.trim(), avatar);
    setSaving(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}>
      <div className="rounded-2xl p-8 w-full max-w-sm text-center" style={{ backgroundColor: '#242424', border: '1px solid #333' }}>
        <h2 className="text-xl font-bold mb-1" style={{ color: '#8b5cf6' }}>Nastavte si profil</h2>
        <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>Jak se zobrazíte v žebříčku?</p>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="rounded-full cursor-pointer flex items-center justify-center overflow-hidden"
            style={{ width: '5rem', height: '5rem', backgroundColor: '#333', border: '2px solid #8b5cf6' }}
          >
            {avatar
              ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '2rem' }}>👤</span>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        </div>
        <button onClick={() => fileRef.current?.click()} className="text-xs mb-4 block mx-auto" style={{ color: '#8b5cf6' }}>
          Nahrát foto
        </button>

        {/* Name */}
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value.slice(0, 20))}
          placeholder="Vaše přezdívka"
          maxLength={20}
          className="w-full rounded-xl px-4 py-2 mb-4 text-sm outline-none"
          style={{ backgroundColor: '#333', border: '1px solid #444', color: '#fff' }}
        />

        <button
          onClick={handleSave}
          disabled={!name.trim() || saving}
          className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90"
          style={{ backgroundColor: '#8b5cf6', opacity: !name.trim() ? 0.5 : 1 }}
        >
          {saving ? 'Ukládání…' : 'Začít →'}
        </button>
      </div>
    </div>
  );
}
