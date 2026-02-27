/**
 * Zustand store: current board, category, sentence strip, and settings.
 * Persists lockMode / darkMode / lowStimulation to localStorage.
 */

import { create } from 'zustand';
import type { Board, Category, Tile, Id } from '@/types';
import { newId } from '@/types';
import * as db from '@/storage/db';
import { buildSeedBoard } from '@/data/seedBoards';

const LOCK_KEY = 'aac_lockMode';
const DARK_KEY = 'aac_darkMode';
const LOW_KEY = 'aac_lowStimulation';
const VOICE_KEY = 'aac_preferredVoiceId';
const CAREGIVER_PIN_KEY = 'aac_caregiverPin';
const LOCK_NAV_KEY = 'aac_lockNavInChildMode';
/** Bump to force all clients to get new seed (icons, 50 tiles, even grid). Clear localStorage aac_data_version to re-run. */
const DATA_VERSION = 2;
const DATA_VERSION_KEY = 'aac_data_version';

function getStored(key: string, fallback: boolean): boolean {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? v === 'true' : fallback;
  } catch {
    return fallback;
  }
}

function setStored(key: string, value: boolean) {
  try {
    localStorage.setItem(key, String(value));
  } catch {}
}

function getStoredString(key: string, fallback: string | null): string | null {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? v : fallback;
  } catch {
    return fallback;
  }
}

