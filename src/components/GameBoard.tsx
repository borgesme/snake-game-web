import { useEffect, useRef, type PointerEvent } from 'react';
import { renderBoard, type BoardColors } from '../lib/game/renderer';
import type { Direction, GameState } from '../lib/game/types';

interface GameBoardProps {
  state: GameState;
  mode: 'light' | 'dark';
  onDirection: (direction: Direction) => void;
}

interface SwipePoint {
  x: number;
  y: number;
}

const SWIPE_THRESHOLD_PX = 24;

const keyDirections: Partial<Record<string, Direction>> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
};

export function GameBoard({ state, mode, onDirection }: GameBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const swipeStartRef = useRef<SwipePoint | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return;
    }

    const draw = () => {
      const pixelRatio = globalThis.devicePixelRatio || 1;
      const width = Math.max(1, Math.round(canvas.getBoundingClientRect().width * pixelRatio));

      if (canvas.width !== width || canvas.height !== width) {
        canvas.width = width;
        canvas.height = width;
      }

      renderBoard(canvas, state, readBoardColors(canvas));
    };

    draw();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const resizeObserver = new ResizeObserver(draw);
    resizeObserver.observe(canvas);

    return () => resizeObserver.disconnect();
  }, [mode, state]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFormTarget(event.target)) {
        return;
      }

      const direction = keyDirections[event.key];
      if (direction === undefined) {
        return;
      }

      event.preventDefault();
      onDirection(direction);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDirection]);

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    swipeStartRef.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLCanvasElement>) => {
    const start = swipeStartRef.current;
    swipeStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (start === null) {
      return;
    }

    const direction = getSwipeDirection(start, { x: event.clientX, y: event.clientY });
    if (direction !== null) {
      onDirection(direction);
    }
  };

  const handlePointerCancel = () => {
    swipeStartRef.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      aria-label="Snake game board"
      data-mode={mode}
      className="aspect-square w-full touch-none rounded-md border border-[var(--color-grid)] bg-[var(--color-surface)]"
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  );
}

function getSwipeDirection(start: SwipePoint, end: SwipePoint): Direction | null {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const absoluteX = Math.abs(deltaX);
  const absoluteY = Math.abs(deltaY);

  if (Math.max(absoluteX, absoluteY) < SWIPE_THRESHOLD_PX) {
    return null;
  }

  if (absoluteX > absoluteY) {
    return deltaX > 0 ? 'right' : 'left';
  }

  return deltaY > 0 ? 'down' : 'up';
}

function readBoardColors(element: HTMLElement): BoardColors {
  const styles = getComputedStyle(element);

  return {
    background: cssVariable(styles, '--color-surface', '#ffffff'),
    grid: cssVariable(styles, '--color-grid', '#dbe4ee'),
    snake: cssVariable(styles, '--color-primary', '#0f766e'),
    snakeHead: cssVariable(styles, '--color-primary-strong', '#115e59'),
    food: cssVariable(styles, '--color-food', '#dc2626'),
    obstacle: cssVariable(styles, '--color-obstacle', '#64748b'),
  };
}

function cssVariable(styles: CSSStyleDeclaration, name: string, fallback: string) {
  return styles.getPropertyValue(name).trim() || fallback;
}

function isFormTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)
  );
}
