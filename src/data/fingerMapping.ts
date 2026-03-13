export type Finger =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky'
  | 'thumb';

export const fingerColors: Record<Finger, string> = {
  'left-pinky': '#ec4899',   // pink
  'left-ring': '#f97316',    // orange
  'left-middle': '#eab308',  // yellow
  'left-index': '#22c55e',   // green
  'right-index': '#06b6d4',  // cyan
  'right-middle': '#3b82f6', // blue
  'right-ring': '#8b5cf6',   // purple
  'right-pinky': '#d946ef',  // magenta
  'thumb': '#6b7280',        // gray
};

export const keyFingerMap: Record<string, Finger> = {
  // Number row
  '°': 'left-pinky', '1': 'left-pinky', '+': 'left-pinky',
  '2': 'left-ring', 'ě': 'left-ring',
  '3': 'left-middle', 'š': 'left-middle',
  '4': 'left-index', 'č': 'left-index',
  '5': 'left-index', 'ř': 'left-index',
  '6': 'right-index', 'ž': 'right-index',
  '7': 'right-index', 'ý': 'right-index',
  '8': 'right-middle', 'á': 'right-middle',
  '9': 'right-ring', 'í': 'right-ring',
  '0': 'right-pinky', 'é': 'right-pinky',
  '%': 'right-pinky', '=': 'right-pinky',
  'ˇ': 'right-pinky', '´': 'right-pinky',
  // Top row
  'q': 'left-pinky', 'w': 'left-ring', 'e': 'left-middle',
  'r': 'left-index', 't': 'left-index',
  'z': 'right-index', 'u': 'right-index',
  'i': 'right-middle', 'o': 'right-ring',
  'p': 'right-pinky', 'ú': 'right-pinky', ')': 'right-pinky',
  // Home row
  'a': 'left-pinky', 's': 'left-ring', 'd': 'left-middle',
  'f': 'left-index', 'g': 'left-index',
  'h': 'right-index', 'j': 'right-index',
  'k': 'right-middle', 'l': 'right-ring',
  'ů': 'right-pinky', '§': 'right-pinky',
  // Bottom row
  'y': 'left-pinky', 'x': 'left-ring', 'c': 'left-middle',
  'v': 'left-index', 'b': 'left-index',
  'n': 'right-index', 'm': 'right-index',
  ',': 'right-middle', '.': 'right-ring', '-': 'right-pinky',
  // Space
  ' ': 'thumb',
};
