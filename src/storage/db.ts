/**
 * IndexedDB access. Re-exports from state.ts (single source of truth with migrations).
 */

export {
  saveBoard,
  getBoard,
  getAllBoards,
  deleteBoard,
  saveMedia,
  getMedia,
  loadState,
  saveState,
  exportJSON,
  importJSON
} from './state';
export type { AACDbSchema } from './state';
