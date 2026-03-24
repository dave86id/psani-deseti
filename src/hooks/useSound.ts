import { useEffect } from 'react';

// Singletons for the entire app to ensure zero latency
let audioCtx: AudioContext | null = null;
let keyBuffer: AudioBuffer | null = null;
let keyStartOffset = 0;

/**
 * Initialize audio on the first user interaction to avoid 'suspended' state.
 */
function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioContext();
  
  // Pre-load the key sound
  fetch('/key.mp3')
    .then(r => r.arrayBuffer())
    .then(ab => audioCtx!.decodeAudioData(ab))
    .then(decoded => {
      // Find first sample above silence threshold to skip leading silence
      const data = decoded.getChannelData(0);
      const threshold = 0.01;
      let startSample = 0;
      for (let i = 0; i < data.length; i++) {
        if (Math.abs(data[i]) > threshold) {
          startSample = Math.max(0, i - Math.floor(decoded.sampleRate * 0.002));
          break;
        }
      }
      keyStartOffset = startSample / decoded.sampleRate;
      keyBuffer = decoded;
    })
    .catch(err => console.error('Failed to load sound', err));
}

// Global listeners to initialize and unlock AudioContext on first user interaction
if (typeof window !== 'undefined') {
  const unlock = () => {
    initAudio(); // Create AudioContext + start loading buffer on first interaction
    if (audioCtx?.state === 'suspended') {
      audioCtx.resume();
    }
    window.removeEventListener('keydown', unlock);
    window.removeEventListener('mousedown', unlock);
    window.removeEventListener('touchstart', unlock);
  };
  window.addEventListener('keydown', unlock);
  window.addEventListener('mousedown', unlock);
  window.addEventListener('touchstart', unlock);
}

/**
 * Play the keyboard click sound immediately. 
 * Can be called from anywhere, ideally directly in keydown handlers.
 */
export function playKeyAudio() {
  if (!audioCtx || !keyBuffer) return;
  
  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const source = audioCtx.createBufferSource();
    source.buffer = keyBuffer;
    source.playbackRate.value = 0.97 + Math.random() * 0.06;
    source.connect(audioCtx.destination);
    source.start(audioCtx.currentTime, keyStartOffset);
  } catch (e) {
    // Silently fail if overlapping sounds or context issues
  }
}

export function useSound() {
  useEffect(() => {
    initAudio();
  }, []);

  return { 
    playCorrect: playKeyAudio, 
    playWrong: playKeyAudio 
  };
}
