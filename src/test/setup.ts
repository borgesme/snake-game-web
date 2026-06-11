import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class TestResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

function createCanvasContext() {
  let fillStyle = '';
  let strokeStyle = '';
  let lineWidth = 1;

  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
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
}

vi.stubGlobal('ResizeObserver', TestResizeObserver);

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: vi.fn((contextId: string) => (contextId === '2d' ? createCanvasContext() : null)),
});
