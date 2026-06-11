import type { Difficulty, GamePhase, Speed } from '../lib/game/types';
import { SPEED_OPTIONS, THEME_OPTIONS, type ThemeId } from '../store/gameStore';

interface ControlPanelProps {
  difficulty: Difficulty;
  mode: 'light' | 'dark';
  speed: Speed;
  themeId: ThemeId;
  phase: GamePhase;
  obstaclesEnabled: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: 'light' | 'dark') => void;
  onSpeedChange: (speed: Speed) => void;
  onThemeIdChange: (themeId: ThemeId) => void;
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
const segmentButtonClass =
  'flex h-9 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-md px-2 text-sm font-medium whitespace-nowrap text-ellipsis transition disabled:cursor-not-allowed disabled:opacity-45';
const segmentActiveClass = `${segmentButtonClass} bg-[var(--color-primary)] text-[var(--color-bg)]`;
const segmentIdleClass = `${segmentButtonClass} bg-[var(--color-bg)] text-[var(--color-text)] hover:bg-[var(--color-surface-muted)]`;

const DIFFICULTY_OPTIONS: Array<{ id: Difficulty; label: string }> = [
  { id: 'easy', label: 'Easy' },
  { id: 'normal', label: 'Normal' },
  { id: 'hard', label: 'Hard' },
];

export function ControlPanel({
  difficulty,
  mode,
  speed,
  themeId,
  phase,
  obstaclesEnabled,
  onDifficultyChange,
  onModeChange,
  onSpeedChange,
  onThemeIdChange,
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
      <div className="grid gap-3">
        <SegmentedControl
          disabled={settingsLocked}
          label="Difficulty"
          options={DIFFICULTY_OPTIONS}
          value={difficulty}
          onChange={onDifficultyChange}
        />

        <SegmentedControl
          label="Theme"
          options={THEME_OPTIONS}
          value={themeId}
          onChange={onThemeIdChange}
        />

        <SegmentedControl
          disabled={settingsLocked}
          label="Speed"
          options={SPEED_OPTIONS}
          value={speed}
          onChange={onSpeedChange}
        />

        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
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

      <section
        aria-label="Keyboard shortcuts"
        className="mt-3 grid gap-1 rounded-md border border-[var(--color-grid)] bg-[var(--color-bg)] p-2 text-xs text-[var(--color-text-muted)]"
      >
        <ShortcutRow action="Move" keys="Arrow keys / WASD" />
        <ShortcutRow action="Start / pause / resume" keys="Space" />
        <ShortcutRow action="Restart" keys="R" />
      </section>
    </section>
  );
}

function SegmentedControl<TValue extends string>({
  disabled = false,
  label,
  options,
  value,
  onChange,
}: {
  disabled?: boolean;
  label: string;
  options: Array<{ id: TValue; label: string }>;
  value: TValue;
  onChange: (value: TValue) => void;
}) {
  return (
    <fieldset aria-label={label} className="min-w-0">
      <legend className="mb-1 text-sm text-[var(--color-text-muted)]">{label}</legend>
      <div className="grid min-w-0 grid-cols-3 gap-1 rounded-md border border-[var(--color-grid)] bg-[var(--color-surface-muted)] p-1">
        {options.map((option) => {
          const selected = option.id === value;

          return (
            <button
              key={option.id}
              aria-pressed={selected}
              className={selected ? segmentActiveClass : segmentIdleClass}
              disabled={disabled}
              type="button"
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ShortcutRow({ action, keys }: { action: string; keys: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <span className="truncate">{action}</span>
      <kbd className="rounded-sm border border-[var(--color-grid)] bg-[var(--color-surface)] px-1.5 py-0.5 font-mono text-[var(--color-text)]">
        {keys}
      </kbd>
    </div>
  );
}
