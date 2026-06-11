import type { Difficulty, DifficultyConfig, Point, Speed, SpeedConfig } from './types';

export const BOARD_SIZE = 20;

export const START_SNAKE: Point[] = [
  { x: 8, y: 10 },
  { x: 7, y: 10 },
  { x: 6, y: 10 },
];

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    initialTickMs: 160,
    minTickMs: 60,
    scoreMultiplier: 1,
    obstacleCount: 4,
  },
  normal: {
    initialTickMs: 120,
    minTickMs: 60,
    scoreMultiplier: 1.5,
    obstacleCount: 7,
  },
  hard: {
    initialTickMs: 90,
    minTickMs: 60,
    scoreMultiplier: 2,
    obstacleCount: 10,
  },
};

export const DEFAULT_SPEED: Speed = 'slow';

export const SPEED_CONFIG: Record<Speed, SpeedConfig> = {
  slow: {
    initialTickMs: 220,
    minTickMs: 90,
  },
  normal: {
    initialTickMs: 150,
    minTickMs: 70,
  },
  fast: {
    initialTickMs: 110,
    minTickMs: 55,
  },
};

export const FOOD_SCORE = 10;

export const SPEEDUP_EVERY_FOODS = 5;

export const SPEEDUP_STEP_MS = 8;
