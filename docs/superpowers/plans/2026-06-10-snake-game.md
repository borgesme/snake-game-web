# Snake Game Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern minimal responsive Snake SPA for desktop web and H5 mobile.

**Architecture:** Vite creates the React TypeScript SPA. Pure TypeScript modules own snake rules and score math, React owns UI and input wiring, Canvas owns board rendering, and zustand owns difficulty, theme, and score state.

**Tech Stack:** Vite 8, React 19, TypeScript 6, Canvas 2D, Tailwind CSS v4, zustand 5, Vitest 4, Testing Library.

---

## Source Spec

- `docs/superpowers/specs/2026-06-10-snake-game-design.md`

## File Structure

- Create `package.json`: scripts and dependencies.
- Create `index.html`: Vite HTML entry.
- Create `vite.config.ts`: React, Tailwind v4 Vite plugin, Vitest jsdom config.
- Create `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`: TypeScript project config.
- Create `src/main.tsx`: React bootstrap.
- Create `src/App.tsx`: single-page game shell.
- Create `src/index.css`: Tailwind import, theme variables, responsive base styles.
- Create `src/lib/game/types.ts`: shared game types.
- Create `src/lib/game/config.ts`: board, difficulty, speed, scoring constants.
- Create `src/lib/game/engine.ts`: pure snake state creation and tick logic.
- Create `src/lib/game/renderer.ts`: Canvas drawing.
- Create `src/lib/game/engine.test.ts`: engine behavior tests.
- Create `src/store/gameStore.ts`: zustand store for difficulty, theme, and score.
- Create `src/store/gameStore.test.ts`: store tests.
- Create `src/components/GameBoard.tsx`: Canvas lifecycle and resize behavior.
- Create `src/components/ControlPanel.tsx`: difficulty, obstacle, theme, and game action controls.
- Create `src/components/ScorePanel.tsx`: score display.
- Create `src/components/TouchControls.tsx`: H5 direction controls.
- Create `src/components/StatusOverlay.tsx`: ready, paused, and game-over overlays.
- Create `src/hooks/useSnakeGame.ts`: controller hook that connects engine, timer, store, and input.
- Create `src/test/setup.ts`: test setup for jsdom.

---

### Task 1: Scaffold Vite React TypeScript App

**Files:**

- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create project manifest**

Create `package.json`:

```json
{
  "name": "snake-game-web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 0.0.0.0",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7",
    "zustand": "^5.0.14"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^25.9.2",
    "@types/react": "^19.2.17",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.2",
    "jsdom": "^29.1.1",
    "tailwindcss": "^4.3.0",
    "typescript": "^6.0.3",
    "vite": "^8.0.16",
    "vitest": "^4.1.8"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run:

```powershell
pnpm install --store-dir D:\.pnpm-store
```

Expected: dependencies install successfully and `pnpm-lock.yaml` is created.

- [ ] **Step 3: Create Vite entry files**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Snake Game</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-4 py-6">
        <h1 className="text-2xl font-semibold">Snake Game</h1>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Configure Vite, TypeScript, CSS, and tests**

Create `vite.config.ts`:

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [{ "path": "./tsconfig.app.json" }, { "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

Create `src/index.css`:

```css
@import 'tailwindcss';

:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-surface-muted: #e2e8f0;
  --color-text: #0f172a;
  --color-text-muted: #475569;
  --color-primary: #0f766e;
  --color-primary-strong: #115e59;
  --color-danger: #dc2626;
  --color-food: #dc2626;
  --color-obstacle: #64748b;
  --color-grid: #dbe4ee;
}

[data-mode='dark'] {
  --color-bg: #111827;
  --color-surface: #1f2937;
  --color-surface-muted: #374151;
  --color-text: #f8fafc;
  --color-text-muted: #cbd5e1;
  --color-primary: #2dd4bf;
  --color-primary-strong: #14b8a6;
  --color-danger: #fb7185;
  --color-food: #fb7185;
  --color-obstacle: #94a3b8;
  --color-grid: #334155;
}

html,
body,
#root {
  min-height: 100%;
}

