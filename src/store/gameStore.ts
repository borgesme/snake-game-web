import { create } from 'zustand';
import type { Difficulty, Speed } from '../lib/game/types';

const BEST_SCORE_KEY = 'snake.bestScore';

export type ThemeMode = 'light' | 'dark';
export type ThemeId = 'minimal' | 'arcade' | 'contrast';

export const THEME_OPTIONS: Array<{ id: ThemeId; label: string }> = [
  { id: 'minimal', label: 'Minimal' },
  { id: 'arcade', label: 'Arcade' },
  { id: 'contrast', label: 'Contrast' },
];

export const SPEED_OPTIONS: Array<{ id: Speed; label: string }> = [
  { id: 'slow', label: 'Slow' },
  { id: 'normal', label: 'Normal' },
  { id: 'fast', label: 'Fast' },
];

const DEFAULT_THEME_ID: ThemeId = 'minimal';

interface GameStoreState {
  difficulty: Difficulty;
  speed: Speed;
  mode: ThemeMode;
  themeId: ThemeId;
  score: number;
  bestScore: number;
}

interface GameStoreActions {
  setDifficulty: (difficulty: Difficulty) => void;
  setSpeed: (speed: Speed) => void;
  setMode: (mode: ThemeMode) => void;
  setThemeId: (themeId: ThemeId) => void;
  addScore: (delta: number) => void;
  resetScore: () => void;
  resetAll: () => void;
}

export type GameStore = GameStoreState & GameStoreActions;

const readBestScore = () => {
  try {
    const rawBestScore = globalThis.localStorage?.getItem(BEST_SCORE_KEY);
    const bestScore = Number(rawBestScore);

    return Number.isFinite(bestScore) && bestScore > 0 ? bestScore : 0;
  } catch {
    return 0;
  }
};

const writeBestScore = (bestScore: number) => {
  try {
    globalThis.localStorage?.setItem(BEST_SCORE_KEY, String(bestScore));
  } catch {
    return;
  }
};

const baseState: Omit<GameStoreState, 'bestScore'> = {
  difficulty: 'normal' as const,
  speed: 'slow' as const,
  mode: 'light' as const,
  themeId: DEFAULT_THEME_ID,
  score: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  ...baseState,
  bestScore: readBestScore(),
  setDifficulty: (difficulty) => set({ difficulty }),
  setSpeed: (speed) => set({ speed }),
  setMode: (mode) => set({ mode }),
  setThemeId: (themeId) => set({ themeId }),
  addScore: (delta) =>
    set((state) => {
      const score = state.score + delta;

      if (score <= state.bestScore) {
        return { score };
      }

      writeBestScore(score);
      return { score, bestScore: score };
    }),
  resetScore: () => set({ score: 0 }),
  resetAll: () =>
    set((state) => ({
      ...baseState,
      bestScore: state.bestScore,
    })),
}));
