/**
 * AAC App root: load board, render header + board view. Romanian UI.
 */

import { useEffect, useState } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { AppHeader } from '@/components/AppHeader';
import { BoardView } from '@/components/BoardView';
import { Credits } from '@/components/Credits';
import { Settings } from '@/components/Settings';
import { PinDialog } from '@/components/PinDialog';
import { PwaUI } from '@/components/PwaUI';
import { t } from '@/i18n';

export default function App() {
  const { loadOrCreateSeed, loaded, showPinDialog, enterCaregiverMode, setShowPinDialog, isCaregiverMode } = useBoardStore();
  const [showCredits, setShowCredits] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadOrCreateSeed();
  }, [loadOrCreateSeed]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-aac-surface flex items-center justify-center p-4">
        <p className="text-aac-muted text-lg">{t('app.loading')}</p>
      </div>
    );
  }

  if (showCredits) {
    return (
      <div className="min-h-screen bg-aac-surface flex flex-col">
        <Credits onBack={() => setShowCredits(false)} />
      </div>
    );
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-aac-surface flex flex-col">
        <Settings
          onBack={() => setShowSettings(false)}
          onOpenCredits={() => {
            setShowSettings(false);
            setShowCredits(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aac-surface flex flex-col">
      <PwaUI />
      {showPinDialog && (
        <PinDialog
          onSubmit={(pin) => enterCaregiverMode(pin)}
          onCancel={() => setShowPinDialog(false)}
        />
      )}
      <AppHeader
        onOpenCredits={() => setShowCredits(true)}
        onOpenSettings={() => setShowSettings(true)}
      />
      <main className="flex-1 overflow-auto" aria-label="AAC board">
        <BoardView />
      </main>
      {isCaregiverMode && (
        <footer className="py-4 px-4 text-center text-sm text-aac-muted flex flex-wrap justify-center gap-6">
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="min-h-[44px] px-4 py-2 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary rounded-button"
          >
            {t('footer.settings')}
          </button>
          <button
            type="button"
            onClick={() => setShowCredits(true)}
            className="min-h-[44px] px-4 py-2 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary rounded-button"
          >
            {t('footer.credits')}
          </button>
        </footer>
      )}
    </div>
  );
}
