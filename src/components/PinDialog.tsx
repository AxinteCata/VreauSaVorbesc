/**
 * PIN entry to enter caregiver mode. Stored locally only. Romanian.
 */

import { useState, useRef, useEffect } from 'react';
import { t } from '@/i18n';

interface PinDialogProps {
  onSubmit: (pin: string) => boolean;
  onCancel: () => void;
}

export function PinDialog({ onSubmit, onCancel }: PinDialogProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (onSubmit(pin)) {
      setPin('');
    } else {
      setError(t('pin.incorrect'));
      setPin('');
      inputRef.current?.focus();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-labelledby="pin-dialog-title"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <h2 id="pin-dialog-title" className="text-lg font-semibold text-aac-primary mb-2">
          {t('pin.title')}
        </h2>
        <p className="text-sm text-aac-muted mb-3">
          {t('pin.hint')}
        </p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full p-3 border-2 border-aac-border rounded-button mb-3"
            aria-label={t('pin.placeholder')}
            placeholder={t('pin.placeholder')}
          />
          {error && <p className="text-red-600 text-sm mb-2" role="alert">{error}</p>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 min-h-[44px] py-2 border-2 border-aac-border rounded-button font-medium"
            >
              {t('pin.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 min-h-[44px] py-2 bg-aac-primary text-white rounded-button font-medium"
            >
              {t('pin.enter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
