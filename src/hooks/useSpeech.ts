/**
 * TTS: Piper (natural Romanian) when selected, else Web Speech API.
 * Romanian (ro-RO) by default; voices sorted so Romanian and natural options appear first.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getPiperVoiceIdFromPreferred,
  isPiperVoiceId,
  speakPiper
} from '@/lib/piperTts';

export interface SpeechVoice {
  default: boolean;
  lang: string;
  localService: boolean;
  name: string;
  voiceURI: string;
}

function getVoicesList(synth: SpeechSynthesis): SpeechVoice[] {
  const list = synth.getVoices();
  return list.map((v) => ({
    default: v.default,
    lang: v.lang,
    localService: v.localService,
    name: v.name,
    voiceURI: v.voiceURI
  }));
}

/** Prefer Romanian and names that often indicate more natural voices (Google, Microsoft, Natural). */
function sortVoices(voices: SpeechVoice[]): SpeechVoice[] {
  const ro = (v: SpeechVoice) =>
    v.lang.startsWith('ro');
  const score = (v: SpeechVoice) => {
    let s = 0;
    if (ro(v)) s += 1000;
    const n = (v.name || '').toLowerCase();
    if (n.includes('google')) s += 100;
    if (n.includes('microsoft') || n.includes('natural')) s += 80;
    if (n.includes('online') || n.includes('premium')) s += 50;
    return s;
  };
  return [...voices].sort((a, b) => score(b) - score(a));
}

export function useSpeech(options?: {
  preferredVoiceId: string | null;
  onVoiceUnavailable?: (voiceId: string) => void;
}) {
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechVoice[]>([]);
  const [voicesReady, setVoicesReady] = useState(false);
  const [piperReady, setPiperReady] = useState(false);
  const preferredVoiceId = options?.preferredVoiceId ?? null;
  const onVoiceUnavailable = options?.onVoiceUnavailable;

  const refreshVoices = useCallback(() => {
    const synth = window.speechSynthesis ?? null;
    if (!synth) return;
    const list = getVoicesList(synth);
    setVoices(sortVoices(list));
    setVoicesReady(list.length > 0);
    if (preferredVoiceId && !isPiperVoiceId(preferredVoiceId) && list.length > 0) {
      const found = list.some((v) => v.voiceURI === preferredVoiceId);
      if (!found && onVoiceUnavailable) {
        onVoiceUnavailable(preferredVoiceId);
      }
    }
  }, [preferredVoiceId, onVoiceUnavailable]);

  useEffect(() => {
    const synth = window.speechSynthesis ?? null;
    if (!synth) return;
    synthRef.current = synth;
    refreshVoices();
    synth.addEventListener('voiceschanged', refreshVoices);
    return () => synth.removeEventListener('voiceschanged', refreshVoices);
  }, [refreshVoices]);

  const speak = useCallback(
    async (text: string, lang = 'ro-RO') => {
      const t = text.trim();
      if (!t) return;
      const usePiper = isPiperVoiceId(preferredVoiceId);
      const piperId = getPiperVoiceIdFromPreferred(preferredVoiceId);
      if (usePiper && piperId) {
        try {
          setPiperReady(true);
          await speakPiper(t, piperId);
          return;
        } catch {
          setPiperReady(false);
          // fall through to Web Speech
        }
      }
      const synth = synthRef.current ?? window.speechSynthesis ?? null;
      if (!synth) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = lang;
      u.rate = 0.95;
      u.pitch = 1;
      if (preferredVoiceId && !isPiperVoiceId(preferredVoiceId) && voices.length > 0) {
        const voice = voices.find((v) => v.voiceURI === preferredVoiceId);
        if (voice) {
          const nativeVoice = synth.getVoices().find((v) => v.voiceURI === preferredVoiceId);
          if (nativeVoice) u.voice = nativeVoice;
        }
      } else if (voices.length > 0) {
        const romanian = synth.getVoices().find((v) => v.lang.startsWith('ro'));
        if (romanian) u.voice = romanian;
      }
      synth.speak(u);
    },
    [preferredVoiceId, voices]
  );

  const stop = useCallback(() => {
    if (synthRef.current) synthRef.current.cancel();
  }, []);

  return {
    speak,
    stop,
    voices,
    voicesReady,
    piperReady
  };
}
