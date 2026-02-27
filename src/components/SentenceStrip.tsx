/**
 * Sentence strip: shows appended words and speak/clear buttons. Romanian.
 */

import type { Tile } from '@/types';
import { t } from '@/i18n';

interface SentenceStripProps {
  tileIds: string[];
  getTile: (id: string) => Tile | undefined;
  onSpeakSentence: (text: string) => void;
  onClear: () => void;
}

export function SentenceStrip({ tileIds, getTile, onSpeakSentence, onClear }: SentenceStripProps) {
  const labels: string[] = [];
  const speechTexts: string[] = [];
  tileIds.forEach((id) => {
    const tile = getTile(id);
    if (tile) {
      labels.push(tile.label);
      speechTexts.push(tile.speechText ?? tile.label);
    }
  });
  const sentenceText = speechTexts.join(' ');

  const handleSpeak = () => {
    if (sentenceText) onSpeakSentence(sentenceText);
  };

  if (tileIds.length === 0) return null;

  return (
    <section
      className="flex flex-wrap items-center gap-3 p-4 bg-aac-primary text-white rounded-card mb-4 min-h-[56px]"
      aria-label={t('strip.aria')}
    >
      <span className="flex-1 flex flex-wrap gap-2 items-center">
        {labels.map((l, i) => (
          <span key={i} className="bg-white/20 px-3 py-1.5 rounded-button text-sm font-medium">
            {l}
          </span>
        ))}
      </span>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleSpeak}
          className="min-h-[44px] px-4 py-2 bg-white text-aac-primary font-semibold rounded-button focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={t('strip.speak')}
        >
          {t('strip.speak')}
        </button>
        <button
          type="button"
          onClick={onClear}
          className="min-h-[44px] px-4 py-2 border-2 border-white rounded-button focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          aria-label={t('strip.clear')}
        >
          {t('strip.clear')}
        </button>
      </div>
    </section>
  );
}
