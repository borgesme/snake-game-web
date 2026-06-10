import type { Direction } from '../lib/game/types';

interface TouchControlsProps {
  onDirection: (direction: Direction) => void;
}

const touchButtonClass =
  'flex size-14 touch-manipulation items-center justify-center rounded-md border border-[var(--color-grid)] bg-[var(--color-surface)] text-xl font-semibold text-[var(--color-text)] active:bg-[var(--color-surface-muted)]';

export function TouchControls({ onDirection }: TouchControlsProps) {
  return (
    <nav aria-label="Touch controls" className="grid w-fit grid-cols-3 gap-2 sm:hidden">
      <button
        aria-label="Move up"
        className={`${touchButtonClass} col-start-2`}
        type="button"
        onClick={() => onDirection('up')}
      >
        ↑
      </button>
      <button
        aria-label="Move left"
        className={touchButtonClass}
        type="button"
        onClick={() => onDirection('left')}
      >
        ←
      </button>
      <button
        aria-label="Move down"
        className={touchButtonClass}
        type="button"
        onClick={() => onDirection('down')}
      >
        ↓
      </button>
      <button
        aria-label="Move right"
        className={touchButtonClass}
        type="button"
        onClick={() => onDirection('right')}
      >
        →
      </button>
    </nav>
  );
}
