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

const OPPOSITE_DIRECTION: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

export function createInitialState(settings: GameSettings): GameState {
  const config = DIFFICULTY_CONFIG[settings.difficulty];
  const snake = clonePoints(START_SNAKE);
  const obstacles = settings.obstaclesEnabled
    ? createObstacles(config.obstacleCount, snake)
    : [];
  const food = findFreeCell([...snake, ...obstacles]);

  return {
    phase: 'ready',
    boardSize: BOARD_SIZE,
    snake,
    direction: 'right',
    nextDirection: 'right',
    food,
    obstacles,
    foodsEaten: 0,
    tickMs: config.initialTickMs,
  };
}

export function getNextDirection(current: Direction, requested: Direction): Direction {
  return OPPOSITE_DIRECTION[current] === requested ? current : requested;
}

export function hasPoint(points: Point[], point: Point): boolean {
  return points.some((candidate) => pointsEqual(candidate, point));
}

export function tick(
  state: GameState,
  requestedDirection: Direction,
  difficulty: Difficulty,
): TickResult {
  if (state.phase !== 'running') {
    return { state, ateFood: false, scoreDelta: 0 };
  }

  const direction = getNextDirection(state.direction, requestedDirection);
  const delta = DIRECTION_DELTA[direction];
  const nextHead = {
    x: state.snake[0].x + delta.x,
    y: state.snake[0].y + delta.y,
  };
  const ateFood = pointsEqual(nextHead, state.food);
  const collisionSnake = ateFood ? state.snake : state.snake.slice(0, -1);

  if (
    isOutsideBoard(nextHead, state.boardSize) ||
    hasPoint(collisionSnake, nextHead) ||
    hasPoint(state.obstacles, nextHead)
  ) {
    return {
      state: {
        ...state,
        direction,
        nextDirection: direction,
        phase: 'gameOver',
      },
      ateFood: false,
      scoreDelta: 0,
    };
  }

  const snake = [nextHead, ...state.snake];
  if (!ateFood) {
    snake.pop();
  }

  const foodsEaten = ateFood ? state.foodsEaten + 1 : state.foodsEaten;
  const tickMs = getUpdatedTickMs(state.tickMs, foodsEaten, ateFood, difficulty);
  const food = ateFood
    ? findFreeCell([...snake, ...state.obstacles], state.food)
    : state.food;

  return {
    state: {
      ...state,
      snake,
      direction,
      nextDirection: direction,
      food,
      foodsEaten,
      tickMs,
    },
    ateFood,
    scoreDelta: ateFood
      ? Math.round(FOOD_SCORE * DIFFICULTY_CONFIG[difficulty].scoreMultiplier)
      : 0,
  };
}

function clonePoints(points: Point[]): Point[] {
  return points.map((point) => ({ ...point }));
}

function pointsEqual(left: Point, right: Point): boolean {
  return left.x === right.x && left.y === right.y;
}

function createObstacles(count: number, snake: Point[]): Point[] {
  const obstacles: Point[] = [];

  for (let index = 0; index < count; index += 1) {
    obstacles.push(findFreeCell([...snake, ...obstacles]));
  }

  return obstacles;
}

function findFreeCell(blocked: Point[], previousFood?: Point): Point {
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const candidate = { x, y };
      if (!hasPoint(blocked, candidate) && !isPreviousFood(candidate, previousFood)) {
        return candidate;
      }
    }
  }

  throw new Error('No free cell available');
}

function isPreviousFood(candidate: Point, previousFood?: Point): boolean {
  return previousFood !== undefined && pointsEqual(candidate, previousFood);
}

function isOutsideBoard(point: Point, boardSize: number): boolean {
  return point.x < 0 || point.y < 0 || point.x >= boardSize || point.y >= boardSize;
}

function getUpdatedTickMs(
  currentTickMs: number,
  foodsEaten: number,
  ateFood: boolean,
  difficulty: Difficulty,
): number {
  if (!ateFood || foodsEaten % SPEEDUP_EVERY_FOODS !== 0) {
    return currentTickMs;
  }

  const minTickMs = DIFFICULTY_CONFIG[difficulty].minTickMs;
  return Math.max(minTickMs, currentTickMs - SPEEDUP_STEP_MS);
}
