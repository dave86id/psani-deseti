import { keyboardRows } from '../data/keyboardLayout';
import { keyFingerMap, fingerColors } from '../data/fingerMapping';
import type { KeyDef } from '../types';

interface VirtualKeyboardProps {
  activeKey: string;
  wrongKeyFlash: string | null;
}

function getKeyStyle(
  keyDef: KeyDef,
  activeKey: string,
  wrongKeyFlash: string | null
): React.CSSProperties {
  const isActive = keyDef.key === activeKey;
  const isWrong = keyDef.key === wrongKeyFlash;

  if (isActive) {
    return {
      backgroundColor: '#8b5cf6',
      borderColor: '#a78bfa',
      color: '#ffffff',
      boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)',
    };
  }

  if (isWrong) {
    return {
      backgroundColor: '#ef4444',
      borderColor: '#f87171',
      color: '#ffffff',
      boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
    };
  }

  const finger = keyFingerMap[keyDef.key] ?? keyFingerMap[keyDef.label];
  const fingerColor = finger ? fingerColors[finger] : null;

  if (fingerColor) {
    // Subtle tint of the finger color
    return {
      backgroundColor: fingerColor + '22', // ~13% opacity
      borderColor: fingerColor + '55',     // ~33% opacity
      color: '#d1d5db',
    };
  }

  return {
    backgroundColor: '#374151',
    borderColor: '#4b5563',
    color: '#d1d5db',
  };
}

function getKeyWidth(keyDef: KeyDef): string {
  if (keyDef.extraWide) return '16rem';
  if (keyDef.wide) return '4rem';
  return '2.4rem';
}

export default function VirtualKeyboard({
  activeKey,
  wrongKeyFlash,
}: VirtualKeyboardProps) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-xl select-none w-full"
      style={{ backgroundColor: '#222222' }}
    >
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-between gap-1">
          {row.map((keyDef, keyIndex) => {
            const style = getKeyStyle(keyDef, activeKey, wrongKeyFlash);
            const width = getKeyWidth(keyDef);

            return (
              <div
                key={keyIndex}
                className="flex items-center justify-center rounded border text-xs font-mono transition-all duration-100 cursor-default"
                style={{
                  width,
                  flex: keyDef.extraWide ? '4 1 0' : keyDef.wide ? '2 1 0' : '1 1 0',
                  height: '2.4rem',
                  fontSize: keyDef.extraWide ? '0.5rem' : '0.75rem',
                  userSelect: 'none',
                  ...style,
                }}
              >
                {keyDef.label === ' ' ? (
                  <span className="text-gray-500" style={{ fontSize: '0.45rem' }}>MEZERNÍK</span>
                ) : keyDef.altChar ? (
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, gap: '1px' }}>
                    <span style={{ fontSize: '0.65rem' }}>{keyDef.label}</span>
                    <span style={{ fontSize: '0.6rem', color: '#d1d5db' }}>{keyDef.altChar}</span>
                  </span>
                ) : (
                  <span style={{ textTransform: /^[a-záčďéěíňóřšťůúýž]$/.test(keyDef.label) ? 'uppercase' : 'none' }}>{keyDef.label}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
