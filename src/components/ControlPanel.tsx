import type { Difficulty, GamePhase } from '../lib/game/types';

interface ControlPanelProps {
  difficulty: Difficulty;
  mode: 'light' | 'dark';
  phase: GamePhase;
  obstaclesEnabled: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: 'light' | 'dark') => void;
  onObstaclesChange: (enabled: boolean) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
}

const buttonClass =
  'flex h-10 w-full min-w-0 items-center justify-center overflow-hidden rounded-md border border-[var(--color-grid)] px-3 text-sm font-medium whitespace-nowrap text-ellipsis transition disabled:cursor-not-allowed disabled:opacity-45';

const primaryButtonClass = `${buttonClass} bg-[var(--color-primary)] text-[var(--color-bg)] border-transparent hover:bg-[var(--color-primary-strong)]`;
const quietButtonClass = `${buttonClass} bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]`;

export function ControlPanel({
  difficulty,
  mode,
  phase,
  obstaclesEnabled,
  onDifficultyChange,
  onModeChange,
  onObstaclesChange,
  onStart,
  onPause,
  onResume,
  onRestart,
}: ControlPanelProps) {
  const settingsLocked = phase === 'running' || phase === 'paused';
  const isDark = mode === 'dark';

  return (
    <section
      aria-label="Game controls"
      className="w-full rounded-md border border-[var(--color-grid)] bg-[var(--color-surface)] p-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-1 text-sm text-[var(--color-text-muted)]">
          Difficulty
          <select
            className="h-10 min-w-0 rounded-md border border-[var(--color-grid)] bg-[var(--color-bg)] px-3 text-[var(--color-text)] disabled:opacity-45"
            disabled={settingsLocked}
            value={difficulty}
            onChange={(event) => onDifficultyChange(event.target.value as Difficulty)}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex h-10 items-center gap-2 rounded-md border border-[var(--color-grid)] px-3 text-sm text-[var(--color-text)]">
            <input
              className="size-4 shrink-0 accent-[var(--color-primary)]"
              checked={obstaclesEnabled}
              disabled={settingsLocked}
              type="checkbox"
              onChange={(event) => onObstaclesChange(event.target.checked)}
            />
            <span className="truncate">Obstacles</span>
          </label>

          <button
            aria-pressed={isDark}
            className={quietButtonClass}
            type="button"
            onClick={() => onModeChange(isDark ? 'light' : 'dark')}
          >
            {isDark ? 'Dark' : 'Light'}
          </button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          className={primaryButtonClass}
          disabled={phase !== 'ready'}
          type="button"
          onClick={onStart}
        >
          Start
        </button>
        <button
          className={quietButtonClass}
          disabled={phase !== 'running'}
          type="button"
          onClick={onPause}
        >
          Pause
        </button>
        <button
          className={quietButtonClass}
          disabled={phase !== 'paused'}
          type="button"
          onClick={onResume}
        >
          Resume
        </button>
        <button className={quietButtonClass} type="button" onClick={onRestart}>
          Restart
        </button>
      </div>
    </section>
  );
}
