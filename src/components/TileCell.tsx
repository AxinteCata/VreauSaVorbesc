/**
 * Single tile: fixed-size card, image/icon + label. Tap -> speak.
 * Even layout: aspect-square so grid stays professional.
 */

import type { Tile as TileType } from '@/types';

interface TileCellProps {
  tile: TileType;
  onTap: (tile: TileType) => void;
  onAddToSentence?: (tile: TileType) => void;
  showSentenceStrip?: boolean;
  lowStimulation?: boolean;
}

export function TileCell({
  tile,
  onTap,
  onAddToSentence,
  showSentenceStrip,
  lowStimulation
}: TileCellProps) {
  const speechText = tile.speechText ?? tile.label;
  const bg = tile.color ?? undefined;
  const visual = tile.imageUrl ? 'image' : tile.icon ? 'icon' : 'default';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (showSentenceStrip && onAddToSentence) {
      onAddToSentence(tile);
    } else {
      onTap(tile);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`
        flex flex-col items-center justify-center w-full aspect-square min-h-0
        p-3 rounded-card border-2 border-aac-border shadow-sm
        bg-white text-aac-primary font-semibold
        focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary focus-visible:ring-offset-2
        active:opacity-90
        ${lowStimulation ? '' : 'transition-transform active:scale-[0.98]'}
      `}
      style={bg ? { backgroundColor: bg } : undefined}
      aria-label={`${tile.label}. Spune: ${speechText}`}
    >
      <span className="flex-shrink-0 w-14 h-14 flex items-center justify-center mb-1.5">
        {visual === 'image' && tile.imageUrl ? (
          <img
            src={tile.imageUrl}
            alt=""
            className="w-full h-full object-contain"
            loading="lazy"
          />
        ) : visual === 'icon' && tile.icon ? (
          <span className="text-4xl select-none leading-none" aria-hidden>
            {tile.icon}
          </span>
        ) : (
          <span className="text-4xl select-none leading-none text-aac-muted" aria-hidden>
            💬
          </span>
        )}
      </span>
      <span className="text-center text-sm leading-tight break-words line-clamp-2 w-full">
        {tile.label}
      </span>
    </button>
  );
}
