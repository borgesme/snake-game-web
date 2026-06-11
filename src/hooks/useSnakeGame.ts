import { useCallback, useEffect, useState } from 'react';
import { createInitialState } from '../lib/game/engine';
import type { Direction, GameState } from '../lib/game/types';
import { useGameStore } from '../store/gameStore';
import { useCommittedState } from './useCommittedState';
import { useDirectionQueue } from './useDirectionQueue';
import { useGameLoop } from './useGameLoop';

export interface UseSnakeGameResult {
  state: GameState;
  obstaclesEnabled: boolean;
  setObstaclesEnabled: (enabled: boolean) => void;
  requestDirection: (direction: Direction) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  restart: () => void;
}

export function useSnakeGame(): UseSnakeGameResult {
  const difficulty = useGameStore((store) => store.difficulty);
  const addScore = useGameStore((store) => store.addScore);
  const resetScore = useGameStore((store) => store.resetScore);
  const [obstaclesEnabled, setObstaclesEnabledState] = useState(false);
  const { state, stateRef, commitState } = useCommittedState<GameState>(() =>
    createInitialState({ difficulty, obstaclesEnabled: false }),
  );
  const { requestedDirectionRef, requestDirection, resetDirection } = useDirectionQueue({
    commitState,
    stateRef,
  });
  const { clearLoop, restartLoop } = useGameLoop({
    addScore,
    commitState,
    requestedDirectionRef,
    state,
    stateRef,
  });

  const createRunningState = useCallback(() => {
    resetDirection();

    return {
      ...createInitialState({ difficulty, obstaclesEnabled }),
      phase: 'running' as const,
    };
  }, [difficulty, obstaclesEnabled, resetDirection]);

  useEffect(() => {
    if (stateRef.current.phase !== 'ready') {
      return;
    }

    resetDirection();
    commitState(createInitialState({ difficulty, obstaclesEnabled }));
  }, [commitState, difficulty, obstaclesEnabled, resetDirection, stateRef]);

  const setObstaclesEnabled = useCallback((enabled: boolean) => {
    setObstaclesEnabledState(enabled);
  }, []);

  const start = useCallback(() => {
    clearLoop();
    resetScore();
    commitState(createRunningState());
    restartLoop();
  }, [clearLoop, commitState, createRunningState, resetScore, restartLoop]);

  const pause = useCallback(() => {
    const current = stateRef.current;
    if (current.phase !== 'running') {
      return;
    }

    commitState({ ...current, phase: 'paused' });
  }, [commitState, stateRef]);

  const resume = useCallback(() => {
    const current = stateRef.current;
    if (current.phase !== 'paused') {
      return;
    }

    clearLoop();
    commitState({ ...current, phase: 'running' });
    restartLoop();
  }, [clearLoop, commitState, restartLoop, stateRef]);

  const restart = useCallback(() => {
    start();
  }, [start]);

  return {
    state,
    obstaclesEnabled,
    setObstaclesEnabled,
    requestDirection,
    start,
    pause,
    resume,
    restart,
  };
}
