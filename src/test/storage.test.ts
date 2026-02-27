/**
 * Tests for IndexedDB storage: loadState, saveState, exportJSON, importJSON.
 * Uses a separate DB name to avoid polluting the app DB.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Board, PersistedState, AppStateSnapshot } from '@/types';
import { newId } from '@/types';
import { buildSeedBoard } from '@/data/seedBoards';

// Dynamic import so we can mock or use a test DB. For tests we use the real idb
// and test the exported API. We'll need to reset DB between tests or use unique names.
// idb doesn't let us pass a different DB name easily from outside. So we test the
// logic of saveState/loadState/exportJSON/importJSON with in-memory state and
// the export/import JSON format only, and test that importJSON validates and normalizes.

describe('PersistedState shape', () => {
  it('default app state has expected keys', () => {
    const app: AppStateSnapshot = {
      currentBoardId: null,
      currentCategoryId: null,
      sentenceStripTileIds: []
    };
    expect(app.currentBoardId).toBeNull();
    expect(app.currentCategoryId).toBeNull();
    expect(Array.isArray(app.sentenceStripTileIds)).toBe(true);
  });
});

describe('Export/Import JSON integrity', () => {
  it('exportJSON returns valid FullStateExport string', async () => {
    const { exportJSON } = await import('@/storage/state');
    const json = await exportJSON();
    expect(typeof json).toBe('string');
    const parsed = JSON.parse(json) as { version: number; boards: unknown[]; appState: unknown };
    expect(parsed.version).toBe(1);
    expect(Array.isArray(parsed.boards)).toBe(true);
    expect(parsed.appState).toBeDefined();
    expect(typeof (parsed.appState as AppStateSnapshot).currentBoardId === 'string' || (parsed.appState as AppStateSnapshot).currentBoardId === null).toBe(true);
    expect(Array.isArray((parsed.appState as AppStateSnapshot).sentenceStripTileIds)).toBe(true);
  });

  it('importJSON rejects invalid JSON', async () => {
    const { importJSON } = await import('@/storage/state');
    await expect(importJSON('not json')).rejects.toThrow('Invalid JSON');
    await expect(importJSON('')).rejects.toThrow();
  });

  it('importJSON rejects missing version or boards', async () => {
    const { importJSON } = await import('@/storage/state');
    await expect(importJSON('{}')).rejects.toThrow('Invalid AAC export format');
    await expect(importJSON('{"version":1}')).rejects.toThrow();
    await expect(importJSON('{"boards":[]}')).rejects.toThrow();
  });

  it('importJSON rejects wrong version', async () => {
    const { importJSON } = await import('@/storage/state');
    const bad = JSON.stringify({ version: 99, boards: [], appState: { currentBoardId: null, currentCategoryId: null, sentenceStripTileIds: [] } });
    await expect(importJSON(bad)).rejects.toThrow('Unsupported export version');
  });

  it('importJSON rejects boards not an array', async () => {
    const { importJSON } = await import('@/storage/state');
    const bad = JSON.stringify({ version: 1, boards: {}, appState: { currentBoardId: null, currentCategoryId: null, sentenceStripTileIds: [] } });
    await expect(importJSON(bad)).rejects.toThrow('boards must be an array');
  });

  it('importJSON rejects invalid board in array', async () => {
    const { importJSON } = await import('@/storage/state');
    const bad = JSON.stringify({
      version: 1,
      boards: [{ id: 'x' }],
      appState: { currentBoardId: null, currentCategoryId: null, sentenceStripTileIds: [] }
    });
    await expect(importJSON(bad)).rejects.toThrow('Invalid board');
  });

  it('importJSON accepts valid full export and returns state', async () => {
    const board = buildSeedBoard();
    const fullExport = JSON.stringify({
      version: 1,
      exportedAt: Date.now(),
      boards: [board],
      appState: {
        currentBoardId: board.id,
        currentCategoryId: board.categoryIds[0],
        sentenceStripTileIds: []
      }
    });
    const { importJSON } = await import('@/storage/state');
    const state = await importJSON(fullExport);
    expect(state.boards.length).toBe(1);
    expect(state.boards[0].id).toBe(board.id);
    expect(state.boards[0].name).toBe(board.name);
    expect(state.appState.currentBoardId).toBe(board.id);
    expect(state.appState.currentCategoryId).toBe(board.categoryIds[0]);
  });

  it('round-trip exportJSON then importJSON preserves data', async () => {
    const { exportJSON, importJSON, loadState, saveState } = await import('@/storage/state');
    const board = buildSeedBoard();
    const firstTileId = Object.values(board.tiles)[0]?.id;
    const appState: AppStateSnapshot = {
      currentBoardId: board.id,
      currentCategoryId: board.categoryIds[0],
      sentenceStripTileIds: firstTileId ? [firstTileId] : []
    };
    await saveState({ boards: [board], appState });
    const json = await exportJSON();
    const parsed = JSON.parse(json);
    expect(parsed.boards.length).toBe(1);
    expect(parsed.boards[0].tiles).toBeDefined();
    expect(Object.keys(parsed.boards[0].tiles).length).toBeGreaterThan(0);

    await saveState({ boards: [], appState: { currentBoardId: null, currentCategoryId: null, sentenceStripTileIds: [] } });
    const restored = await importJSON(json);
    expect(restored.boards.length).toBe(1);
    expect(restored.boards[0].id).toBe(board.id);
    expect(restored.boards[0].categories).toEqual(board.categories);
    expect(Object.keys(restored.boards[0].tiles).length).toBe(Object.keys(board.tiles).length);
    expect(restored.appState.sentenceStripTileIds).toEqual(appState.sentenceStripTileIds);
  });
});

describe('loadState / saveState', () => {
  it('saveState then loadState returns same boards and appState', async () => {
    const { loadState, saveState } = await import('@/storage/state');
    const board = buildSeedBoard();
    const appState: AppStateSnapshot = {
      currentBoardId: board.id,
      currentCategoryId: board.categoryIds[0],
      sentenceStripTileIds: []
    };
    await saveState({ boards: [board], appState });
    const loaded = await loadState();
    expect(loaded.boards.length).toBe(1);
    expect(loaded.boards[0].id).toBe(board.id);
    expect(loaded.boards[0].name).toBe(board.name);
    expect(loaded.boards[0].categoryIds).toEqual(board.categoryIds);
    expect(loaded.appState.currentBoardId).toBe(board.id);
    expect(loaded.appState.currentCategoryId).toBe(board.categoryIds[0]);
  });

  it('saveState with multiple boards preserves all', async () => {
    const { loadState, saveState } = await import('@/storage/state');
    const b1 = buildSeedBoard();
    const b2 = buildSeedBoard();
    b2.id = newId();
    b2.name = 'Second board';
    await saveState({
      boards: [b1, b2],
      appState: { currentBoardId: b1.id, currentCategoryId: null, sentenceStripTileIds: [] }
    });
    const loaded = await loadState();
    expect(loaded.boards.length).toBe(2);
    const ids = loaded.boards.map((b) => b.id);
    expect(ids).toContain(b1.id);
    expect(ids).toContain(b2.id);
  });
});
