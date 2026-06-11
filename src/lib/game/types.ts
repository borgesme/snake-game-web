export type Direction = 'up' | 'down' | 'left' | 'right';

export type GamePhase = 'ready' | 'running' | 'paused' | 'gameOver';

export type Difficulty = 'easy' | 'normal' | 'hard';

export interface Point {
  x: number;
  y: number;
}

export interface DifficultyConfig {
  initialTickMs: number;
  minTickMs: number;
  scoreMultiplier: number;
  obstacleCount: number;
}

export interface GameSettings {
  difficulty: Difficulty;
  obstaclesEnabled: boolean;
  random?: RandomSource;
}

export interface GameState {
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
}

export interface TickResult {
  state: GameState;
  ateFood: boolean;
  scoreDelta: number;
}

export type RandomSource = () => number;
