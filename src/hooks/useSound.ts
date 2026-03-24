const ctx = typeof AudioContext !== 'undefined'
  ? new AudioContext({ latencyHint: 'interactive' })
  : null;

let buf: AudioBuffer | null = null;
let offset = 0;

if (ctx) {
  fetch('/key.wav')
    .then(r => r.arrayBuffer())
    .then(ab => ctx.decodeAudioData(ab))
    .then(decoded => {
      const ch = decoded.getChannelData(0);
      for (let i = 0; i < ch.length; i++) {
        if (Math.abs(ch[i]) > 0.005) {
          offset = Math.max(0, i - 128) / decoded.sampleRate;
          break;
        }
      }
      buf = decoded;
    });
}

if (typeof window !== 'undefined') {
  const resume = () => ctx?.resume();
  window.addEventListener('mousedown', resume, { once: true });
  window.addEventListener('keydown', resume, { once: true });
  window.addEventListener('touchstart', resume, { once: true });
}

export function playKeyAudio() {
  if (!ctx || !buf || ctx.state !== 'running') return;
  const s = ctx.createBufferSource();
  s.buffer = buf;
  s.playbackRate.value = 0.97 + Math.random() * 0.06;
  s.connect(ctx.destination);
  s.start(0, offset);
}

export const prewarmAudio = () => {};
export const useSound = () => ({ playCorrect: playKeyAudio, playWrong: playKeyAudio });
