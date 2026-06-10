import { useEffect, useRef } from 'react';
import { renderBoard, type BoardColors } from '../lib/game/renderer';
import type { Direction, GameState } from '../lib/game/types';

interface GameBoardProps {
  state: GameState;
  mode: 'light' | 'dark';
  onDirection: (direction: Direction) => void;
}

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

  return (
    <canvas
      ref={canvasRef}
      aria-label="Snake game board"
      data-mode={mode}
      className="aspect-square w-full rounded-md border border-[var(--color-grid)] bg-[var(--color-surface)]"
    />
  );
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
