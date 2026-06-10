import { describe, expect, it, vi } from 'vitest';
import { createInitialState } from './engine';
import { renderBoard, type BoardColors } from './renderer';

const colors: BoardColors = {
  background: '#ffffff',
  grid: '#dbe4ee',
  snake: '#0f766e',
  snakeHead: '#115e59',
  food: '#dc2626',
  obstacle: '#64748b',
};

interface DrawOperation {
  method: string;
  args?: number[];
  fillStyle?: string;
}

function createMockContext() {
  const operations: DrawOperation[] = [];
  let fillStyle = '';
  let strokeStyle = '';
  let lineWidth = 0;

  const context = {
    clearRect: vi.fn((...args: number[]) => operations.push({ method: 'clearRect', args })),
    fillRect: vi.fn((...args: number[]) =>
      operations.push({ method: 'fillRect', args, fillStyle }),
    ),
    beginPath: vi.fn(() => operations.push({ method: 'beginPath' })),
    moveTo: vi.fn((...args: number[]) => operations.push({ method: 'moveTo', args })),
    lineTo: vi.fn((...args: number[]) => operations.push({ method: 'lineTo', args })),
    stroke: vi.fn(() => operations.push({ method: 'stroke' })),
    get fillStyle() {
      return fillStyle;
    },
    set fillStyle(value: string) {
      fillStyle = value;
    },
    get strokeStyle() {
      return strokeStyle;
    },
    set strokeStyle(value: string) {
      strokeStyle = value;
    },
    get lineWidth() {
      return lineWidth;
    },
    set lineWidth(value: number) {
      lineWidth = value;
    },
  } as unknown as CanvasRenderingContext2D;

  return { context, operations };
}

function mockCanvasContext(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D | null,
): void {
  Object.defineProperty(canvas, 'getContext', {
    configurable: true,
    value: vi.fn(() => context),
  });
}

describe('renderBoard', () => {
  it('draws the board background, grid, snake, food, and obstacles', () => {
    const canvas = document.createElement('canvas');
    const { context, operations } = createMockContext();
    const state = createInitialState({ difficulty: 'hard', obstaclesEnabled: true });
    canvas.width = 200;
    canvas.height = 200;
    mockCanvasContext(canvas, context);

    renderBoard(canvas, state, colors);

    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 200, 200);
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 200, 200);
    expect(context.beginPath).toHaveBeenCalledOnce();
    expect(context.moveTo).toHaveBeenCalled();
    expect(context.lineTo).toHaveBeenCalled();
    expect(context.stroke).toHaveBeenCalledOnce();
    expect(operations).toContainEqual({
      method: 'fillRect',
      args: [state.snake[0].x * 10, state.snake[0].y * 10, 10, 10],
      fillStyle: colors.snakeHead,
    });
    expect(operations).toContainEqual({
      method: 'fillRect',
      args: [state.snake[1].x * 10, state.snake[1].y * 10, 10, 10],
      fillStyle: colors.snake,
    });
    expect(operations).toContainEqual({
      method: 'fillRect',
      args: [state.food.x * 10, state.food.y * 10, 10, 10],
      fillStyle: colors.food,
    });
    expect(operations).toContainEqual({
      method: 'fillRect',
      args: [state.obstacles[0].x * 10, state.obstacles[0].y * 10, 10, 10],
      fillStyle: colors.obstacle,
    });
  });

  it('does not throw when a 2d context is unavailable', () => {
    const canvas = document.createElement('canvas');
    const state = createInitialState({ difficulty: 'normal', obstaclesEnabled: false });
    mockCanvasContext(canvas, null);

    expect(() => renderBoard(canvas, state, colors)).not.toThrow();
  });
});
