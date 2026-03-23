import { useRef, useCallback, useEffect } from 'react';

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sampleBufferRef = useRef<AudioBuffer | null>(null);
  const soundStartOffsetRef = useRef<number>(0);

  const getAudioCtx = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    return audioCtxRef.current;
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch('/key.mp3')
      .then(r => r.arrayBuffer())
      .then(ab => getAudioCtx().decodeAudioData(ab))
      .then(decoded => {
        if (cancelled) return;

        // Find first sample above silence threshold to skip leading silence
        const data = decoded.getChannelData(0);
        const threshold = 0.01;
        let startSample = 0;
        for (let i = 0; i < data.length; i++) {
          if (Math.abs(data[i]) > threshold) {
            // Step back a tiny bit to catch the attack
            startSample = Math.max(0, i - Math.floor(decoded.sampleRate * 0.002));
            break;
          }
        }
        soundStartOffsetRef.current = startSample / decoded.sampleRate;
        sampleBufferRef.current = decoded;
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [getAudioCtx]);

  const playKey = useCallback(() => {
    try {
      const ctx = getAudioCtx();
      const buf = sampleBufferRef.current;
      if (!buf) return;

      const source = ctx.createBufferSource();
      source.buffer = buf;
      source.playbackRate.value = 0.97 + Math.random() * 0.06; // slight pitch variation

      const gain = ctx.createGain();
      gain.gain.value = 0.9;

      source.connect(gain);
      gain.connect(ctx.destination);

      source.start(ctx.currentTime, soundStartOffsetRef.current);
    } catch (error) {
      console.warn('Failed to play sound', error);
    }
  }, [getAudioCtx]);

  return { playCorrect: playKey, playWrong: playKey };
}
