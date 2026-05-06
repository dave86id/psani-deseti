import { keyboardRows } from '../data/keyboardLayout';
import { keyFingerMap, fingerColors } from '../data/fingerMapping';
import type { KeyDef } from '../types';

// Set of all chars directly typable on the layout (key or shift), used to
// skip the dead-key path when a dedicated key exists (e.g. ú, Ú, ů, Ů).
const DIRECT_KEYS = new Set<string>();
keyboardRows.forEach(row => row.forEach(k => {
  if (k.key) DIRECT_KEYS.add(k.key);
  if (k.shift) DIRECT_KEYS.add(k.shift);
}));

const DIACRITIC_MAP: Record<string, Record<string, string>> = {
  'ˇ': {
    'C': 'Č', 'c': 'č', 'D': 'Ď', 'd': 'ď', 'E': 'Ě', 'e': 'ě',
    'L': 'Ľ', 'l': 'ľ', 'N': 'Ň', 'n': 'ň', 'R': 'Ř', 'r': 'ř',
    'S': 'Š', 's': 'š', 'T': 'Ť', 't': 'ť', 'Z': 'Ž', 'z': 'ž',
  },
  '´': {
    'A': 'Á', 'a': 'á', 'E': 'É', 'e': 'é', 'I': 'Í', 'i': 'í',
    'O': 'Ó', 'o': 'ó', 'U': 'Ú', 'u': 'ú', 'Y': 'Ý', 'y': 'ý',
  },
  '°': {},
};

const REVERSE_MAP: Record<string, { dead: string; base: string }> = {};
Object.entries(DIACRITIC_MAP).forEach(([dead, baseMap]) => {
  Object.entries(baseMap).forEach(([base, result]) => {
    REVERSE_MAP[result] = { dead, base };
  });
});

// Lowercase diacritics directly on number row (Shift+key): bypass dead key logic
const DIRECT_DIACRITIC_KEY: Record<string, string> = {
  'ě': '2', 'š': '3', 'č': '4', 'ř': '5', 'ž': '6', 'ý': '7', 'á': '8', 'í': '9', 'é': '0',
};

interface VirtualKeyboardProps {
  activeKey: string;
  wrongKeyFlash: string | null;
  pressedKeys?: Set<string>;
  pendingDeadKey: string | null;
}

function getKeyStyle(
  keyDef: KeyDef,
  activeKey: string,
  wrongKeyFlash: string | null,
  pressedKeys?: Set<string>,
  pendingDeadKey?: string | null
): React.CSSProperties {
  const directNumKey = DIRECT_DIACRITIC_KEY[activeKey];
  const hasDirectKey = DIRECT_KEYS.has(activeKey);
  const needsDiacritic = (!directNumKey && !hasDirectKey) ? REVERSE_MAP[activeKey] : undefined;
  const isUppercaseDiacritic = needsDiacritic && needsDiacritic.base === needsDiacritic.base.toUpperCase() && /[A-ZČĎĚĽŇŘŠŤŽÁÉÍÓÚÝ]/.test(needsDiacritic.base);

  let isTarget = false;
  let isShiftTarget = false;

  if (directNumKey) {
    // Lowercase diacritic directly on number row: highlight number key + Shift
    isTarget = keyDef.key === directNumKey;
    isShiftTarget = keyDef.key === 'ShiftLeft' || keyDef.key === 'ShiftRight';
  } else if (needsDiacritic) {
    if (pendingDeadKey) {
      // Second stage: highlight base letter (case-insensitively) and Shift if uppercase
      const baseKey = needsDiacritic.base.toLowerCase();
      isTarget = keyDef.key.toLowerCase() === baseKey;
      // Also highlight Shift when the target is an uppercase diacritic
      isShiftTarget = !!(isUppercaseDiacritic && (keyDef.key === 'ShiftLeft' || keyDef.key === 'ShiftRight'));
    } else {
      // First stage: highlight dead key
      isTarget = keyDef.key === needsDiacritic.dead ||
                 !!(keyDef.shift && keyDef.shift === needsDiacritic.dead);
    }
  } else {
    isTarget = keyDef.key === activeKey ||
               !!(keyDef.shift && keyDef.shift === activeKey) ||
               !!(keyDef.altChar && keyDef.altChar === activeKey);
    // Highlight Shift when the active key is an uppercase letter
    isShiftTarget = !!(activeKey.length === 1 && activeKey === activeKey.toUpperCase() && activeKey !== activeKey.toLowerCase() &&
      (keyDef.key === 'ShiftLeft' || keyDef.key === 'ShiftRight'));
  }
                    
  const isWrong = keyDef.key === wrongKeyFlash || 
                  !!(keyDef.shift && keyDef.shift === wrongKeyFlash);
  
  const isPressed = !!(pressedKeys?.has(keyDef.key) || 
                    pressedKeys?.has(keyDef.shift || '') ||
                    (keyDef.key === 'ShiftLeft' && pressedKeys?.has('Shift')) ||
                    (keyDef.key === 'ShiftRight' && pressedKeys?.has('Shift')));

  if (isWrong) {
    return {
      backgroundColor: '#ef4444',
      borderColor: '#f87171',
      color: '#ffffff',
      boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
    };
  }

  if (isPressed) {
    return {
      backgroundColor: '#4b5563',
      borderColor: '#8b5cf6',
      color: '#ffffff',
      boxShadow: '0 0 8px rgba(139, 92, 246, 0.4)',
    };
  }

  if (isTarget || isShiftTarget) {
    return {
      backgroundColor: isShiftTarget && !isTarget ? '#6d28d9' : '#8b5cf6',
      borderColor: '#a78bfa',
      color: '#ffffff',
      boxShadow: '0 0 12px rgba(139, 92, 246, 0.6)',
    };
  }

  const finger = keyFingerMap[keyDef.key] ?? keyFingerMap[keyDef.label];
  const fingerColor = finger ? fingerColors[finger] : null;

  if (fingerColor) {
    return {
      backgroundColor: fingerColor + '33',
      borderColor: fingerColor + '77',
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
  pressedKeys,
  pendingDeadKey,
}: VirtualKeyboardProps) {
  return (
    <div
      className="flex flex-col gap-1 p-4 rounded-xl select-none w-full"
      style={{ backgroundColor: '#222222' }}
    >
      {keyboardRows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-between gap-1">
          {row.map((keyDef, keyIndex) => {
            const style = getKeyStyle(keyDef, activeKey, wrongKeyFlash, pressedKeys, pendingDeadKey);
            const width = getKeyWidth(keyDef);

            const homingBumpColor = keyDef.key === 'f' ? fingerColors['left-index']
              : keyDef.key === 'j' ? fingerColors['right-index']
              : null;

            return (
              <div
                key={keyIndex}
                data-key={keyDef.key}
                className="flex items-center justify-center rounded border text-xs font-mono transition-all duration-100 cursor-default relative"
                style={{
                  width,
                  flex: keyDef.extraWide ? '4 1 0' : keyDef.wide ? '2 1 0' : '1 1 0',
                  height: '2.4rem',
                  fontSize: keyDef.extraWide ? '0.5rem' : '0.75rem',
                  userSelect: 'none',
                  ...style,
                }}
              >
                {homingBumpColor && (
                  <span
                    aria-hidden
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '40%',
                      height: '4px',
                      borderRadius: '2px',
                      backgroundColor: homingBumpColor,
                    }}
                  />
                )}
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
