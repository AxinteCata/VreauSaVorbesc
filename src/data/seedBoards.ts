/**
 * Seed demo board in Romanian with royalty-free visuals (emoji).
 * Neurodivergent-friendly: every tile has an icon + label. No proprietary symbol sets.
 */

import type { Board } from '@/types';
import { newId } from '@/types';

const CAT_NAMES: Record<string, string> = {
  needs: 'Nevoi',
  feelings: 'Sentimente',
  food: 'Mâncare',
  play: 'Joc',
  people: 'Oameni'
};

const DEFAULT_BOARD_NAME = 'Tabloul meu';

interface SeedTile {
  id: string;
  cat: string;
  label: string;
  speech: string;
  icon: string;
  order: number;
}

/** Build one demo board: Nevoi, Sentimente, Mâncare, Joc, Oameni – with icons and more words */
export function buildSeedBoard(): Board {
  const tileList: SeedTile[] = [
    // Nevoi
    { id: 't1', cat: 'needs', label: 'Apă', speech: 'Apă', icon: '💧', order: 0 },
    { id: 't2', cat: 'needs', label: 'Mâncare', speech: 'Mâncare', icon: '🍽️', order: 1 },
    { id: 't3', cat: 'needs', label: 'Toaletă', speech: 'Toaletă', icon: '🚽', order: 2 },
    { id: 't4', cat: 'needs', label: 'Ajutor', speech: 'Ajutor', icon: '🆘', order: 3 },
    { id: 't5', cat: 'needs', label: 'Pauză', speech: 'Am nevoie de pauză', icon: '⏸️', order: 4 },
    { id: 't6', cat: 'needs', label: 'Somnic', speech: 'Vreau să dorm', icon: '😴', order: 5 },
    { id: 't7', cat: 'needs', label: 'Îmi e cald', speech: 'Îmi e cald', icon: '🌡️', order: 6 },
    { id: 't8', cat: 'needs', label: 'Îmi e frig', speech: 'Îmi e frig', icon: '🧊', order: 7 },
    { id: 't9', cat: 'needs', label: 'Durere', speech: 'Mă doare', icon: '🩹', order: 8 },
    { id: 't10', cat: 'needs', label: 'Medic', speech: 'Vreau la doctor', icon: '👨‍⚕️', order: 9 },
    // Sentimente
    { id: 't11', cat: 'feelings', label: 'Fericit', speech: 'Mă simt bine', icon: '😊', order: 0 },
    { id: 't12', cat: 'feelings', label: 'Trist', speech: 'Mă simt trist', icon: '😢', order: 1 },
    { id: 't13', cat: 'feelings', label: 'Supărat', speech: 'Sunt supărat', icon: '😠', order: 2 },
    { id: 't14', cat: 'feelings', label: 'Frică', speech: 'Mi-e frică', icon: '😨', order: 3 },
    { id: 't15', cat: 'feelings', label: 'Obosit', speech: 'Sunt obosit', icon: '😓', order: 4 },
    { id: 't16', cat: 'feelings', label: 'Prea zgomot', speech: 'E prea zgomot', icon: '🔇', order: 5 },
    { id: 't17', cat: 'feelings', label: 'Îngrijorat', speech: 'Sunt îngrijorat', icon: '😟', order: 6 },
    { id: 't18', cat: 'feelings', label: 'Nervos', speech: 'Sunt nervos', icon: '😤', order: 7 },
    { id: 't19', cat: 'feelings', label: 'Liniștit', speech: 'Mă simt liniștit', icon: '😌', order: 8 },
    { id: 't20', cat: 'feelings', label: 'Entuziasmat', speech: 'Sunt entuziasmat', icon: '🤩', order: 9 },
    // Mâncare
    { id: 't21', cat: 'food', label: 'Măr', speech: 'Măr', icon: '🍎', order: 0 },
    { id: 't22', cat: 'food', label: 'Pâine', speech: 'Pâine', icon: '🍞', order: 1 },
    { id: 't23', cat: 'food', label: 'Lapte', speech: 'Lapte', icon: '🥛', order: 2 },
    { id: 't24', cat: 'food', label: 'Suc', speech: 'Suc', icon: '🧃', order: 3 },
    { id: 't25', cat: 'food', label: 'Branză', speech: 'Branză', icon: '🧀', order: 4 },
    { id: 't26', cat: 'food', label: 'Ou', speech: 'Ou', icon: '🥚', order: 5 },
    { id: 't27', cat: 'food', label: 'Cereale', speech: 'Cereale', icon: '🥣', order: 6 },
    { id: 't28', cat: 'food', label: 'Biscuiți', speech: 'Biscuiți', icon: '🍪', order: 7 },
    { id: 't29', cat: 'food', label: 'Banane', speech: 'Banane', icon: '🍌', order: 8 },
    { id: 't30', cat: 'food', label: 'Pizza', speech: 'Pizza', icon: '🍕', order: 9 },
    // Joc
    { id: 't31', cat: 'play', label: 'Joc', speech: 'Vreau să mă joc', icon: '🎮', order: 0 },
    { id: 't32', cat: 'play', label: 'Afară', speech: 'Afară', icon: '🌳', order: 1 },
    { id: 't33', cat: 'play', label: 'Carte', speech: 'Carte', icon: '📖', order: 2 },
    { id: 't34', cat: 'play', label: 'Muzică', speech: 'Muzică', icon: '🎵', order: 3 },
    { id: 't35', cat: 'play', label: 'Desen', speech: 'Vreau să desenez', icon: '🖍️', order: 4 },
    { id: 't36', cat: 'play', label: 'Puzzle', speech: 'Puzzle', icon: '🧩', order: 5 },
    { id: 't37', cat: 'play', label: 'Minge', speech: 'Minge', icon: '⚽', order: 6 },
    { id: 't38', cat: 'play', label: 'Film', speech: 'Vreau un film', icon: '🎬', order: 7 },
    { id: 't39', cat: 'play', label: 'Înot', speech: 'Vreau la înot', icon: '🏊', order: 8 },
    { id: 't40', cat: 'play', label: 'Parc', speech: 'La parc', icon: '🛝', order: 9 },
    // Oameni
    { id: 't41', cat: 'people', label: 'Mami', speech: 'Mami', icon: '👩', order: 0 },
    { id: 't42', cat: 'people', label: 'Tati', speech: 'Tati', icon: '👨', order: 1 },
    { id: 't43', cat: 'people', label: 'Da', speech: 'Da', icon: '✅', order: 2 },
    { id: 't44', cat: 'people', label: 'Nu', speech: 'Nu', icon: '❌', order: 3 },
    { id: 't45', cat: 'people', label: 'Mai vreau', speech: 'Mai vreau', icon: '➕', order: 4 },
    { id: 't46', cat: 'people', label: 'Gata', speech: 'Gata', icon: '🛑', order: 5 },
    { id: 't47', cat: 'people', label: 'Te iubesc', speech: 'Te iubesc', icon: '❤️', order: 6 },
    { id: 't48', cat: 'people', label: 'Mulțumesc', speech: 'Mulțumesc', icon: '🙏', order: 7 },
    { id: 't49', cat: 'people', label: 'Bună ziua', speech: 'Bună ziua', icon: '👋', order: 8 },
    { id: 't50', cat: 'people', label: 'La revedere', speech: 'La revedere', icon: '👋', order: 9 }
  ];

  const idsByCat: Record<string, string[]> = {
    needs: [],
    feelings: [],
    food: [],
    play: [],
    people: []
  };

  const tiles: Record<string, { id: string; label: string; speechText: string; icon: string; order: number }> = {};
  tileList.forEach((t) => {
    const id = newId();
    tiles[id] = {
      id,
      label: t.label,
      speechText: t.speech,
      icon: t.icon,
      order: t.order
    };
    const list = idsByCat[t.cat];
    if (list) list.push(id);
  });

  const catIds = ['needs', 'feelings', 'food', 'play', 'people'];
  const categories: Record<string, { id: string; name: string; tileIds: string[]; order: number; icon?: string }> = {};
  const categoryIdList: string[] = [];

  catIds.forEach((key, index) => {
    const cid = newId();
    categoryIdList.push(cid);
    categories[cid] = {
      id: cid,
      name: CAT_NAMES[key] ?? key,
      tileIds: idsByCat[key] ?? [],
      order: index,
      icon: { needs: '💧', feelings: '💭', food: '🍎', play: '🎈', people: '👨‍👩‍👧' }[key]
    };
  });

  const tileRecord: Record<string, import('@/types').Tile> = {};
  Object.values(tiles).forEach((t) => {
    tileRecord[t.id] = { ...t, hidden: false, locked: false };
  });

  const categoryRecord: Record<string, import('@/types').Category> = {};
  Object.values(categories).forEach((c) => {
    categoryRecord[c.id] = c;
  });

  return {
    id: newId(),
    name: DEFAULT_BOARD_NAME,
    columns: 4,
    rows: 5,
    categoryIds: categoryIdList,
    categories: categoryRecord,
    tiles: tileRecord,
    updatedAt: Date.now()
  };
}
