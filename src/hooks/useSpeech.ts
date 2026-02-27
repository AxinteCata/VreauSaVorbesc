/**
 * TTS: Piper (natural Romanian) when selected, else Web Speech API.
 * On mobile we use Web Speech only so audio runs in the same user gesture (required on Android/iOS).
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { isMobileOrTouch } from '@/lib/device';
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

/** Prefer Romanian; then default/local; then natural-sounding (Siri, enhanced, Google, etc.). */
function sortVoices(voices: SpeechVoice[]): SpeechVoice[] {
  const ro = (v: SpeechVoice) => v.lang.startsWith('ro');
  const score = (v: SpeechVoice) => {
    let s = 0;
    if (ro(v)) s += 1000;
    if (v.default) s += 500;
    if (v.localService) s += 200;
    const n = (v.name || '').toLowerCase();
    if (n.includes('siri') || n.includes('ioana') || n.includes('enhanced')) s += 150;
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
      const synth = synthRef.current ?? window.speechSynthesis ?? null;
      if (!synth) return;

      // On mobile, use Web Speech only so speak() runs in the same user gesture (required on Android Chrome / iOS).
      const usePiper =
        !isMobileOrTouch() &&
        isPiperVoiceId(preferredVoiceId) &&
        !!getPiperVoiceIdFromPreferred(preferredVoiceId);

      if (usePiper) {
        try {
          setPiperReady(true);
          await speakPiper(t, getPiperVoiceIdFromPreferred(preferredVoiceId)!);
          return;
        } catch {
          setPiperReady(false);
          // fall through to Web Speech
        }
      }

      synth.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = lang;
      u.rate = 0.95;
      u.pitch = 1;
      const allVoices = synth.getVoices();
      if (preferredVoiceId && !isPiperVoiceId(preferredVoiceId) && voices.length > 0) {
        const nativeVoice = allVoices.find((v) => v.voiceURI === preferredVoiceId);
        if (nativeVoice) u.voice = nativeVoice;
      } else if (voices.length > 0) {
        const best = voices[0];
        const nativeVoice = allVoices.find((v) => v.voiceURI === best.voiceURI);
        if (nativeVoice) u.voice = nativeVoice;
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
