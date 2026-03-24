// Create AudioContext eagerly at module load with minimum latency hint.
// Browsers allow creation before user gesture — context starts 'suspended'
// and is resumed on first interaction below.
const audioCtx: AudioContext | null = typeof AudioContext !== 'undefined'
  ? new AudioContext({ latencyHint: 'interactive' })
  : null;

let keyBuffer: AudioBuffer | null = null;
let keyStartOffset = 0;

// Start fetching and decoding the audio file immediately so the buffer
// is ready long before the user reaches the exercise screen.
if (audioCtx) {
  fetch('/key.mp3')
    .then(r => r.arrayBuffer())
    .then(ab => audioCtx.decodeAudioData(ab))
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

// Resume AudioContext on first user interaction (browser autoplay policy).
if (typeof window !== 'undefined') {
  const unlock = () => {
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
 * Play a silent buffer to warm up the audio pipeline.
 * Call once when the exercise screen mounts so the first real keystroke
 * doesn't pay the pipeline-startup cost.
 */
export function prewarmAudio() {
  if (!audioCtx || !keyBuffer) return;
  if (audioCtx.state === 'suspended') return;
  try {
    const silence = audioCtx.createBuffer(1, 1, audioCtx.sampleRate);
    const src = audioCtx.createBufferSource();
    src.buffer = silence;
    src.connect(audioCtx.destination);
    src.start(0);
  } catch (_) { /* ignore */ }
}

/**
 * Play the keyboard click sound immediately.
 * Call directly in keydown handlers — before any React state updates.
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
    source.start(0, keyStartOffset); // 0 = "as soon as possible"
  } catch (_) { /* ignore */ }
}

export function useSound() {
  return {
    playCorrect: playKeyAudio,
    playWrong: playKeyAudio,
  };
}
