/**
 * Pick which SpeechSynthesisVoice to use for an utterance.
 * Extracted so useSpeech.ts has no array-index access that triggers TS18048.
 */

export interface PickVoiceInput {
  preferredVoiceId: string | null;
  isPiper: (id: string | null) => boolean;
  sortedVoices: ReadonlyArray<{ voiceURI: string }>;
  allVoices: SpeechSynthesisVoice[];
}

/** Returns the native voice to assign to the utterance, or undefined to use default. */
export function pickVoiceForUtterance(input: PickVoiceInput): SpeechSynthesisVoice | undefined {
  const { preferredVoiceId, isPiper, sortedVoices, allVoices } = input;
  if (preferredVoiceId && !isPiper(preferredVoiceId) && sortedVoices.length > 0) {
    const v = allVoices.find((x) => x.voiceURI === preferredVoiceId);
    if (v) return v;
  }
  const first = sortedVoices[0];
  if (!first) return undefined;
  return allVoices.find((x) => x.voiceURI === first.voiceURI);
}
