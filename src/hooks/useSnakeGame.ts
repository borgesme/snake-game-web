import { useCallback, useEffect, useRef, useState } from 'react';
import { createInitialState, getNextDirection, tick } from '../lib/game/engine';
import type { Direction, GameState } from '../lib/game/types';
import { useGameStore } from '../store/gameStore';

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
  const [loopKey, setLoopKey] = useState(0);
  const [state, setState] = useState<GameState>(() =>
    createInitialState({ difficulty, obstaclesEnabled: false }),
  );
  const stateRef = useRef(state);
  const requestedDirectionRef = useRef<Direction>('right');
  const timeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  const clearLoop = useCallback(() => {
    if (timeoutRef.current === null) {
      return;
    }

    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const commitState = useCallback((nextState: GameState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const createRunningState = useCallback(() => {
    requestedDirectionRef.current = 'right';

    return {
      ...createInitialState({ difficulty, obstaclesEnabled }),
      phase: 'running' as const,
    };
  }, [difficulty, obstaclesEnabled]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (stateRef.current.phase !== 'ready') {
      return;
    }

    requestedDirectionRef.current = 'right';
    commitState(createInitialState({ difficulty, obstaclesEnabled }));
  }, [commitState, difficulty, obstaclesEnabled]);

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
  }, [addScore, clearLoop, commitState, loopKey, state.phase]);

  useEffect(() => clearLoop, [clearLoop]);

  const setObstaclesEnabled = useCallback((enabled: boolean) => {
    setObstaclesEnabledState(enabled);
  }, []);

  const requestDirection = useCallback((direction: Direction) => {
    const current = stateRef.current;
    const nextDirection = getNextDirection(current.direction, direction);
    if (direction !== current.direction && nextDirection === current.direction) {
      return;
    }

    const nextState = { ...current, nextDirection };
    requestedDirectionRef.current = nextDirection;
    commitState(nextState);
  }, [commitState]);

  const start = useCallback(() => {
    clearLoop();
    resetScore();
    commitState(createRunningState());
    setLoopKey((current) => current + 1);
  }, [clearLoop, commitState, createRunningState, resetScore]);

  const pause = useCallback(() => {
    const current = stateRef.current;
    if (current.phase !== 'running') {
      return;
    }

    commitState({ ...current, phase: 'paused' });
  }, [commitState]);

  const resume = useCallback(() => {
    const current = stateRef.current;
    if (current.phase !== 'paused') {
      return;
    }

    clearLoop();
    commitState({ ...current, phase: 'running' });
    setLoopKey((key) => key + 1);
  }, [clearLoop, commitState]);

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
