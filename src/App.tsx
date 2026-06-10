import { useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { GameBoard } from './components/GameBoard';
import { ScorePanel } from './components/ScorePanel';
import { StatusOverlay } from './components/StatusOverlay';
import { TouchControls } from './components/TouchControls';
import { useSnakeGame } from './hooks/useSnakeGame';
import type { Difficulty, Direction, GameState } from './lib/game/types';
import { useGameStore, type ThemeMode } from './store/gameStore';

const phaseLabels = {
  ready: 'Ready',
  running: 'Playing',
  paused: 'Paused',
  gameOver: 'Game Over',
};

export default function App() {
  const difficulty = useGameStore((store) => store.difficulty);
  const mode = useGameStore((store) => store.mode);
  const score = useGameStore((store) => store.score);
  const bestScore = useGameStore((store) => store.bestScore);
  const setDifficulty = useGameStore((store) => store.setDifficulty);
  const setMode = useGameStore((store) => store.setMode);
  const game = useSnakeGame();

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-4 px-3 py-4 sm:px-4 lg:px-6 lg:py-6">
        <GameHeader difficulty={difficulty} state={game.state} />

        <section className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <BoardArea mode={mode} state={game.state} onDirection={game.requestDirection} />

          <SidePanel
            bestScore={bestScore}
            difficulty={difficulty}
            mode={mode}
            obstaclesEnabled={game.obstaclesEnabled}
            phase={game.state.phase}
            score={score}
            onDifficultyChange={setDifficulty}
            onModeChange={setMode}
            onObstaclesChange={game.setObstaclesEnabled}
            onPause={game.pause}
            onRestart={game.restart}
            onResume={game.resume}
            onStart={game.start}
          />
        </section>
      </div>
    </main>
  );
}

function GameHeader({ difficulty, state }: { difficulty: Difficulty; state: GameState }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-2">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-normal sm:text-2xl">Snake Game</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          {phaseLabels[state.phase]} / {difficulty}
        </p>
      </div>
    </header>
  );
}

function BoardArea({
  mode,
  state,
  onDirection,
}: {
  mode: ThemeMode;
  state: GameState;
  onDirection: (direction: Direction) => void;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <div className="relative w-full max-w-[min(100%,calc(100dvh-15rem))] sm:max-w-[min(100%,calc(100dvh-13rem))] lg:max-w-[min(100%,calc(100dvh-9rem))]">
        <GameBoard mode={mode} state={state} onDirection={onDirection} />
        <StatusOverlay phase={state.phase} />
      </div>

      <TouchControls onDirection={onDirection} />
    </div>
  );
}

interface SidePanelProps {
  bestScore: number;
  difficulty: Difficulty;
  mode: ThemeMode;
  obstaclesEnabled: boolean;
  phase: GameState['phase'];
  score: number;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: ThemeMode) => void;
  onObstaclesChange: (enabled: boolean) => void;
  onPause: () => void;
  onRestart: () => void;
  onResume: () => void;
  onStart: () => void;
}

function SidePanel({
  bestScore,
  difficulty,
  mode,
  obstaclesEnabled,
  phase,
  score,
  onDifficultyChange,
  onModeChange,
  onObstaclesChange,
  onPause,
  onRestart,
  onResume,
  onStart,
}: SidePanelProps) {
  return (
    <aside className="flex min-w-0 flex-col gap-3">
      <ScorePanel bestScore={bestScore} score={score} />
      <ControlPanel
        difficulty={difficulty}
        mode={mode}
        obstaclesEnabled={obstaclesEnabled}
        phase={phase}
        onDifficultyChange={onDifficultyChange}
        onModeChange={onModeChange}
        onObstaclesChange={onObstaclesChange}
        onPause={onPause}
        onRestart={onRestart}
        onResume={onResume}
        onStart={onStart}
      />
    </aside>
  );
}
