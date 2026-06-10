import { describe, expect, it } from 'vitest';
import { BOARD_SIZE, START_SNAKE } from './config';
import { createInitialState, getNextDirection, hasPoint, tick } from './engine';
import type { GameState } from './types';

function runningState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'running',
    boardSize: BOARD_SIZE,
    snake: START_SNAKE.map((point) => ({ ...point })),
    direction: 'right',
    nextDirection: 'right',
    food: { x: 12, y: 10 },
    obstacles: [],
    foodsEaten: 0,
    tickMs: 120,
    ...overrides,
  };
}

describe('createInitialState', () => {
  it('creates normal ready state without obstacles and food off the snake', () => {
    const state = createInitialState({ difficulty: 'normal', obstaclesEnabled: false });

    expect(state.phase).toBe('ready');
    expect(state.boardSize).toBe(20);
    expect(state.snake).toHaveLength(3);
    expect(state.direction).toBe('right');
    expect(state.nextDirection).toBe('right');
    expect(state.tickMs).toBe(120);
    expect(state.obstacles).toEqual([]);
    expect(hasPoint(state.snake, state.food)).toBe(false);
  });

  it('generates difficulty-based obstacles only when enabled', () => {
    const state = createInitialState({ difficulty: 'hard', obstaclesEnabled: true });

    expect(state.obstacles).toHaveLength(10);
    expect(state.obstacles.some((point) => hasPoint(state.snake, point))).toBe(false);
    expect(hasPoint(state.obstacles, state.food)).toBe(false);
  });
});

describe('getNextDirection', () => {
  it('prevents direct right to left reversal but allows right to up', () => {
    expect(getNextDirection('right', 'left')).toBe('right');
    expect(getNextDirection('right', 'up')).toBe('up');
  });
});

describe('tick', () => {
  it('moves without growth when no food is eaten', () => {
    const result = tick(runningState(), 'right', 'normal');

    expect(result.ateFood).toBe(false);
    expect(result.scoreDelta).toBe(0);
    expect(result.state.snake).toHaveLength(3);
    expect(result.state.snake[0]).toEqual({ x: 9, y: 10 });
    expect(result.state.snake.at(-1)).toEqual({ x: 7, y: 10 });
    expect(result.state.phase).toBe('running');
  });

  it('grows and scores 20 on hard when food is directly ahead', () => {
    const result = tick(runningState({ food: { x: 9, y: 10 }, tickMs: 90 }), 'right', 'hard');

    expect(result.ateFood).toBe(true);
    expect(result.scoreDelta).toBe(20);
    expect(result.state.snake).toHaveLength(4);
    expect(result.state.snake[0]).toEqual({ x: 9, y: 10 });
    expect(result.state.food).not.toEqual({ x: 9, y: 10 });
    expect(hasPoint(result.state.snake, result.state.food)).toBe(false);
    expect(result.state.foodsEaten).toBe(1);
  });

  it('sets gameOver on wall collision', () => {
    const result = tick(runningState({ snake: [{ x: 19, y: 10 }], food: { x: 0, y: 0 } }), 'right', 'normal');

    expect(result.state.phase).toBe('gameOver');
    expect(result.ateFood).toBe(false);
    expect(result.scoreDelta).toBe(0);
  });

  it('sets gameOver on self collision', () => {
    const state = runningState({
      snake: [
        { x: 8, y: 10 },
        { x: 8, y: 9 },
        { x: 9, y: 9 },
        { x: 9, y: 10 },
        { x: 10, y: 10 },
      ],
      direction: 'up',
      nextDirection: 'up',
      food: { x: 0, y: 0 },
    });

    const result = tick(state, 'right', 'normal');

    expect(result.state.phase).toBe('gameOver');
    expect(result.ateFood).toBe(false);
    expect(result.scoreDelta).toBe(0);
  });

  it('sets gameOver on obstacle collision', () => {
    const result = tick(
      runningState({ food: { x: 0, y: 0 }, obstacles: [{ x: 9, y: 10 }] }),
      'right',
      'normal',
    );

    expect(result.state.phase).toBe('gameOver');
    expect(result.ateFood).toBe(false);
    expect(result.scoreDelta).toBe(0);
  });

  it('speeds up every five foods eaten and clamps to minimum speed', () => {
    const fifthFood = tick(
      runningState({ food: { x: 9, y: 10 }, foodsEaten: 4, tickMs: 64 }),
      'right',
      'normal',
    );

    expect(fifthFood.state.foodsEaten).toBe(5);
    expect(fifthFood.state.tickMs).toBe(60);

    const sixthFood = tick(
      runningState({ food: { x: 9, y: 10 }, foodsEaten: 5, tickMs: 60 }),
      'right',
      'normal',
    );

    expect(sixthFood.state.foodsEaten).toBe(6);
    expect(sixthFood.state.tickMs).toBe(60);
  });

  it('returns unchanged state with no score when phase is not running', () => {
    const state = runningState({ phase: 'paused' });

    const result = tick(state, 'right', 'normal');

    expect(result.state).toBe(state);
    expect(result.ateFood).toBe(false);
    expect(result.scoreDelta).toBe(0);
  });
});
