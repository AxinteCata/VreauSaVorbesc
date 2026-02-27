/**
 * Category tabs: switch between Nevoi, Sentimente, Mâncare, etc. Large touch targets.
 */

import type { Category } from '@/types';

interface CategoryNavProps {
  categories: (Category | null)[];
  currentId: string | null;
  onSelect: (id: string) => void;
  lowStimulation?: boolean;
  disabled?: boolean;
}

export function CategoryNav({
  categories,
  currentId,
  onSelect,
  lowStimulation,
  disabled
}: CategoryNavProps) {
  const list = categories.filter((c): c is Category => c !== null);

  return (
    <nav
      className="flex gap-2 mb-4 overflow-x-auto pb-1"
      aria-label="Categorii tablou"
    >
      {list.map((cat) => {
        const isActive = cat.id === currentId;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => !disabled && onSelect(cat.id)}
            disabled={disabled}
            className={`
              flex-shrink-0 px-4 py-3 rounded-card font-semibold border-2 h-12
              focus:outline-none focus-visible:ring-2 focus-visible:ring-aac-primary focus-visible:ring-offset-2
              ${isActive
                ? 'bg-aac-primary text-white border-aac-primary'
                : 'bg-white text-aac-primary border-aac-border hover:border-aac-primaryLight'}
              ${lowStimulation ? '' : 'transition-colors'}
              ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            `}
            aria-label={`Categorie ${cat.name}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {cat.icon && <span className="mr-1.5" aria-hidden>{cat.icon}</span>}
            {cat.name}
          </button>
        );
      })}
    </nav>
  );
}
