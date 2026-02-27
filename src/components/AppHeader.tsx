/**
 * App header: child mode (minimal) vs caregiver mode (full toggles). Romanian.
 */

import { useBoardStore } from '@/store/useBoardStore';
import { useSpeech } from '@/hooks/useSpeech';
import { t } from '@/i18n';

interface AppHeaderProps {
  onOpenCredits?: () => void;
  onOpenSettings?: () => void;
}

export function AppHeader(_props: AppHeaderProps) {
  const {
    board,
    isCaregiverMode,
    caregiverPin,
    lockNavInChildMode,
    sentenceMode,
    lowStimulation,
    setSentenceMode,
    setLowStimulation,
    setLockNavInChildMode,
    enterCaregiverMode,
    exitCaregiverMode,
    setShowPinDialog,
    preferredVoiceId,
    lastUtterance
  } = useBoardStore();
  const { speak } = useSpeech({
    preferredVoiceId,
    onVoiceUnavailable: (id) => {
      if (id === preferredVoiceId) useBoardStore.getState().setPreferredVoiceId(null);
    }
  });
  const handleRepeat = () => {
    if (lastUtterance) speak(lastUtterance);
  };

  const handleEnterCaregiver = () => {
    if (caregiverPin != null && caregiverPin !== '') {
      setShowPinDialog(true);
    } else {
      enterCaregiverMode();
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-aac-primary text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold truncate flex-1 min-w-0" id="app-title">
          {board?.name ?? t('app.title')}
        </h1>

        <button
          type="button"
          onClick={handleRepeat}
          disabled={!lastUtterance}
          className="min-h-[44px] px-4 py-2 bg-white/20 rounded-button text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t('header.repeatTitle')}
          title={t('header.repeatTitle')}
        >
          {t('header.repeat')}
        </button>

        {!isCaregiverMode ? (
          <button
            type="button"
            onClick={handleEnterCaregiver}
            className="min-h-[44px] px-4 py-2 bg-white/20 rounded-button text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            aria-label={t('header.caregiverEnter')}
          >
            {t('header.caregiver')}
          </button>
        ) : (
          <>
            <label className="flex items-center gap-2 text-sm min-h-[44px] cursor-pointer">
              <input
                type="checkbox"
                checked={sentenceMode}
                onChange={(e) => setSentenceMode(e.target.checked)}
                className="rounded border-gray-300 w-4 h-4"
                aria-label={t('header.sentenceMode')}
              />
              <span>{t('header.sentence')}</span>
            </label>
            <label className="flex items-center gap-2 text-sm min-h-[44px] cursor-pointer">
              <input
                type="checkbox"
                checked={lowStimulation}
                onChange={(e) => setLowStimulation(e.target.checked)}
                className="rounded border-gray-300 w-4 h-4"
                aria-label={t('header.lowStimulation')}
              />
              <span>{t('header.calm')}</span>
            </label>
            <label className="flex items-center gap-2 text-sm min-h-[44px] cursor-pointer">
              <input
                type="checkbox"
                checked={lockNavInChildMode}
                onChange={(e) => setLockNavInChildMode(e.target.checked)}
                className="rounded border-gray-300 w-4 h-4"
                aria-label={t('header.lockNavInChild')}
              />
              <span>{t('header.lockNav')}</span>
            </label>
            <button
              type="button"
              onClick={() => exitCaregiverMode()}
              className="min-h-[44px] px-4 py-2 bg-white/20 rounded-button text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={t('header.childModeSwitch')}
            >
              {t('header.childMode')}
            </button>
          </>
        )}
      </div>
    </header>
  );
}
