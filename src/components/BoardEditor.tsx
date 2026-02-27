/**
 * Caregiver-only: edit board, categories, tiles. Drag-and-drop. Romanian.
 * Tiles can have an optional image (file upload → data URL).
 */

import { useState, useRef } from 'react';
import { useBoardStore } from '@/store/useBoardStore';
import { t } from '@/i18n';
import type { Category } from '@/types';

const MAX_IMAGE_SIZE_BYTES = 1.5 * 1024 * 1024; // 1.5 MB
const ACCEPT_IMAGES = 'image/jpeg,image/png,image/gif,image/webp';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      reject(new Error('Image too large'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function BoardEditor() {
  const {
    board,
    currentCategoryId,
    setCurrentCategoryId,
    updateBoard,
    updateTile,
    reorderCategories,
    reorderTilesInCategory,
    addCategory,
    deleteCategory,
    addTile,
    deleteTile,
    getCurrentCategory,
    getTilesForCurrentCategory
  } = useBoardStore();

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newTileLabel, setNewTileLabel] = useState('');
  const [newTileSpeech, setNewTileSpeech] = useState('');
  const [newTileImageFile, setNewTileImageFile] = useState<File | null>(null);
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [dragCategoryIndex, setDragCategoryIndex] = useState<number | null>(null);
  const [dragTileIndex, setDragTileIndex] = useState<number | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const addTileImageInputRef = useRef<HTMLInputElement>(null);
  const editTileImageInputRef = useRef<HTMLInputElement>(null);

  if (!board) return null;

  const categories = board.categoryIds
    .map((id) => board.categories[id])
    .filter(Boolean) as Category[];
  const currentCategory = getCurrentCategory();
  const tiles = getTilesForCurrentCategory();

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (name) {
      addCategory(name);
      setNewCategoryName('');
    }
  };

  const handleAddTile = async () => {
    const label = newTileLabel.trim();
    if (!label || !currentCategoryId) return;
    const speech = newTileSpeech.trim() || label;
    const newId = addTile(currentCategoryId, label, speech);
    setNewTileLabel('');
    setNewTileSpeech('');
    if (newId && newTileImageFile) {
      setImageError(null);
      try {
        const dataUrl = await readFileAsDataUrl(newTileImageFile);
        updateTile(newId, { imageUrl: dataUrl });
      } catch {
        setImageError('Image too large or invalid');
      }
      setNewTileImageFile(null);
      if (addTileImageInputRef.current) addTileImageInputRef.current.value = '';
    }
  };

  const handleTileImageChange = async (tileId: string, file: File | null) => {
    setImageError(null);
    if (!file) {
      updateTile(tileId, { imageUrl: null });
      if (editTileImageInputRef.current) editTileImageInputRef.current.value = '';
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      updateTile(tileId, { imageUrl: dataUrl });
      if (editTileImageInputRef.current) editTileImageInputRef.current.value = '';
    } catch {
      setImageError('Image too large or invalid');
    }
  };

  const handleCategoryDragStart = (index: number) => setDragCategoryIndex(index);
  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragCategoryIndex === null) return;
    if (dragCategoryIndex === index) return;
    reorderCategories(dragCategoryIndex, index);
    setDragCategoryIndex(index);
  };
  const handleCategoryDragEnd = () => setDragCategoryIndex(null);

  const handleTileDragStart = (index: number) => setDragTileIndex(index);
  const handleTileDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragTileIndex === null || !currentCategoryId) return;
    if (dragTileIndex === index) return;
    reorderTilesInCategory(currentCategoryId, dragTileIndex, index);
    setDragTileIndex(index);
  };
  const handleTileDragEnd = () => setDragTileIndex(null);

  return (
    <section className="mt-8 p-6 bg-white rounded-card border-2 border-aac-border" aria-label={t('editor.title')}>
      <h2 className="text-lg font-semibold text-aac-primary mb-4">{t('editor.title')}</h2>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <label className="block">
          <span className="text-sm font-medium text-aac-muted block mb-1">{t('editor.boardName')}</span>
          <input
            type="text"
            value={board.name}
            onChange={(e) => updateBoard({ name: e.target.value })}
            className="w-full p-3 border-2 border-aac-border rounded-button"
          />
        </label>
        <div className="flex gap-4">
          <label className="block">
            <span className="text-sm font-medium text-aac-muted block mb-1">{t('editor.columns')}</span>
            <input
              type="number"
              min={1}
              max={6}
              value={board.columns}
              onChange={(e) => updateBoard({ columns: Math.max(1, Math.min(6, Number(e.target.value) || 1)) })}
              className="w-20 p-3 border-2 border-aac-border rounded-button"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-aac-muted block mb-1">{t('editor.rows')}</span>
            <input
              type="number"
              min={1}
              max={8}
              value={board.rows ?? 4}
              onChange={(e) => updateBoard({ rows: Math.max(1, Math.min(8, Number(e.target.value) || 1)) })}
              className="w-20 p-3 border-2 border-aac-border rounded-button"
            />
          </label>
        </div>
      </div>

      <h3 className="font-medium text-aac-primary mb-2">{t('editor.categories')}</h3>
      <ul className="space-y-1 mb-4">
        {categories.map((cat, index) => (
          <li
            key={cat.id}
            draggable
            onDragStart={() => handleCategoryDragStart(index)}
            onDragOver={(e) => handleCategoryDragOver(e, index)}
            onDragEnd={handleCategoryDragEnd}
            className={`flex items-center gap-2 p-2 rounded border ${dragCategoryIndex === index ? 'border-aac-primary bg-aac-surface' : 'border-transparent'}`}
          >
            <span className="cursor-grab text-aac-muted" aria-hidden>⋮⋮</span>
            <button
              type="button"
              onClick={() => setCurrentCategoryId(cat.id)}
              className={`flex-1 text-left px-2 py-1 rounded ${currentCategoryId === cat.id ? 'bg-aac-primary text-white' : 'bg-aac-surface'}`}
            >
              {cat.name}
            </button>
            <button
              type="button"
              onClick={() => deleteCategory(cat.id)}
              className="text-red-600 px-2"
              aria-label={t('editor.deleteCategory').replace('{name}', cat.name)}
            >
              {t('editor.delete')}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder={t('editor.newCategoryPlaceholder')}
          className="flex-1 p-2 border-2 border-aac-border rounded-lg"
        />
        <button
          type="button"
          onClick={handleAddCategory}
          className="px-4 py-2 bg-aac-primary text-white rounded-lg font-medium"
        >
          Add category
        </button>
      </div>

      {currentCategory && (
        <>
          <h3 className="font-medium text-aac-primary mb-2">Tiles in “{currentCategory.name}”</h3>
          <ul className="space-y-1 mb-4">
            {tiles.map((tile, index) => (
              <li
                key={tile.id}
                draggable
                onDragStart={() => handleTileDragStart(index)}
                onDragOver={(e) => handleTileDragOver(e, index)}
                onDragEnd={handleTileDragEnd}
                className={`flex items-center gap-2 p-2 rounded border ${dragTileIndex === index ? 'border-aac-primary bg-aac-surface' : 'border-transparent'}`}
              >
                <span className="cursor-grab text-aac-muted" aria-hidden>⋮⋮</span>
                {editingTileId === tile.id ? (
                  <>
                    <input
                      type="text"
                      value={tile.label}
                      onChange={(e) => updateTile(tile.id, { label: e.target.value })}
                      className="flex-1 p-1 border rounded min-w-0"
                    />
                    <input
                      type="text"
                      value={tile.speechText ?? ''}
                      onChange={(e) => updateTile(tile.id, { speechText: e.target.value || null })}
                      placeholder={t('editor.speechPlaceholder')}
                      className="flex-1 p-1 border rounded min-w-0"
                    />
                    <div className="flex items-center gap-1 flex-wrap">
                      {tile.imageUrl ? (
                        <>
                          <img
                            src={tile.imageUrl}
                            alt=""
                            className="w-10 h-10 object-contain rounded border border-aac-border"
                          />
                          <label className="cursor-pointer text-sm text-aac-primary underline">
                            {t('editor.changeImage')}
                            <input
                              ref={editTileImageInputRef}
                              type="file"
                              accept={ACCEPT_IMAGES}
                              className="sr-only"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) handleTileImageChange(tile.id, f);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => handleTileImageChange(tile.id, null)}
                            className="text-sm text-red-600"
                          >
                            {t('editor.removeImage')}
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer text-sm text-aac-primary underline">
                          {t('editor.addImage')}
                          <input
                            ref={editTileImageInputRef}
                            type="file"
                            accept={ACCEPT_IMAGES}
                            className="sr-only"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleTileImageChange(tile.id, f);
                            }}
                          />
                        </label>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingTileId(null)}
                      className="px-2 text-aac-primary"
                    >
                      {t('editor.done')}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">{tile.label}</span>
                    <button
                      type="button"
                      onClick={() => setEditingTileId(tile.id)}
                      className="px-2 text-aac-primary"
                    >
                      {t('editor.edit')}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTile(tile.id)}
                      className="min-h-[44px] px-3 text-red-600 rounded-button hover:bg-red-50"
                      aria-label={t('editor.deleteTile').replace('{label}', tile.label)}
                    >
                      {t('editor.delete')}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
          {imageError && (
            <p className="text-sm text-red-600 mb-2" role="alert">
              {imageError}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mb-4 items-end">
            <input
              type="text"
              value={newTileLabel}
              onChange={(e) => setNewTileLabel(e.target.value)}
              placeholder={t('editor.newTilePlaceholder')}
              className="flex-1 min-w-[120px] p-2 border-2 border-aac-border rounded-lg"
            />
            <input
              type="text"
              value={newTileSpeech}
              onChange={(e) => setNewTileSpeech(e.target.value)}
              placeholder={t('editor.speechPlaceholder')}
              className="flex-1 min-w-[120px] p-2 border-2 border-aac-border rounded-lg"
            />
            <label className="cursor-pointer flex items-center gap-2 px-3 py-2 border-2 border-aac-border rounded-lg hover:bg-aac-surface">
              <span className="text-sm text-aac-muted">{t('editor.addImage')}</span>
              <input
                ref={addTileImageInputRef}
                type="file"
                accept={ACCEPT_IMAGES}
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  setNewTileImageFile(f ?? null);
                }}
              />
              {newTileImageFile && (
                <span className="text-xs text-aac-primary truncate max-w-[100px]" title={newTileImageFile.name}>
                  {newTileImageFile.name}
                </span>
              )}
            </label>
            <button
              type="button"
              onClick={handleAddTile}
              className="px-4 py-2 bg-aac-primary text-white rounded-lg font-medium"
            >
              {t('editor.addTile')}
            </button>
          </div>
        </>
      )}

      <ResetToDefault />
    </section>
  );
}

function ResetToDefault() {
  const [confirming, setConfirming] = useState(false);
  const { resetToDefaultDemo } = useBoardStore();

  const handleReset = async () => {
    await resetToDefaultDemo();
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="mt-6 p-4 border-2 border-amber-200 bg-amber-50 rounded-card">
        <p className="font-medium text-amber-800 mb-2">{t('editor.resetConfirmTitle')}</p>
        <p className="text-sm text-amber-700 mb-3">{t('editor.resetConfirmBody')}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[44px] px-4 py-2 bg-amber-600 text-white rounded-button font-medium"
          >
            {t('editor.resetConfirmYes')}
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="min-h-[44px] px-4 py-2 border-2 border-aac-border rounded-button font-medium"
          >
            {t('editor.resetConfirmCancel')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="min-h-[44px] px-4 py-2 border-2 border-amber-400 text-amber-800 rounded-button font-medium hover:bg-amber-50"
      >
        {t('editor.resetButton')}
      </button>
    </div>
  );
}
