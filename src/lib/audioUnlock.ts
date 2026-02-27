/**
 * Unlock audio on mobile: browsers block programmatic playback until
 * the user has interacted. We resume an AudioContext and play a
 * silent buffer so Web Speech and HTML Audio work on Android/iOS.
 */

let unlocked = false;
let audioContext: AudioContext | null = null;

export function isAudioUnlocked(): boolean {
  return unlocked;
}

/**
 * Call this synchronously from a user gesture (click/touch).
 * Idempotent; safe to call multiple times.
 */
export function unlockAudio(): void {
  if (typeof window === 'undefined') return;
  if (unlocked) return;

  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      audioContext = audioContext || new Ctx();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      // Play a short silent buffer so Android Chrome allows subsequent audio
      const buf = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
      const src = audioContext.createBufferSource();
      src.buffer = buf;
      src.connect(audioContext.destination);
      src.start(0);
    }

    // Also try silent HTML Audio (helps some iOS versions)
    const silentWav =
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    const silent = new Audio(silentWav);
    const p = silent.play();
    if (p && typeof p.then === 'function') {
      p.catch(() => {});
    }
    unlocked = true;
  } catch {
    // Ignore; we may still be able to play later
  }
}

/**
 * Call from app mount to unlock on first user interaction (any tap/click).
 */
export function registerUnlockOnFirstInteraction(): void {
  if (typeof document === 'undefined') return;

  const run = () => {
    unlockAudio();
    document.removeEventListener('click', run, true);
    document.removeEventListener('touchstart', run, true);
  };

  document.addEventListener('click', run, { capture: true, once: true });
  document.addEventListener('touchstart', run, { capture: true, once: true });
}