function setStoredString(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

interface BoardState {
  board: Board | null;
  currentCategoryId: Id | null;
  sentenceStripTileIds: Id[];
  /** When true, tap appends to sentence strip; when false, tap speaks immediately */
  sentenceMode: boolean;
  lockMode: boolean;
  lowStimulation: boolean;
  darkMode: boolean;
  loaded: boolean;
  /** Preferred TTS voice (Web Speech API voice URI). Stored per profile in localStorage. */
  preferredVoiceId: string | null;
  /** Last spoken text (for "repeat" button). Not persisted. */
  lastUtterance: string;
  /** Caregiver mode: can edit boards. When false = child mode (editing disabled). */
  isCaregiverMode: boolean;
  /** Optional PIN to enter caregiver mode. Stored locally (device only). */
  caregiverPin: string | null;
  /** When true, in child mode category navigation is disabled. */
  lockNavInChildMode: boolean;
  /** Show PIN entry dialog (to enter caregiver mode). */
  showPinDialog: boolean;

  setBoard: (b: Board | null) => void;
  setCurrentCategoryId: (id: Id | null) => void;
  appendToSentence: (tileId: Id) => void;
  clearSentence: () => void;
  setSentenceMode: (v: boolean) => void;
  setLockMode: (v: boolean) => void;
  setLowStimulation: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  setPreferredVoiceId: (id: string | null) => void;
  setLastUtterance: (text: string) => void;
  setLockNavInChildMode: (v: boolean) => void;
  setCaregiverPin: (pin: string | null) => void;
  enterCaregiverMode: (pin?: string) => boolean;
  exitCaregiverMode: () => void;
  setShowPinDialog: (v: boolean) => void;
  updateBoard: (updates: Partial<Board>) => void;
  updateCategory: (categoryId: Id, updates: Partial<Category>) => void;
  updateTile: (tileId: Id, updates: Partial<Tile>) => void;
  reorderCategories: (fromIndex: number, toIndex: number) => void;
  reorderTilesInCategory: (categoryId: Id, fromIndex: number, toIndex: number) => void;
  addCategory: (name: string) => void;
  deleteCategory: (categoryId: Id) => void;
  addTile: (categoryId: Id, label: string, speechText?: string) => Id | undefined;
  deleteTile: (tileId: Id) => void;
  resetToDefaultDemo: () => Promise<void>;

  loadBoards: () => Promise<void>;
  loadOrCreateSeed: () => Promise<void>;
  saveCurrentBoard: () => Promise<void>;
  persistAppState: () => Promise<void>;
  getCurrentCategory: () => Category | null;
  getTilesForCurrentCategory: () => Tile[];
  getTile: (id: Id) => Tile | undefined;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: null,
  currentCategoryId: null,
  sentenceStripTileIds: [],
  sentenceMode: false,
  lockMode: getStored(LOCK_KEY, false),
  lowStimulation: getStored(LOW_KEY, false),
  darkMode: getStored(DARK_KEY, false),
  loaded: false,
  preferredVoiceId: getStoredString(VOICE_KEY, 'piper:ro_RO-mihai-medium'),
  lastUtterance: '',
  isCaregiverMode: false,
  caregiverPin: getStoredString(CAREGIVER_PIN_KEY, null),
  lockNavInChildMode: getStored(LOCK_NAV_KEY, false),
  showPinDialog: false,

  setBoard: (board) => set({ board, currentCategoryId: board?.categoryIds[0] ?? null }),

  setCurrentCategoryId: (currentCategoryId) => set({ currentCategoryId }),

  appendToSentence: (tileId) =>
    set((s) => ({ sentenceStripTileIds: [...s.sentenceStripTileIds, tileId] })),

  clearSentence: () => set({ sentenceStripTileIds: [] }),

  setSentenceMode: (v) => set({ sentenceMode: v }),

  setLockMode: (v) => {
    setStored(LOCK_KEY, v);
    set({ lockMode: v });
  },

  setLowStimulation: (v) => {
    setStored(LOW_KEY, v);
    set({ lowStimulation: v });
  },

  setDarkMode: (v) => {
    setStored(DARK_KEY, v);
    set({ darkMode: v });
  },

  setPreferredVoiceId: (id) => {
    setStoredString(VOICE_KEY, id);
    set({ preferredVoiceId: id });
  },

  setLastUtterance: (text) => set({ lastUtterance: text }),

  setLockNavInChildMode: (v) => {
    setStored(LOCK_NAV_KEY, v);
    set({ lockNavInChildMode: v });
  },

  setCaregiverPin: (pin) => {
    setStoredString(CAREGIVER_PIN_KEY, pin);
    set({ caregiverPin: pin });
  },

  enterCaregiverMode: (pin) => {
    const { caregiverPin } = get();
    if (caregiverPin != null && caregiverPin !== '') {
      if (pin !== caregiverPin) return false;
    }
    set({ isCaregiverMode: true, showPinDialog: false });
    return true;
  },

  exitCaregiverMode: () => set({ isCaregiverMode: false }),

  setShowPinDialog: (v) => set({ showPinDialog: v }),

  updateBoard: (updates) => {
    const { board } = get();
    if (!board) return;
    const next = { ...board, ...updates, updatedAt: Date.now() };
    set({ board: next });
    db.saveBoard(next);
  },

  updateCategory: (categoryId, updates) => {
    const { board } = get();
    if (!board || !board.categories[categoryId]) return;
    const cat = { ...board.categories[categoryId], ...updates };
    const categories = { ...board.categories, [categoryId]: cat };
    const next = { ...board, categories, updatedAt: Date.now() };
    set({ board: next });
    db.saveBoard(next);
  },

  updateTile: (tileId, updates) => {
    const { board } = get();
    if (!board || !board.tiles[tileId]) return;
    const tile = { ...board.tiles[tileId], ...updates };
    const tiles = { ...board.tiles, [tileId]: tile };
    const next = { ...board, tiles, updatedAt: Date.now() };
    set({ board: next });
    db.saveBoard(next);
  },

  reorderCategories: (fromIndex, toIndex) => {
    const { board } = get();
    if (!board) return;
    const ids = [...board.categoryIds];
    const [removed] = ids.splice(fromIndex, 1);
    if (removed === undefined) return;
    ids.splice(toIndex, 0, removed);
    const categories = { ...board.categories };
    ids.forEach((id, i) => {
      const c = categories[id];
      if (c) categories[id] = { ...c, order: i };
    });
    const next = { ...board, categoryIds: ids, categories, updatedAt: Date.now() };
    set({ board: next });
    db.saveBoard(next);
  },

  reorderTilesInCategory: (categoryId, fromIndex, toIndex) => {
    const { board } = get();
    if (!board) return;
    const cat = board.categories[categoryId];
    if (!cat) return;
    const tilesInOrder = cat.tileIds
      .map((id) => board.tiles[id])
      .filter((t): t is Tile => t != null)
      .sort((a, b) => a.order - b.order);
    const [moved] = tilesInOrder.splice(fromIndex, 1);
    if (!moved) return;
    tilesInOrder.splice(toIndex, 0, moved);
    const tiles = { ...board.tiles };
    tilesInOrder.forEach((t, i) => {
      tiles[t.id] = { ...t, order: i };
    });
    const next = { ...board, tiles, updatedAt: Date.now() };
    set({ board: next });
    db.saveBoard(next);
  },

  addCategory: (name) => {
    const { board } = get();
    if (!board) return;
    const id = newId();
    const category: Category = { id, name, tileIds: [], order: board.categoryIds.length };
    const categories = { ...board.categories, [id]: category };
    const categoryIds = [...board.categoryIds, id];
    const next = { ...board, categories, categoryIds, updatedAt: Date.now() };
    set({ board: next });
    db.saveBoard(next);
  },

  deleteCategory: (categoryId) => {
    const { board, currentCategoryId } = get();
    if (!board || !board.categories[categoryId]) return;
    const categoryIds = board.categoryIds.filter((id) => id !== categoryId);
    const categories = { ...board.categories };
    delete categories[categoryId];
    const next = { ...board, categories, categoryIds, updatedAt: Date.now() };
    const newCurrent = currentCategoryId === categoryId ? (categoryIds[0] ?? null) : currentCategoryId;
    set({ board: next, currentCategoryId: newCurrent });
    db.saveBoard(next);
  },

  addTile: (categoryId, label, speechText) => {
    const { board } = get();
    if (!board) return undefined;
    const cat = board.categories[categoryId];
    if (!cat) return undefined;
    const id = newId();
    const tile: Tile = {
      id,
      label,
      speechText: speechText ?? label,
      order: cat.tileIds.length
    };
    const tiles = { ...board.tiles, [id]: tile };
    const tileIds = [...cat.tileIds, id];
    const categories = { ...board.categories, [categoryId]: { ...cat, tileIds } };
    const next = { ...board, tiles, categories, updatedAt: Date.now() };
    set({ board: next });
    db.saveBoard(next);
    return id;
  },

  deleteTile: (tileId) => {
    const { board } = get();
    if (!board || !board.tiles[tileId]) return;
    const tiles = { ...board.tiles };
    delete tiles[tileId];
    const categories = { ...board.categories };
    for (const cid of Object.keys(categories)) {
      const cat = categories[cid];
      if (cat) cat.tileIds = cat.tileIds.filter((id) => id !== tileId);
    }
    const next = { ...board, tiles, categories, updatedAt: Date.now() };
    set({ board: next });
    db.saveBoard(next);
  },

  resetToDefaultDemo: async () => {
    const seed = buildSeedBoard();
    const appState = {
      currentBoardId: seed.id,
      currentCategoryId: seed.categoryIds[0] ?? null,
      sentenceStripTileIds: [] as Id[]
    };
    await db.saveState({ boards: [seed], appState });
    set({
      board: seed,
      currentCategoryId: seed.categoryIds[0] ?? null,
      sentenceStripTileIds: []
    });
  },

  loadBoards: async () => {
    const { boards, appState } = await db.loadState();
    const board = boards[0] ?? null;
    const validCatId =
      board && appState.currentCategoryId && board.categoryIds.includes(appState.currentCategoryId)
        ? appState.currentCategoryId
        : board?.categoryIds[0] ?? null;
    set({
      board,
      currentCategoryId: validCatId,
      sentenceStripTileIds: appState.sentenceStripTileIds ?? [],
      loaded: true
    });
  },

  loadOrCreateSeed: async () => {
    const storedVersion = typeof localStorage !== 'undefined' ? localStorage.getItem(DATA_VERSION_KEY) : null;
    const mustUpgrade = storedVersion !== String(DATA_VERSION);

    if (mustUpgrade) {
      // Force replace with new seed (icons, 50 tiles, 4-column grid) so all users get the fix
      const board = buildSeedBoard();
      const appState = {
        currentBoardId: board.id,
        currentCategoryId: board.categoryIds[0] ?? null,
        sentenceStripTileIds: [] as Id[]
      };
      await db.saveState({ boards: [board], appState });
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(DATA_VERSION_KEY, String(DATA_VERSION));
      }
      set({
        board,
        currentCategoryId: board.categoryIds[0] ?? null,
        sentenceStripTileIds: [],
        loaded: true
      });
      return;
    }

    const { boards, appState } = await db.loadState();
    let board = boards[0] ?? null;
    let currentCategoryId: Id | null = board?.categoryIds[0] ?? null;
    let sentenceStripTileIds: Id[] = appState.sentenceStripTileIds ?? [];

    if (!board) {
      board = buildSeedBoard();
      await db.saveState({ boards: [board], appState: { ...appState, currentBoardId: board.id, currentCategoryId: board.categoryIds[0] ?? null, sentenceStripTileIds: [] } });
      currentCategoryId = board.categoryIds[0] ?? null;
      sentenceStripTileIds = [];
    } else {
      const tileList = Object.values(board.tiles);
      const hasAnyIcon = tileList.some((t) => t.icon != null && t.icon !== '');
      if (tileList.length > 0 && !hasAnyIcon) {
        board = buildSeedBoard();
        await db.saveState({ boards: [board], appState: { ...appState, currentBoardId: board.id, currentCategoryId: board.categoryIds[0] ?? null, sentenceStripTileIds: [] } });
        currentCategoryId = board.categoryIds[0] ?? null;
        sentenceStripTileIds = [];
      } else if (appState.currentBoardId === board.id && appState.currentCategoryId && board.categoryIds.includes(appState.currentCategoryId)) {
        currentCategoryId = appState.currentCategoryId;
      }
    }

    set({
      board,
      currentCategoryId,
      sentenceStripTileIds,
      loaded: true
    });
  },

  saveCurrentBoard: async () => {
    const { board } = get();
    if (board) await db.saveBoard(board);
  },

  persistAppState: async () => {
    const { board, currentCategoryId, sentenceStripTileIds } = get();
    const { boards } = await db.loadState();
    await db.saveState({
      boards: board ? boards.map((b) => (b.id === board.id ? board : b)) : boards,
      appState: {
        currentBoardId: board?.id ?? null,
        currentCategoryId: currentCategoryId ?? null,
        sentenceStripTileIds: sentenceStripTileIds ?? []
      }
    });
  },

  getCurrentCategory: () => {
    const { board, currentCategoryId } = get();
    if (!board || !currentCategoryId) return null;
    return board.categories[currentCategoryId] ?? null;
  },

  getTilesForCurrentCategory: () => {
    const cat = get().getCurrentCategory();
    const { board } = get();
    if (!board || !cat) return [];
    const tiles: Tile[] = [];
    for (const id of cat.tileIds) {
      const t = board.tiles[id];
      if (t && !t.hidden) tiles.push(t);
    }
    tiles.sort((a, b) => a.order - b.order);
    return tiles;
  },

  getTile: (id) => get().board?.tiles[id]
}));
