/**
 * PWA UI: offline indicator and install prompt. Romanian.
 */

import { useState } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { t } from '@/i18n';

export function PwaUI() {
  const online = useOnlineStatus();
  const { installable, prompt, isStandalone } = useInstallPrompt();
  const [dismissInstall, setDismissInstall] = useState(false);

  const showInstallBanner = installable && !isStandalone && !dismissInstall;

  return (
    <>
      {/* Offline indicator: fixed top-right */}
      {!online && (
        <div
          className="fixed top-14 right-4 z-40 px-3 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg shadow-lg flex items-center gap-2"
          role="status"
          aria-live="polite"
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" aria-hidden />
          {t('pwa.offline')}
        </div>
      )}

      {showInstallBanner && (
        <div
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-40 p-4 bg-aac-primary text-white rounded-card shadow-lg flex flex-col gap-3"
          role="dialog"
          aria-labelledby="install-title"
        >
          <h2 id="install-title" className="font-semibold">
            {t('pwa.installTitle')}
          </h2>
          <p className="text-sm text-white/90">
            {t('pwa.installDesc')}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => prompt?.()}
              className="flex-1 min-h-[44px] px-4 py-2 bg-white text-aac-primary font-semibold rounded-button"
            >
              {t('pwa.install')}
            </button>
            <button
              type="button"
              onClick={() => setDismissInstall(true)}
              className="min-h-[44px] px-4 py-2 border-2 border-white/60 rounded-button text-sm"
            >
              {t('pwa.notNow')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
