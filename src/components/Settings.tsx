/**
 * Settings: TTS voice, Caregiver PIN. Romanian.
 */

import { useState } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { useSpeech } from '@/hooks/useSpeech';
import { PIPER_PREFERRED_ID } from '@/lib/piperTts';
import { t } from '@/i18n';

interface SettingsProps {
  onBack: () => void;
  onOpenCredits?: () => void;
}

export function Settings({ onBack, onOpenCredits }: SettingsProps) {
  const { preferredVoiceId, setPreferredVoiceId, caregiverPin, setCaregiverPin } = useBoardStore();
  const [pinInput, setPinInput] = useState('');
  const hasPin = caregiverPin != null && caregiverPin !== '';
  const { voices, voicesReady, speak } = useSpeech({
    preferredVoiceId,
    onVoiceUnavailable: (id) => {
      if (id === preferredVoiceId) setPreferredVoiceId(null);
    }
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] text-aac-primary font-medium underline focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary rounded-button"
        >
          ← {t('settings.back')}
        </button>
        <h1 className="text-2xl font-bold text-aac-primary">{t('settings.title')}</h1>
      </div>

      <section className="mb-6" aria-labelledby="voice-label">
        <h2 id="voice-label" className="text-lg font-semibold text-aac-primary mb-2">
          {t('settings.voice')}
        </h2>
        <p className="text-sm text-aac-muted mb-2">
          {t('settings.voiceHint')}
        </p>
        {!voicesReady && (
          <p className="text-sm text-aac-muted mb-2">{t('settings.voiceLoading')}</p>
        )}
        <select
          value={preferredVoiceId ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            setPreferredVoiceId(v || null);
          }}
          className="w-full max-w-md p-3 border-2 border-aac-border rounded-button bg-white text-aac-primary font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary"
          aria-label={t('settings.voice')}
        >
          <option value="">{t('settings.voiceDefault')}</option>
          <option value={PIPER_PREFERRED_ID}>{t('settings.voiceNatural')}</option>
          {voices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} {v.lang ? `(${v.lang})` : ''}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => speak(t('settings.voiceSampleText'))}
          className="mt-3 min-h-[44px] px-4 py-2 bg-aac-primary text-white rounded-button text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary"
          aria-label={t('settings.voiceSample')}
        >
          {t('settings.voiceSample')}
        </button>
      </section>

      <section className="mb-6" aria-labelledby="pin-label">
        <h2 id="pin-label" className="text-lg font-semibold text-aac-primary mb-2">
          {t('settings.pin')}
        </h2>
        <p className="text-sm text-aac-muted mb-2">
          {t('settings.pinHint')}
        </p>
        {hasPin ? (
          <p className="text-sm text-aac-muted mb-2">{t('settings.pinSet')}</p>
        ) : null}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder={hasPin ? t('settings.pinPlaceholderSet') : t('settings.pinPlaceholderNew')}
            className="p-3 border-2 border-aac-border rounded-button w-32 min-h-[44px]"
            aria-label={t('settings.pin')}
          />
          <button
            type="button"
            onClick={() => {
              const v = pinInput.trim();
              setCaregiverPin(v || null);
              setPinInput('');
            }}
            className="min-h-[44px] px-4 py-2 bg-aac-primary text-white rounded-button text-sm font-medium"
          >
            {hasPin ? t('settings.pinChangeButton') : t('settings.pinSetButton')}
          </button>
          {hasPin && (
            <button
              type="button"
              onClick={() => {
                setCaregiverPin(null);
                setPinInput('');
              }}
              className="min-h-[44px] px-4 py-2 border-2 border-aac-border rounded-button text-sm"
            >
              {t('settings.pinRemove')}
            </button>
          )}
        </div>
      </section>

      {onOpenCredits && (
        <section className="mb-6" aria-labelledby="credits-link">
          <h2 id="credits-link" className="text-lg font-semibold text-aac-primary mb-2">
            {t('settings.about')}
          </h2>
          <button
            type="button"
            onClick={onOpenCredits}
            className="min-h-[44px] text-aac-primary font-medium underline focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary rounded-button"
          >
            {t('settings.credits')}
          </button>
        </section>
      )}
    </div>
  );
}
