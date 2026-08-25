import { useSyncExternalStore } from 'react';

const KEYBOARD_KEY = 'psani-deseti-keyboard';

let keyboardVisible = (() => {
  try {
    return localStorage.getItem(KEYBOARD_KEY) !== 'off';
  } catch {
    return true;
  }
})();

const listeners = new Set<() => void>();

export function setKeyboardVisible(visible: boolean) {
  keyboardVisible = visible;
  try {
    localStorage.setItem(KEYBOARD_KEY, visible ? 'on' : 'off');
  } catch {
    // ignore
  }
  listeners.forEach(l => l());
}

export function useKeyboardVisible() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    () => keyboardVisible,
  );
}
