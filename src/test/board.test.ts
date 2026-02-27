/**
 * Basic tests: board structure, export/import.
 */

import { describe, it, expect } from 'vitest';
import { newId } from '@/types';
import type { Board, Tile, Category } from '@/types';
import { exportBoard, importBoard } from '@/types/exportImport';
import { buildSeedBoard } from '@/data/seedBoards';

describe('newId', () => {
  it('returns a non-empty string', () => {
    expect(newId()).toBeTruthy();
    expect(typeof newId()).toBe('string');
  });
  it('returns unique ids', () => {
    const a = newId();
    const b = newId();
    expect(a).not.toBe(b);
  });
});

describe('Board structure', () => {
  it('seed board has categories and tiles', () => {
    const board = buildSeedBoard();
    expect(board.id).toBeTruthy();
    expect(board.categoryIds.length).toBeGreaterThan(0);
    expect(Object.keys(board.categories).length).toBe(board.categoryIds.length);
    expect(Object.keys(board.tiles).length).toBeGreaterThan(0);
  });

  it('each category references existing tile ids', () => {
    const board = buildSeedBoard();
    for (const cat of Object.values(board.categories)) {
      for (const tileId of cat.tileIds) {
        expect(board.tiles[tileId]).toBeDefined();
      }
    }
  });
});

describe('Export / Import', () => {
  it('export produces valid JSON', () => {
    const board = buildSeedBoard();
    const json = exportBoard(board);
    expect(() => JSON.parse(json)).not.toThrow();
    const parsed = JSON.parse(json);
    expect(parsed.version).toBe(1);
    expect(parsed.board).toBeDefined();
    expect(parsed.board.id).toBe(board.id);
  });

  it('import restores board', () => {
    const board = buildSeedBoard();
    const json = exportBoard(board);
    const restored = importBoard(json);
    expect(restored.id).toBe(board.id);
    expect(restored.name).toBe(board.name);
    expect(restored.categoryIds).toEqual(board.categoryIds);
    expect(Object.keys(restored.tiles).length).toBe(Object.keys(board.tiles).length);
  });

  it('import throws on invalid format', () => {
    expect(() => importBoard('{}')).toThrow();
    expect(() => importBoard('{"version":1}')).toThrow();
    expect(() => importBoard('null')).toThrow();
  });
});
