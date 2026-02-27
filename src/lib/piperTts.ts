/**
 * Piper TTS – natural-sounding Romanian voice (ro_RO-mihai-medium).
 * Runs in-browser via ONNX; model downloaded on first use. Fallback to Web Speech if unavailable.
 */

import { unlockAudio } from '@/lib/audioUnlock';

export const PIPER_VOICE_ID = 'ro_RO-mihai-medium';
export const PIPER_PREFERRED_ID = `piper:${PIPER_VOICE_ID}`;

let piperModule: typeof import('@mintplex-labs/piper-tts-web') | null = null;
let loadPromise: Promise<boolean> | null = null;

export function isPiperVoiceId(voiceId: string | null): boolean {
  return voiceId === PIPER_PREFERRED_ID || (!!voiceId && voiceId.startsWith('piper:'));
}

export function getPiperVoiceIdFromPreferred(preferred: string | null): string | null {
  if (!preferred || !preferred.startsWith('piper:')) return null;
  return preferred.slice(7) || PIPER_VOICE_ID;
}

export async function loadPiper(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (loadPromise) return loadPromise;
  loadPromise = (async () => {
    try {
      piperModule = await import('@mintplex-labs/piper-tts-web');
      return true;
    } catch {
      return false;
    }
  })();
  return loadPromise;
}

export async function speakPiper(text: string, voiceId: string = PIPER_VOICE_ID): Promise<void> {
  const t = text.trim();
  if (!t) return;
  if (!piperModule) {
    const ok = await loadPiper();
    if (!ok || !piperModule) throw new Error('Piper TTS not available');
  }
  const wav = await piperModule.predict({
    text: t,
    voiceId
  });
  const url = URL.createObjectURL(wav);
  const audio = new Audio(url);
  return new Promise((resolve, reject) => {
    audio.onended = () => {
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    const doPlay = () =>
      audio.play().catch((err: unknown) => {
        const isBlocked =
          err instanceof Error &&
          (err.name === 'NotAllowedError' || (err as { code?: number }).code === 20);
        if (isBlocked) {
          unlockAudio();
          audio.play().catch(reject);
        } else {
          reject(err);
        }
      });
    doPlay();
  });
}
