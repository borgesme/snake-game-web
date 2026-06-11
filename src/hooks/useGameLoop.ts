import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { tick } from '../lib/game/engine';
import type { Direction, GameState } from '../lib/game/types';

interface UseGameLoopOptions {
  addScore: (delta: number) => void;
  commitState: (state: GameState) => void;
  requestedDirectionRef: RefObject<Direction>;
  state: GameState;
  stateRef: RefObject<GameState>;
}

export function useGameLoop({
  addScore,
  commitState,
  requestedDirectionRef,
  state,
  stateRef,
}: UseGameLoopOptions) {
  const [loopKey, setLoopKey] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const clearLoop = useCallback(() => {
    if (timeoutRef.current === null) {
      return;
    }

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const restartLoop = useCallback(() => {
    clearLoop();
    setLoopKey((key) => key + 1);
  }, [clearLoop]);

  useEffect(() => {
    if (state.phase !== 'running') {
      clearLoop();
      return;
    }

    if (timeoutRef.current !== null) {
      return;
    }

    const step = () => {
      timeoutRef.current = null;
      const current = stateRef.current;

      if (current.phase !== 'running') {
        return;
      }

      const result = tick(current, requestedDirectionRef.current);
      if (result.scoreDelta > 0) {
        addScore(result.scoreDelta);
      }

      commitState(result.state);

      if (result.state.phase === 'running') {
        timeoutRef.current = window.setTimeout(step, result.state.tickMs);
      }
    };

    timeoutRef.current = window.setTimeout(step, stateRef.current.tickMs);
    return clearLoop;
  }, [addScore, clearLoop, commitState, loopKey, requestedDirectionRef, state.phase, stateRef]);

  useEffect(() => clearLoop, [clearLoop]);

  return { clearLoop, restartLoop };
}
