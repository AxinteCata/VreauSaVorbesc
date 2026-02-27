/**
 * PWA install prompt: beforeinstallprompt and standalone detection.
 * No backend; install is handled by the browser.
 */

import { useEffect, useState } from 'react';

export interface InstallPromptState {
  installable: boolean;
  prompt: (() => Promise<void>) | null;
  isStandalone: boolean;
}

export function useInstallPrompt(): InstallPromptState {
  const [installable, setInstallable] = useState(false);
  const [promptFn, setPromptFn] = useState<(() => Promise<void>) | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const ev = e as unknown as { prompt: () => Promise<{ outcome: string }> };
      setPromptFn(() => async () => {
        if (!ev.prompt) return;
        await ev.prompt();
        setInstallable(false);
        setPromptFn(null);
      });
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  return { installable, prompt: promptFn, isStandalone };
}
