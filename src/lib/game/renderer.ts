import type { GameState, Point } from './types';

export interface BoardColors {
  background: string;
  grid: string;
  snake: string;
  snakeHead: string;
  food: string;
  obstacle: string;
}

export function renderBoard(
  canvas: HTMLCanvasElement,
  state: GameState,
  colors: BoardColors,
): void {
  const context = canvas.getContext('2d');
  if (context === null) {
    return;
  }

  const { width, height } = canvas;
  const cellWidth = width / state.boardSize;
  const cellHeight = height / state.boardSize;

  context.clearRect(0, 0, width, height);
  context.fillStyle = colors.background;
  context.fillRect(0, 0, width, height);

  drawGrid(context, state.boardSize, cellWidth, cellHeight, width, height, colors.grid);
  drawCells(context, state.obstacles, cellWidth, cellHeight, colors.obstacle);
  drawCells(context, state.snake.slice(1), cellWidth, cellHeight, colors.snake);
  drawCells(context, state.snake.slice(0, 1), cellWidth, cellHeight, colors.snakeHead);
  drawCells(context, [state.food], cellWidth, cellHeight, colors.food);
}

function drawGrid(
  context: CanvasRenderingContext2D,
  boardSize: number,
  cellWidth: number,
  cellHeight: number,
  width: number,
  height: number,
  color: string,
): void {
  context.strokeStyle = color;
  context.lineWidth = 1;
  context.beginPath();

  for (let index = 0; index <= boardSize; index += 1) {
    const x = index * cellWidth;
    context.moveTo(x, 0);
    context.lineTo(x, height);

    const y = index * cellHeight;
    context.moveTo(0, y);
    context.lineTo(width, y);
  }

  context.stroke();
}

function drawCells(
  context: CanvasRenderingContext2D,
  cells: Point[],
  cellWidth: number,
  cellHeight: number,
  color: string,
): void {
  context.fillStyle = color;

  for (const cell of cells) {
    context.fillRect(cell.x * cellWidth, cell.y * cellHeight, cellWidth, cellHeight);
  }
}
