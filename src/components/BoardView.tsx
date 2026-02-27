/**
 * Core AAC board: sentence strip + category nav + even grid of tiles.
 */

import { useBoardStore } from '@/store/useBoardStore';
import { useSpeech } from '@/hooks/useSpeech';
import { SentenceStrip } from './SentenceStrip';
import { CategoryNav } from './CategoryNav';
import { TileCell } from './TileCell';
import { BoardEditor } from './BoardEditor';
import { t } from '@/i18n';
import type { Tile } from '@/types';

export function BoardView() {
  const {
    board,
    currentCategoryId,
    sentenceStripTileIds,
    sentenceMode,
    appendToSentence,
    clearSentence,
    setCurrentCategoryId,
    getTilesForCurrentCategory,
    getTile,
    lowStimulation,
    setLastUtterance,
    preferredVoiceId,
    isCaregiverMode,
    lockNavInChildMode
  } = useBoardStore();

  const { speak } = useSpeech({
    preferredVoiceId,
    onVoiceUnavailable: (id) => {
      if (id === preferredVoiceId) useBoardStore.getState().setPreferredVoiceId(null);
    }
  });

  const tiles = getTilesForCurrentCategory();
  const categories = (board?.categoryIds ?? [])
    .map((id) => board?.categories[id] ?? null);

  const handleTileTap = (tile: Tile) => {
    const text = tile.speechText ?? tile.label;
    speak(text);
    setLastUtterance(text);
  };

  const handleSpeakSentence = (text: string) => {
    speak(text);
    setLastUtterance(text);
  };

  if (!board) {
    return (
      <div className="p-6 text-center text-aac-muted text-lg">
        {t('app.boardLoading')}
      </div>
    );
  }

  const cols = Math.min(4, Math.max(2, board.columns ?? 3));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4">
      <SentenceStrip
        tileIds={sentenceStripTileIds}
        getTile={getTile}
        onSpeakSentence={handleSpeakSentence}
        onClear={clearSentence}
      />

      <CategoryNav
        categories={categories}
        currentId={currentCategoryId}
        onSelect={setCurrentCategoryId}
        lowStimulation={lowStimulation}
        disabled={!isCaregiverMode && lockNavInChildMode}
      />

      <div
        className="grid gap-3 w-full"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`
        }}
        role="list"
        aria-label={t('board.tilesAria')}
      >
        {tiles.map((tile) => (
          <div key={tile.id} role="listitem" className="min-w-0">
            <TileCell
              tile={tile}
              onTap={handleTileTap}
              onAddToSentence={sentenceMode ? (tile) => appendToSentence(tile.id) : undefined}
              showSentenceStrip={sentenceMode}
              lowStimulation={lowStimulation}
            />
          </div>
        ))}
      </div>

      {isCaregiverMode && <BoardEditor />}
    </div>
  );
}
