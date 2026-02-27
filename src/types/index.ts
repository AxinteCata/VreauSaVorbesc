/**
 * AAC App – Data model
 * Board = top-level container. Category = folder/page of tiles. Tile = one tap-to-speak cell.
 */

export type Id = string;

/** Single tap-to-speak tile on a board */
export interface Tile {
  id: Id;
  /** Display label (e.g. "Water", "I need a break") */
  label: string;
  /** Optional: emoji or symbol (royalty-free visual for neurodivergent users). Shown when no imageUrl. */
  icon?: string | null;
  /** Optional: image URL (data URL or blob URL from upload). Overrides icon when set. */
  imageUrl?: string | null;
  /** Text spoken when tile is tapped. Defaults to label if not set. */
  speechText?: string | null;
  /** Background color for the tile (hex or CSS color) */
  color?: string | null;
  /** Hide from child view (caregiver-only) */
  hidden?: boolean;
  /** Lock tile from editing in caregiver mode */
  locked?: boolean;
  /** Optional: link to another board (category) id for navigation */
  linkBoardId?: Id | null;
  /** Order within category (lower = first) */
  order: number;
}

/** Category / folder: a page of tiles, or a sub-board */
export interface Category {
  id: Id;
  /** Display name (e.g. "Needs", "Feelings") */
  name: string;
  /** Tiles on this page */
  tileIds: Id[];
  /** Order among siblings (lower = first) */
  order: number;
  /** Optional icon/emoji for nav */
  icon?: string | null;
}

/** Top-level board: owns categories and tiles */
export interface Board {
  id: Id;
  /** Board title */
  name: string;
  /** Grid columns (number of tiles per row) */
  columns: number;
  /** Grid rows (optional; can be derived from tile count) */
  rows?: number;
  /** Root categories (top-level pages) */
  categoryIds: Id[];
  /** All categories in this board (flat or nested by convention) */
  categories: Record<Id, Category>;
  /** All tiles (shared across categories; tileIds in category reference these) */
  tiles: Record<Id, Tile>;
  /** Created/updated for export */
  updatedAt: number;
}

/** In-memory app state: current board, current category, sentence strip */
export interface AppState {
  currentBoardId: Id | null;
  currentCategoryId: Id | null;
  /** Sentence strip: ordered list of tile ids (speech texts concatenated on "Speak sentence") */
  sentenceStripTileIds: Id[];
  /** Lock mode: hide editor and reduce nav (child-friendly) */
  lockMode: boolean;
  /** Low stimulation: no animations, optional dark mode */
  lowStimulation: boolean;
  darkMode: boolean;
}

/** Persisted app state (current board/category and sentence strip) */
export interface AppStateSnapshot {
  currentBoardId: Id | null;
  currentCategoryId: Id | null;
  sentenceStripTileIds: Id[];
}

/** Full persisted state: all boards + app snapshot */
export interface PersistedState {
  boards: Board[];
  appState: AppStateSnapshot;
}

/** Export/import shape: one board as JSON */
export interface BoardExport {
  version: 1;
  exportedAt: number;
  board: Board;
}

/** Export/import shape: full state (all boards + app state) */
export interface FullStateExport {
  version: 1;
  exportedAt: number;
  boards: Board[];
  appState: AppStateSnapshot;
}

/** Generate a simple unique id */
export function newId(): Id {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}