body {
  margin: 0;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

button,
select {
  font: inherit;
}
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: Verify scaffold**

Run:

```powershell
pnpm build
```

Expected: TypeScript and Vite build complete without errors.

- [ ] **Step 6: Commit scaffold**

```powershell
git add package.json pnpm-lock.yaml index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json src
git commit -m "feat: 初始化贪吃蛇 SPA 项目"
```

---

### Task 2: Add Game Types And Engine Tests

**Files:**

- Create: `src/lib/game/types.ts`
- Create: `src/lib/game/config.ts`
- Create: `src/lib/game/engine.ts`
- Create: `src/lib/game/engine.test.ts`

- [ ] **Step 1: Add shared game types**

Create `src/lib/game/types.ts`:

```ts
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GamePhase = 'ready' | 'running' | 'paused' | 'gameOver';
export type Difficulty = 'easy' | 'normal' | 'hard';

export type Point = {
  x: number;
  y: number;
};

export type DifficultyConfig = {
  initialTickMs: number;
  minTickMs: number;
  scoreMultiplier: number;
  obstacleCount: number;
};

export type GameSettings = {
  difficulty: Difficulty;
  obstaclesEnabled: boolean;
};

export type GameState = {
  phase: GamePhase;
  boardSize: number;
  difficulty: Difficulty;
  snake: Point[];
  direction: Direction;
  nextDirection: Direction;
  food: Point;
  obstacles: Point[];
  foodsEaten: number;
  tickMs: number;
};

export type TickResult = {
  state: GameState;
  ateFood: boolean;
  scoreDelta: number;
};
```

Create `src/lib/game/config.ts`:

```ts
import type { Difficulty, DifficultyConfig } from './types';

export const BOARD_SIZE = 20;
export const START_SNAKE = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: { initialTickMs: 160, minTickMs: 60, scoreMultiplier: 1, obstacleCount: 4 },
  normal: { initialTickMs: 120, minTickMs: 60, scoreMultiplier: 1.5, obstacleCount: 7 },
  hard: { initialTickMs: 90, minTickMs: 60, scoreMultiplier: 2, obstacleCount: 10 },
};

export const FOOD_SCORE = 10;
export const SPEEDUP_EVERY_FOODS = 5;
export const SPEEDUP_STEP_MS = 8;
```

- [ ] **Step 2: Write failing engine tests**

Create `src/lib/game/engine.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createInitialState, getNextDirection, hasPoint, tick } from './engine';
import type { GameState } from './types';

describe('snake engine', () => {
  it('creates an initial board with snake, food, and normal speed', () => {
    const state = createInitialState({ difficulty: 'normal', obstaclesEnabled: false });

    expect(state.phase).toBe('ready');
    expect(state.boardSize).toBe(20);
    expect(state.snake).toHaveLength(3);
    expect(state.tickMs).toBe(120);
    expect(state.obstacles).toHaveLength(0);
    expect(hasPoint(state.snake, state.food)).toBe(false);
  });

  it('prevents direct reverse direction', () => {
    expect(getNextDirection('right', 'left')).toBe('right');
    expect(getNextDirection('right', 'up')).toBe('up');
  });

  it('moves the snake without growing when no food is eaten', () => {
    const state: GameState = {
      ...createInitialState({ difficulty: 'easy', obstaclesEnabled: false }),
      phase: 'running',
      food: { x: 15, y: 15 },
    };

    const result = tick(state, 'right');

    expect(result.ateFood).toBe(false);
    expect(result.scoreDelta).toBe(0);
    expect(result.state.snake[0]).toEqual({ x: 9, y: 10 });
    expect(result.state.snake).toHaveLength(3);
  });

  it('grows and scores when food is eaten', () => {
    const state: GameState = {
      ...createInitialState({ difficulty: 'hard', obstaclesEnabled: false }),
      phase: 'running',
      food: { x: 9, y: 10 },
    };

    const result = tick(state, 'right');

    expect(result.ateFood).toBe(true);
    expect(result.scoreDelta).toBe(20);
    expect(result.state.snake).toHaveLength(4);
    expect(hasPoint(result.state.snake, result.state.food)).toBe(false);
  });

  it('ends the game when the snake hits a wall', () => {
    const state: GameState = {
      ...createInitialState({ difficulty: 'easy', obstaclesEnabled: false }),
      phase: 'running',
      snake: [{ x: 19, y: 10 }],
      direction: 'right',
      nextDirection: 'right',
      food: { x: 5, y: 5 },
    };

    const result = tick(state, 'right');

    expect(result.state.phase).toBe('gameOver');
  });

  it('ends the game when the snake hits itself', () => {
    const state: GameState = {
      ...createInitialState({ difficulty: 'easy', obstaclesEnabled: false }),
      phase: 'running',
      snake: [
        { x: 5, y: 5 },
        { x: 5, y: 6 },
        { x: 4, y: 6 },
        { x: 4, y: 5 },
      ],
      direction: 'right',
      nextDirection: 'down',
      food: { x: 10, y: 10 },
    };

    const result = tick(state, 'down');

    expect(result.state.phase).toBe('gameOver');
  });

  it('ends the game when the snake hits an obstacle', () => {
    const state: GameState = {
      ...createInitialState({ difficulty: 'easy', obstaclesEnabled: true }),
      phase: 'running',
      obstacles: [{ x: 9, y: 10 }],
      food: { x: 15, y: 15 },
    };

    const result = tick(state, 'right');

    expect(result.state.phase).toBe('gameOver');
  });

  it('speeds up every five foods without passing the minimum speed', () => {
    const state: GameState = {
      ...createInitialState({ difficulty: 'easy', obstaclesEnabled: false }),
      phase: 'running',
      foodsEaten: 4,
      tickMs: 64,
      food: { x: 9, y: 10 },
    };

    const result = tick(state, 'right');

    expect(result.state.tickMs).toBe(60);
  });
});
```

- [ ] **Step 3: Add engine failing-test stubs to make the failure reason focused**

Create `src/lib/game/engine.ts`:

```ts
import type { Direction, GameSettings, GameState, Point, TickResult } from './types';

export function createInitialState(_settings: GameSettings): GameState {
  throw new Error('createInitialState is not implemented');
}

export function getNextDirection(_current: Direction, _requested: Direction): Direction {
  throw new Error('getNextDirection is not implemented');
}

export function hasPoint(_points: Point[], _point: Point): boolean {
  throw new Error('hasPoint is not implemented');
}

export function tick(_state: GameState, _requestedDirection: Direction): TickResult {
  throw new Error('tick is not implemented');
}
```

- [ ] **Step 4: Run engine tests and verify they fail**

Run:

```powershell
pnpm test -- src/lib/game/engine.test.ts
```

Expected: FAIL with implementation errors from `engine.ts`.

---

### Task 3: Implement Pure Snake Engine

**Files:**

- Modify: `src/lib/game/engine.ts`
- Test: `src/lib/game/engine.test.ts`

**Plan update from code review:** `GameState` stores the run's `difficulty`, and `tick` reads scoring/speed settings from `state.difficulty` instead of accepting difficulty as a separate argument. This prevents running-game settings from drifting if the store changes later.

- [ ] **Step 1: Implement engine**

Replace `src/lib/game/engine.ts` with:

```ts
import {
  BOARD_SIZE,
  DIFFICULTY_CONFIG,
  FOOD_SCORE,
  SPEEDUP_EVERY_FOODS,
  SPEEDUP_STEP_MS,
  START_SNAKE,
} from './config';
import type { Difficulty, Direction, GameSettings, GameState, Point, TickResult } from './types';

const DIRECTION_DELTA: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

const REVERSE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(settings: GameSettings): GameState {
  const config = DIFFICULTY_CONFIG[settings.difficulty];
  const snake = START_SNAKE.map((point) => ({ ...point }));
  const obstacles = settings.obstaclesEnabled ? createObstacles(config.obstacleCount, snake) : [];

  return {
    phase: 'ready',
    boardSize: BOARD_SIZE,
    difficulty: settings.difficulty,
    snake,
    direction: 'right',
    nextDirection: 'right',
    food: createFood(snake, obstacles),
    obstacles,
    foodsEaten: 0,
    tickMs: config.initialTickMs,
  };
}

export function getNextDirection(current: Direction, requested: Direction): Direction {
  return REVERSE[current] === requested ? current : requested;
}

export function hasPoint(points: Point[], point: Point): boolean {
  return points.some((candidate) => candidate.x === point.x && candidate.y === point.y);
}

export function tick(state: GameState, requestedDirection: Direction): TickResult {
  if (state.phase !== 'running') {
    return { state, ateFood: false, scoreDelta: 0 };
  }

  const direction = getNextDirection(state.direction, requestedDirection);
  const head = state.snake[0];
  const delta = DIRECTION_DELTA[direction];
  const nextHead = { x: head.x + delta.x, y: head.y + delta.y };
  const eatsFood = pointsEqual(nextHead, state.food);
  const bodyForCollision = eatsFood ? state.snake : state.snake.slice(0, -1);

  if (
    isOutsideBoard(nextHead) ||
    hasPoint(bodyForCollision, nextHead) ||
    hasPoint(state.obstacles, nextHead)
  ) {
    return {
      state: { ...state, phase: 'gameOver', direction, nextDirection: direction },
      ateFood: false,
      scoreDelta: 0,
    };
  }

  const snake = [nextHead, ...state.snake];
  if (!eatsFood) {
    snake.pop();
  }

  const foodsEaten = eatsFood ? state.foodsEaten + 1 : state.foodsEaten;
  const tickMs = calculateTickMs(state.tickMs, foodsEaten, state.difficulty, eatsFood);
  const scoreDelta = eatsFood
    ? Math.round(FOOD_SCORE * DIFFICULTY_CONFIG[state.difficulty].scoreMultiplier)
    : 0;

  return {
    state: {
      ...state,
      snake,
      direction,
      nextDirection: direction,
      food: eatsFood ? createFood(snake, state.obstacles) : state.food,
      foodsEaten,
      tickMs,
    },
    ateFood: eatsFood,
    scoreDelta,
  };
}

function createFood(snake: Point[], obstacles: Point[]): Point {
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const candidate = { x, y };
      if (!hasPoint(snake, candidate) && !hasPoint(obstacles, candidate)) {
        return candidate;
      }
    }
  }

  return { x: 0, y: 0 };
}

function createObstacles(count: number, snake: Point[]): Point[] {
  const obstacles: Point[] = [];
  const centerStart = Math.floor(BOARD_SIZE / 2) - 2;

  for (let i = 0; obstacles.length < count && i < BOARD_SIZE * BOARD_SIZE; i += 1) {
    const candidate = {
      x: (i * 7 + 3) % BOARD_SIZE,
      y: (i * 5 + 4) % BOARD_SIZE,
    };
    const inStartArea =
      candidate.x >= centerStart &&
      candidate.x <= centerStart + 5 &&
      candidate.y >= centerStart &&
      candidate.y <= centerStart + 5;

    if (!inStartArea && !hasPoint(snake, candidate) && !hasPoint(obstacles, candidate)) {
      obstacles.push(candidate);
    }
  }

  return obstacles;
}

function calculateTickMs(
  currentTickMs: number,
  foodsEaten: number,
  difficulty: Difficulty,
  ateFood: boolean,
): number {
  if (!ateFood || foodsEaten % SPEEDUP_EVERY_FOODS !== 0) {
    return currentTickMs;
  }

  return Math.max(DIFFICULTY_CONFIG[difficulty].minTickMs, currentTickMs - SPEEDUP_STEP_MS);
}

function isOutsideBoard(point: Point): boolean {
  return point.x < 0 || point.y < 0 || point.x >= BOARD_SIZE || point.y >= BOARD_SIZE;
}

function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y;
}
```

- [ ] **Step 2: Run engine tests**

Run:

```powershell
pnpm test -- src/lib/game/engine.test.ts
```

Expected: PASS for all engine tests.

- [ ] **Step 3: Commit engine**

```powershell
git add src/lib/game
git commit -m "feat: 实现贪吃蛇核心规则"
```

---

### Task 4: Implement Store With Tests

**Files:**

- Create: `src/store/gameStore.ts`
- Create: `src/store/gameStore.test.ts`

- [ ] **Step 1: Write store tests**

Create `src/store/gameStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from './gameStore';

describe('game store', () => {
  beforeEach(() => {
    localStorage.clear();
    useGameStore.getState().resetAll();
  });

  it('updates difficulty', () => {
    useGameStore.getState().setDifficulty('hard');

    expect(useGameStore.getState().difficulty).toBe('hard');
  });

  it('updates theme mode and theme id', () => {
    useGameStore.getState().setMode('dark');
    useGameStore.getState().setThemeId('minimal');

    expect(useGameStore.getState().mode).toBe('dark');
    expect(useGameStore.getState().themeId).toBe('minimal');
  });

  it('increments current score and persists best score', () => {
    useGameStore.getState().addScore(30);

    expect(useGameStore.getState().score).toBe(30);
    expect(useGameStore.getState().bestScore).toBe(30);
    expect(localStorage.getItem('snake.bestScore')).toBe('30');
  });

  it('does not lower best score', () => {
    useGameStore.getState().addScore(50);
    useGameStore.getState().resetScore();
    useGameStore.getState().addScore(20);

    expect(useGameStore.getState().score).toBe(20);
    expect(useGameStore.getState().bestScore).toBe(50);
  });
});
```

- [ ] **Step 2: Add store implementation**

Create `src/store/gameStore.ts`:

```ts
import { create } from 'zustand';
import type { Difficulty } from '../lib/game/types';

export type ThemeMode = 'light' | 'dark';
export type ThemeId = 'minimal';

type GameStore = {
  difficulty: Difficulty;
  mode: ThemeMode;
  themeId: ThemeId;
  score: number;
  bestScore: number;
  setDifficulty: (difficulty: Difficulty) => void;
  setMode: (mode: ThemeMode) => void;
  setThemeId: (themeId: ThemeId) => void;
  addScore: (delta: number) => void;
  resetScore: () => void;
  resetAll: () => void;
};

const BEST_SCORE_KEY = 'snake.bestScore';

export const useGameStore = create<GameStore>((set, get) => ({
  difficulty: 'normal',
  mode: 'light',
  themeId: 'minimal',
  score: 0,
  bestScore: readBestScore(),
  setDifficulty: (difficulty) => set({ difficulty }),
  setMode: (mode) => set({ mode }),
  setThemeId: (themeId) => set({ themeId }),
  addScore: (delta) => {
    const score = get().score + delta;
    const bestScore = Math.max(get().bestScore, score);
    writeBestScore(bestScore);
    set({ score, bestScore });
  },
  resetScore: () => set({ score: 0 }),
  resetAll: () =>
    set({
      difficulty: 'normal',
      mode: 'light',
      themeId: 'minimal',
      score: 0,
      bestScore: readBestScore(),
    }),
}));

function readBestScore(): number {
  try {
    return Number.parseInt(localStorage.getItem(BEST_SCORE_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function writeBestScore(score: number): void {
  try {
    localStorage.setItem(BEST_SCORE_KEY, String(score));
  } catch {
    // Best score persistence is optional when storage is unavailable.
  }
}
```

- [ ] **Step 3: Run store tests**

Run:

```powershell
pnpm test -- src/store/gameStore.test.ts
```

Expected: PASS for all store tests.

- [ ] **Step 4: Commit store**

```powershell
git add src/store
git commit -m "feat: 添加游戏状态 store"
```

---

### Task 5: Add Canvas Renderer And Game Controller Hook

**Files:**

- Create: `src/lib/game/renderer.ts`
- Create: `src/hooks/useSnakeGame.ts`

- [ ] **Step 1: Add Canvas renderer**

Create `src/lib/game/renderer.ts`:

```ts
import type { GameState } from './types';

export type BoardColors = {
  background: string;
  grid: string;
  snake: string;
  snakeHead: string;
  food: string;
  obstacle: string;
};

export function renderBoard(
  canvas: HTMLCanvasElement,
  state: GameState,
  colors: BoardColors,
): void {
  const context = canvas.getContext('2d');
  if (!context) {
    return;
  }

  const size = canvas.width;
  const cell = size / state.boardSize;

  context.clearRect(0, 0, size, size);
  context.fillStyle = colors.background;
  context.fillRect(0, 0, size, size);

  drawGrid(context, state.boardSize, cell, colors.grid);
  drawCells(context, state.obstacles, cell, colors.obstacle, 4);
  drawCells(context, state.snake.slice(1), cell, colors.snake, 5);
  drawCells(context, state.snake.slice(0, 1), cell, colors.snakeHead, 5);
  drawCells(context, [state.food], cell, colors.food, cell / 2);
}

function drawGrid(
  context: CanvasRenderingContext2D,
  boardSize: number,
  cell: number,
  color: string,
): void {
  context.strokeStyle = color;
  context.lineWidth = 1;

  for (let index = 0; index <= boardSize; index += 1) {
    const position = Math.round(index * cell) + 0.5;
    context.beginPath();
    context.moveTo(position, 0);
    context.lineTo(position, boardSize * cell);
    context.stroke();
    context.beginPath();
    context.moveTo(0, position);
    context.lineTo(boardSize * cell, position);
    context.stroke();
  }
}

function drawCells(
  context: CanvasRenderingContext2D,
  cells: { x: number; y: number }[],
  cell: number,
  color: string,
  radius: number,
): void {
  context.fillStyle = color;

  for (const point of cells) {
    const inset = Math.max(3, cell * 0.12);
    const x = point.x * cell + inset;
    const y = point.y * cell + inset;
    const size = cell - inset * 2;

    if (radius >= cell / 2) {
      context.beginPath();
      context.arc(point.x * cell + cell / 2, point.y * cell + cell / 2, size / 2, 0, Math.PI * 2);
      context.fill();
      continue;
    }

    context.beginPath();
    context.roundRect(x, y, size, size, radius);
    context.fill();
  }
}
```

- [ ] **Step 2: Add controller hook**

Create `src/hooks/useSnakeGame.ts`:

```ts
import { useCallback, useEffect, useRef, useState } from 'react';
import { createInitialState, getNextDirection, tick } from '../lib/game/engine';
import type { Direction, GameState } from '../lib/game/types';
import { useGameStore } from '../store/gameStore';

export type SnakeController = {
  state: GameState;
  obstaclesEnabled: boolean;
  setObstaclesEnabled: (enabled: boolean) => void;
  requestDirection: (direction: Direction) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
};

export function useSnakeGame(): SnakeController {
  const difficulty = useGameStore((store) => store.difficulty);
  const addScore = useGameStore((store) => store.addScore);
  const resetScore = useGameStore((store) => store.resetScore);
  const [obstaclesEnabled, setObstaclesEnabled] = useState(false);
  const [state, setState] = useState(() => createInitialState({ difficulty, obstaclesEnabled }));
  const requestedDirection = useRef<Direction>('right');

  const restart = useCallback(() => {
    resetScore();
    requestedDirection.current = 'right';
    setState({ ...createInitialState({ difficulty, obstaclesEnabled }), phase: 'running' });
  }, [difficulty, obstaclesEnabled, resetScore]);

  const start = useCallback(() => {
    resetScore();
    requestedDirection.current = 'right';
    setState({ ...createInitialState({ difficulty, obstaclesEnabled }), phase: 'running' });
  }, [difficulty, obstaclesEnabled, resetScore]);

  const pause = useCallback(() => {
    setState((current) =>
      current.phase === 'running' ? { ...current, phase: 'paused' } : current,
    );
  }, []);

  const resume = useCallback(() => {
    setState((current) =>
      current.phase === 'paused' ? { ...current, phase: 'running' } : current,
    );
  }, []);

  const requestDirection = useCallback((direction: Direction) => {
    requestedDirection.current = direction;
    setState((current) => ({
      ...current,
      nextDirection: getNextDirection(current.direction, direction),
    }));
  }, []);

  useEffect(() => {
    if (state.phase !== 'running') {
      return;
    }

    const timer = window.setTimeout(() => {
      setState((current) => {
        const result = tick(current, requestedDirection.current);
        if (result.scoreDelta > 0) {
          addScore(result.scoreDelta);
        }
        return result.state;
      });
    }, state.tickMs);

    return () => window.clearTimeout(timer);
  }, [addScore, state.phase, state.tickMs, state.snake]);

  useEffect(() => {
    if (state.phase === 'ready') {
      setState(createInitialState({ difficulty, obstaclesEnabled }));
    }
  }, [difficulty, obstaclesEnabled, state.phase]);

  return {
    state,
    obstaclesEnabled,
    setObstaclesEnabled,
    requestDirection,
    start,
    pause,
    resume,
    restart,
  };
}
```

- [ ] **Step 3: Run tests and build**

Run:

```powershell
pnpm test
pnpm build
```

Expected: tests pass and build succeeds.

- [ ] **Step 4: Commit renderer and controller**

```powershell
git add src/lib/game/renderer.ts src/hooks/useSnakeGame.ts
git commit -m "feat: 添加画布渲染和游戏控制器"
```

---

### Task 6: Build React UI Components

**Files:**

- Create: `src/components/GameBoard.tsx`
- Create: `src/components/ControlPanel.tsx`
- Create: `src/components/ScorePanel.tsx`
- Create: `src/components/TouchControls.tsx`
- Create: `src/components/StatusOverlay.tsx`

- [ ] **Step 1: Add GameBoard**

Create `src/components/GameBoard.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import { renderBoard } from '../lib/game/renderer';
import type { Direction, GameState } from '../lib/game/types';

type GameBoardProps = {
  state: GameState;
  mode: 'light' | 'dark';
  onDirection: (direction: Direction) => void;
};

export function GameBoard({ state, mode, onDirection }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const size = Math.floor(rect.width * window.devicePixelRatio);
      canvas.width = size;
      canvas.height = size;
      renderBoard(canvas, state, readBoardColors());
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [state, mode]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const direction = keyToDirection(event.key);
      if (!direction) {
        return;
      }
      event.preventDefault();
      onDirection(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDirection]);

  return (
    <canvas
      ref={canvasRef}
      className="aspect-square w-full rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] shadow-sm"
      aria-label="Snake game board"
    />
  );
}

function keyToDirection(key: string): Direction | null {
  const normalized = key.toLowerCase();
  if (normalized === 'arrowup' || normalized === 'w') return 'up';
  if (normalized === 'arrowdown' || normalized === 's') return 'down';
  if (normalized === 'arrowleft' || normalized === 'a') return 'left';
  if (normalized === 'arrowright' || normalized === 'd') return 'right';
  return null;
}

function readBoardColors() {
  const style = getComputedStyle(document.documentElement);
  return {
    background: style.getPropertyValue('--color-surface').trim(),
    grid: style.getPropertyValue('--color-grid').trim(),
    snake: style.getPropertyValue('--color-primary').trim(),
    snakeHead: style.getPropertyValue('--color-primary-strong').trim(),
    food: style.getPropertyValue('--color-food').trim(),
    obstacle: style.getPropertyValue('--color-obstacle').trim(),
  };
}
```

- [ ] **Step 2: Add ControlPanel**

Create `src/components/ControlPanel.tsx`:

```tsx
import type { Difficulty, GamePhase } from '../lib/game/types';
import type { ThemeMode } from '../store/gameStore';

type ControlPanelProps = {
  difficulty: Difficulty;
  mode: ThemeMode;
  phase: GamePhase;
  obstaclesEnabled: boolean;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: ThemeMode) => void;
  onObstaclesChange: (enabled: boolean) => void;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
};

export function ControlPanel(props: ControlPanelProps) {
  const running = props.phase === 'running';
  const paused = props.phase === 'paused';

  return (
    <section className="grid gap-4 rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] p-4 shadow-sm">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-[var(--color-text-muted)]" htmlFor="difficulty">
          Difficulty
        </label>
        <select
          id="difficulty"
          value={props.difficulty}
          disabled={running || paused}
          onChange={(event) => props.onDifficultyChange(event.target.value as Difficulty)}
          className="rounded-md border border-[var(--color-surface-muted)] bg-transparent px-3 py-2"
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <label className="flex items-center justify-between gap-3 text-sm">
        <span>Obstacles</span>
        <input
          type="checkbox"
          checked={props.obstaclesEnabled}
          disabled={running || paused}
          onChange={(event) => props.onObstaclesChange(event.target.checked)}
        />
      </label>

      <label className="flex items-center justify-between gap-3 text-sm">
        <span>Dark mode</span>
        <input
          type="checkbox"
          checked={props.mode === 'dark'}
          onChange={(event) => props.onModeChange(event.target.checked ? 'dark' : 'light')}
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="rounded-md bg-[var(--color-primary)] px-4 py-2 font-medium text-white"
          onClick={props.onStart}
        >
          Start
        </button>
        <button
          className="rounded-md border border-[var(--color-surface-muted)] px-4 py-2"
          onClick={props.onRestart}
        >
          Restart
        </button>
        <button
          className="rounded-md border border-[var(--color-surface-muted)] px-4 py-2"
          onClick={props.onPause}
          disabled={!running}
        >
          Pause
        </button>
        <button
          className="rounded-md border border-[var(--color-surface-muted)] px-4 py-2"
          onClick={props.onResume}
          disabled={!paused}
        >
          Resume
        </button>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add ScorePanel, TouchControls, and StatusOverlay**

Create `src/components/ScorePanel.tsx`:

```tsx
type ScorePanelProps = {
  score: number;
  bestScore: number;
};

export function ScorePanel({ score, bestScore }: ScorePanelProps) {
  return (
    <section className="grid grid-cols-2 gap-3">
      <div className="rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] p-4">
        <p className="text-sm text-[var(--color-text-muted)]">Score</p>
        <p className="text-3xl font-semibold">{score}</p>
      </div>
      <div className="rounded-lg border border-[var(--color-surface-muted)] bg-[var(--color-surface)] p-4">
        <p className="text-sm text-[var(--color-text-muted)]">Best</p>
        <p className="text-3xl font-semibold">{bestScore}</p>
      </div>
    </section>
  );
}
```

Create `src/components/TouchControls.tsx`:

```tsx
import type { Direction } from '../lib/game/types';

type TouchControlsProps = {
  onDirection: (direction: Direction) => void;
};

export function TouchControls({ onDirection }: TouchControlsProps) {
  return (
    <div
      className="mx-auto grid w-44 grid-cols-3 gap-2 sm:hidden"
      aria-label="Touch direction controls"
    >
      <span />
      <TouchButton label="Up" onClick={() => onDirection('up')} />
      <span />
      <TouchButton label="Left" onClick={() => onDirection('left')} />
      <TouchButton label="Down" onClick={() => onDirection('down')} />
      <TouchButton label="Right" onClick={() => onDirection('right')} />
    </div>
  );
}

function TouchButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex aspect-square items-center justify-center rounded-md border border-[var(--color-surface-muted)] bg-[var(--color-surface)] text-sm font-medium active:bg-[var(--color-surface-muted)]"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
```

Create `src/components/StatusOverlay.tsx`:

```tsx
import type { GamePhase } from '../lib/game/types';

type StatusOverlayProps = {
  phase: GamePhase;
};

export function StatusOverlay({ phase }: StatusOverlayProps) {
  if (phase === 'running') {
    return null;
  }

  const label = {
    ready: 'Ready',
    paused: 'Paused',
    gameOver: 'Game Over',
  }[phase];

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg bg-black/10 p-4">
      <div className="rounded-lg bg-[var(--color-surface)] px-5 py-3 text-lg font-semibold shadow">
        {label}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build component code**

Run:

```powershell
pnpm build
```

Expected: build succeeds.

- [ ] **Step 5: Commit components**

```powershell
git add src/components
git commit -m "feat: 添加贪吃蛇界面组件"
```

---

### Task 7: Integrate SPA Layout And Theme

**Files:**

- Modify: `src/App.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Replace App with full game shell**

Replace `src/App.tsx` with:

```tsx
import { useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { GameBoard } from './components/GameBoard';
import { ScorePanel } from './components/ScorePanel';
import { StatusOverlay } from './components/StatusOverlay';
import { TouchControls } from './components/TouchControls';
import { useSnakeGame } from './hooks/useSnakeGame';
import { useGameStore } from './store/gameStore';

export default function App() {
  const controller = useSnakeGame();
  const difficulty = useGameStore((store) => store.difficulty);
  const setDifficulty = useGameStore((store) => store.setDifficulty);
  const mode = useGameStore((store) => store.mode);
  const setMode = useGameStore((store) => store.setMode);
  const score = useGameStore((store) => store.score);
  const bestScore = useGameStore((store) => store.bestScore);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
  }, [mode]);

  return (
    <main className="min-h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
      <div className="mx-auto grid min-h-dvh max-w-6xl content-center gap-5 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="grid gap-4">
          <header className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Snake</h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Modern minimal web and H5 snake game
              </p>
            </div>
            <span className="rounded-full border border-[var(--color-surface-muted)] px-3 py-1 text-sm text-[var(--color-text-muted)]">
              {controller.state.phase}
            </span>
          </header>

          <div className="relative mx-auto w-full max-w-[min(86dvh,680px)]">
            <GameBoard
              state={controller.state}
              mode={mode}
              onDirection={controller.requestDirection}
            />
            <StatusOverlay phase={controller.state.phase} />
          </div>

          <TouchControls onDirection={controller.requestDirection} />
        </section>

        <aside className="grid content-start gap-4">
          <ScorePanel score={score} bestScore={bestScore} />
          <ControlPanel
            difficulty={difficulty}
            mode={mode}
            phase={controller.state.phase}
            obstaclesEnabled={controller.obstaclesEnabled}
            onDifficultyChange={setDifficulty}
            onModeChange={setMode}
            onObstaclesChange={controller.setObstaclesEnabled}
            onStart={controller.start}
            onPause={controller.pause}
            onResume={controller.resume}
            onRestart={controller.restart}
          />
        </aside>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Add button disabled styling**

Append to `src/index.css`:

```css
button:disabled,
select:disabled,
input:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}
```

- [ ] **Step 3: Run tests and build**

Run:

```powershell
pnpm test
pnpm build
```

Expected: tests pass and build succeeds.

- [ ] **Step 4: Commit integration**

```powershell
git add src/App.tsx src/index.css
git commit -m "feat: 集成贪吃蛇单页游戏"
```

---

### Task 8: Final Responsive Polish And Verification

**Files:**

- Modify: `src/components/TouchControls.tsx`
- Modify: `src/components/ControlPanel.tsx`
- Modify: `src/App.tsx`
- Modify: `docs/superpowers/plans/2026-06-10-snake-game.md`

- [ ] **Step 1: Run full verification**

Run:

```powershell
pnpm test
pnpm build
git diff --check
git status --short
```

Expected:

- `pnpm test` passes.
- `pnpm build` passes.
- `git diff --check` reports no whitespace errors.
- `git status --short` shows only intended files before the final commit.

- [ ] **Step 2: Manual smoke test in browser**

Run:

```powershell
pnpm dev
```

Open the printed local URL and verify:

- Start begins a run.
- Arrow keys and WASD change direction.
- Mobile width shows touch controls.
- Touch direction buttons change direction.
- Pause and resume work.
- Restart begins a fresh run.
- Difficulty is disabled while running or paused.
- Obstacles appear when obstacle mode is enabled before start.
- Score increases after food is eaten.
- Best score survives reload.
- Dark mode changes page and Canvas colors.
- The board stays square while resizing.

- [ ] **Step 3: Fix any smoke-test issues in the smallest relevant file**

Apply fixes only to the file that owns the failing behavior:

- Engine rule failure: `src/lib/game/engine.ts`
- Canvas drawing failure: `src/lib/game/renderer.ts`
- Store or persistence failure: `src/store/gameStore.ts`
- Layout or control failure: component file or `src/App.tsx`

After each fix, rerun:

```powershell
pnpm test
pnpm build
```

Expected: both commands pass.

- [ ] **Step 4: Commit final verified app**

```powershell
git add src docs/superpowers/plans/2026-06-10-snake-game.md
git commit -m "feat: 完成贪吃蛇游戏验证"
```

---

## Plan Self-Review

- Spec coverage: SPA, Modern Minimal style, desktop keyboard, H5 touch, difficulty, speed progression, obstacle mode, score persistence, Tailwind CSS v4, light/dark mode, multi-theme structure, store-managed difficulty/theme/score, tests, and build verification are all covered.
- Red-flag scan: no unresolved implementation gaps remain in this plan. The only temporary throwing code is an explicit failing-test step before engine implementation.
- Type consistency: `Difficulty`, `ThemeMode`, `GameState`, `Direction`, and store method names are consistent across tasks. `tick` reads difficulty from `GameState.difficulty`.
