import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '../store/gameStore';
import { useSnakeGame } from './useSnakeGame';

describe('useSnakeGame', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.getState().resetAll();
  });

  it('keeps queued direction when a reverse input is requested before the next tick', () => {
    const { result } = renderHook(() => useSnakeGame());

    act(() => {
      result.current.requestDirection('up');
    });

    act(() => {
      result.current.requestDirection('left');
    });

    expect(result.current.state.direction).toBe('right');
    expect(result.current.state.nextDirection).toBe('up');
  });
});
