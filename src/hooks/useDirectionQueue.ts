import { useCallback, useRef, type RefObject } from 'react';
import { getNextDirection } from '../lib/game/engine';
import type { Direction, GameState } from '../lib/game/types';

interface UseDirectionQueueOptions {
  stateRef: RefObject<GameState>;
  commitState: (state: GameState) => void;
}

export function useDirectionQueue({ stateRef, commitState }: UseDirectionQueueOptions) {
  const requestedDirectionRef = useRef<Direction>('right');

  const resetDirection = useCallback(() => {
    requestedDirectionRef.current = 'right';
  }, []);

  const requestDirection = useCallback(
    (direction: Direction) => {
      const current = stateRef.current;
      const nextDirection = getNextDirection(current.direction, direction);
      if (direction !== current.direction && nextDirection === current.direction) {
        return;
      }

      requestedDirectionRef.current = nextDirection;
      commitState({ ...current, nextDirection });
    },
    [commitState, stateRef],
  );

  return { requestedDirectionRef, requestDirection, resetDirection };
}
