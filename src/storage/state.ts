/**
 * IndexedDB storage wrapper (idb).
 * Versioned schema with migrations. Saves/loads full board set + app state.
 * Privacy-by-design: all data local. No analytics, no tracking.
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Board, AppStateSnapshot, PersistedState, FullStateExport } from '@/types';

const DB_NAME = 'aac-app-db';
const STORE_BOARDS = 'boards';
const STORE_APP_STATE = 'app_state';
const STORE_MEDIA = 'media';
const APP_STATE_KEY = 'default';
const SCHEMA_VERSION = 2;

/** Stored row has id for keyPath; AppStateSnapshot is the logical shape */
interface StoredAppState extends AppStateSnapshot {
  id: string;
}

export interface AACDbSchema extends DBSchema {
  [STORE_BOARDS]: {
    key: string;
    value: Board;
    indexes: { 'by-updated': number };
  };
  [STORE_APP_STATE]: {
    key: string;
    value: StoredAppState;
    indexes: {};
  };
  [STORE_MEDIA]: {
    key: string;
    value: { id: string; blob: Blob; mime: string };
    indexes: {};
  };
}

let dbPromise: Promise<IDBPDatabase<AACDbSchema>> | null = null;

function getDB(): Promise<IDBPDatabase<AACDbSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<AACDbSchema>(DB_NAME, SCHEMA_VERSION, {
      upgrade(db, oldVersion, _newVersion, _tx) {
        // v1: boards + media
        if (oldVersion < 1) {
          const boardStore = db.createObjectStore(STORE_BOARDS, { keyPath: 'id' });
          boardStore.createIndex('by-updated', 'updatedAt');
          db.createObjectStore(STORE_MEDIA, { keyPath: 'id' });
        }
        // v2: app_state for current board/category and sentence strip
        if (oldVersion < 2) {
          db.createObjectStore(STORE_APP_STATE, { keyPath: 'id' });
        }
      }
    });
  }
  return dbPromise;
}

const defaultAppState: AppStateSnapshot = {
  currentBoardId: null,
  currentCategoryId: null,
  sentenceStripTileIds: []
};

/** Load full state: all boards and persisted app state */
export async function loadState(): Promise<PersistedState> {
  const db = await getDB();
  const boards = await db.getAll(STORE_BOARDS);
  const sortedBoards = boards.sort((a, b) => b.updatedAt - a.updatedAt);

  const stored = await db.get(STORE_APP_STATE, APP_STATE_KEY);
  let appState: AppStateSnapshot;
  if (!stored) {
    appState = defaultAppState;
  } else {
    appState = {
      currentBoardId: stored.currentBoardId ?? null,
      currentCategoryId: stored.currentCategoryId ?? null,
      sentenceStripTileIds: Array.isArray(stored.sentenceStripTileIds)
        ? stored.sentenceStripTileIds
        : []
    };
  }

  return { boards: sortedBoards, appState };
}

/** Save full state: replace all boards and app state */
export async function saveState(state: PersistedState): Promise<void> {
  const db = await getDB();
  const tx = db.transaction([STORE_BOARDS, STORE_APP_STATE], 'readwrite');

  await tx.objectStore(STORE_BOARDS).clear();
  for (const board of state.boards) {
    const withTimestamp = { ...board, updatedAt: board.updatedAt ?? Date.now() };
    await tx.objectStore(STORE_BOARDS).put(withTimestamp);
  }

  await tx.objectStore(STORE_APP_STATE).put({
    id: APP_STATE_KEY,
    ...state.appState
  });

  await tx.done;
}

/** Export full state as JSON string (backup/portability) */
export async function exportJSON(): Promise<string> {
  const state = await loadState();
  const data: FullStateExport = {
    version: 1,
    exportedAt: Date.now(),
    boards: state.boards,
    appState: state.appState
  };
  return JSON.stringify(data, null, 2);
}

/** Import from JSON string; validates and then saves. Returns loaded state. */
export async function importJSON(json: string): Promise<PersistedState> {
  let data: unknown;
  try {
    data = JSON.parse(json);
  } catch {
    throw new Error('Invalid JSON');
  }

  if (!data || typeof data !== 'object' || !('version' in data) || !('boards' in data)) {
    throw new Error('Invalid AAC export format: missing version or boards');
  }

  const exp = data as FullStateExport;
  if (exp.version !== 1) {
    throw new Error(`Unsupported export version: ${exp.version}`);
  }

  if (!Array.isArray(exp.boards)) {
    throw new Error('Invalid AAC export format: boards must be an array');
  }

  const boards: Board[] = [];
  for (const b of exp.boards) {
    if (!isValidBoard(b)) {
      throw new Error('Invalid board in export: missing id, name, categories, or tiles');
    }
    boards.push(normalizeBoard(b));
  }

  const appState: AppStateSnapshot = exp.appState && typeof exp.appState === 'object'
    ? {
        currentBoardId: exp.appState.currentBoardId ?? null,
        currentCategoryId: exp.appState.currentCategoryId ?? null,
        sentenceStripTileIds: Array.isArray(exp.appState.sentenceStripTileIds)
          ? exp.appState.sentenceStripTileIds
          : []
      }
    : defaultAppState;

  const state: PersistedState = { boards, appState };
  await saveState(state);
  return state;
}

function isValidBoard(b: unknown): b is Board {
  if (!b || typeof b !== 'object') return false;
  const x = b as Record<string, unknown>;
  return (
    typeof x.id === 'string' &&
    typeof x.name === 'string' &&
    Array.isArray(x.categoryIds) &&
    x.categoryIds !== null &&
    typeof x.categories === 'object' &&
    x.categories !== null &&
    typeof x.tiles === 'object' &&
    x.tiles !== null
  );
}

function normalizeBoard(b: Board): Board {
  return {
    id: b.id,
    name: b.name,
    columns: typeof b.columns === 'number' ? b.columns : 3,
    rows: typeof b.rows === 'number' ? b.rows : undefined,
    categoryIds: Array.isArray(b.categoryIds) ? b.categoryIds : [],
    categories: typeof b.categories === 'object' && b.categories ? b.categories : {},
    tiles: typeof b.tiles === 'object' && b.tiles ? b.tiles : {},
    updatedAt: typeof b.updatedAt === 'number' ? b.updatedAt : Date.now()
  };
}

// --- Backward-compatible single-board API (used by store) ---

export async function saveBoard(board: Board): Promise<void> {
  const db = await getDB();
  const updated = { ...board, updatedAt: Date.now() };
  await db.put(STORE_BOARDS, updated);
}

export async function getBoard(id: string): Promise<Board | undefined> {
  const db = await getDB();
  return db.get(STORE_BOARDS, id);
}

export async function getAllBoards(): Promise<Board[]> {
  const { boards } = await loadState();
  return boards;
}

export async function deleteBoard(id: string): Promise<void> {
  const db = await getDB();
  await db.delete(STORE_BOARDS, id);
}

export async function saveMedia(id: string, blob: Blob, mime: string): Promise<void> {
  const db = await getDB();
  await db.put(STORE_MEDIA, { id, blob, mime });
}

export async function getMedia(id: string): Promise<{ blob: Blob; mime: string } | undefined> {
  const db = await getDB();
  const row = await db.get(STORE_MEDIA, id);
  return row ? { blob: row.blob, mime: row.mime } : undefined;
}
