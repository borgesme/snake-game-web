import type { GamePhase } from '../lib/game/types';

interface StatusOverlayProps {
  phase: GamePhase;
}

const labels: Record<Exclude<GamePhase, 'running'>, string> = {
  ready: 'Ready',
  paused: 'Paused',
  gameOver: 'Game Over',
};

/** Parent board wrapper must be positioned so this absolute overlay covers it. */
export function StatusOverlay({ phase }: StatusOverlayProps) {
  if (phase === 'running') {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span className="rounded-md border border-[var(--color-grid)] bg-[var(--color-surface)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] shadow-sm">
        {labels[phase]}
      </span>
    </div>
  );
}
