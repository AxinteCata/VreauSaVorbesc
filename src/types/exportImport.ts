/**
 * Export/Import board as JSON for backup and portability.
 */

import type { Board, BoardExport } from './index';

const EXPORT_VERSION = 1;

export function exportBoard(board: Board): string {
  const data: BoardExport = {
    version: EXPORT_VERSION,
    exportedAt: Date.now(),
    board: { ...board, updatedAt: Date.now() }
  };
  return JSON.stringify(data, null, 2);
}

export function importBoard(json: string): Board {
  const data = JSON.parse(json) as BoardExport;
  if (data.version !== EXPORT_VERSION || !data.board) {
    throw new Error('Invalid AAC board export format');
  }
  return data.board;
}
