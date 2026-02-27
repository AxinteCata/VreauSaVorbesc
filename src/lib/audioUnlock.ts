/**
 * Unlock audio on mobile: browsers block programmatic playback until
 * the user has interacted. We resume an AudioContext and/or play a
 * silent sound on first user gesture so Piper TTS and Web Speech work.
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
    // Resume/create AudioContext so Web Audio is allowed on iOS/Android
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      audioContext = audioContext || new Ctx();
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
    }

    // Play a silent buffer so HTMLAudioElement playback is allowed
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
