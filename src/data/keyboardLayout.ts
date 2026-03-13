import type { KeyDef } from '../types';

export const keyboardRows: KeyDef[][] = [
  // Number row
  [
    { label: '°', key: '°', shift: '`' },
    { label: '1', key: '1', shift: '+', altChar: '+' },
    { label: '2', key: '2', shift: 'ě', altChar: 'ě' },
    { label: '3', key: '3', shift: 'š', altChar: 'š' },
    { label: '4', key: '4', shift: 'č', altChar: 'č' },
    { label: '5', key: '5', shift: 'ř', altChar: 'ř' },
    { label: '6', key: '6', shift: 'ž', altChar: 'ž' },
    { label: '7', key: '7', shift: 'ý', altChar: 'ý' },
    { label: '8', key: '8', shift: 'á', altChar: 'á' },
    { label: '9', key: '9', shift: 'í', altChar: 'í' },
    { label: '0', key: '0', shift: 'é', altChar: 'é' },
    { label: '%', key: '%', shift: '=' },
    { label: 'ˇ', key: 'ˇ', shift: '´' },
    { label: '⌫', key: 'Backspace', wide: true },
  ],
  // Top row
  [
    { label: 'Tab', key: 'Tab', wide: true },
    { label: 'q', key: 'q' },
    { label: 'w', key: 'w' },
    { label: 'e', key: 'e' },
    { label: 'r', key: 'r' },
    { label: 't', key: 't' },
    { label: 'z', key: 'z' },
    { label: 'u', key: 'u' },
    { label: 'i', key: 'i' },
    { label: 'o', key: 'o' },
    { label: 'p', key: 'p' },
    { label: 'ú', key: 'ú' },
    { label: ')', key: ')' },
    { label: '¨', key: '¨', wide: true },
  ],
  // Home row
  [
    { label: 'Caps', key: 'CapsLock', wide: true },
    { label: 'a', key: 'a' },
    { label: 's', key: 's' },
    { label: 'd', key: 'd' },
    { label: 'f', key: 'f' },
    { label: 'g', key: 'g' },
    { label: 'h', key: 'h' },
    { label: 'j', key: 'j' },
    { label: 'k', key: 'k' },
    { label: 'l', key: 'l' },
    { label: 'ů', key: 'ů' },
    { label: '§', key: '§' },
    { label: '⏎', key: 'Enter', wide: true },
  ],
  // Bottom row
  [
    { label: 'Shift', key: 'ShiftLeft', wide: true },
    { label: 'y', key: 'y' },
    { label: 'x', key: 'x' },
    { label: 'c', key: 'c' },
    { label: 'v', key: 'v' },
    { label: 'b', key: 'b' },
    { label: 'n', key: 'n' },
    { label: 'm', key: 'm' },
    { label: ',', key: ',' },
    { label: '.', key: '.' },
    { label: '-', key: '-' },
    { label: 'Shift', key: 'ShiftRight', wide: true },
  ],
  // Space row
  [
    { label: ' ', key: ' ', extraWide: true },
  ],
];
