import { beforeEach, describe, expect, it, vi } from 'vitest';

const BEST_SCORE_KEY = 'snake.bestScore';

const loadStore = async () => {
  vi.resetModules();
  return await import('./gameStore');
};

describe('gameStore', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('updates difficulty', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().setDifficulty('hard');

    expect(useGameStore.getState().difficulty).toBe('hard');
  });

  it('updates theme mode and theme id', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().setMode('dark');
    useGameStore.getState().setThemeId('minimal');

    expect(useGameStore.getState().mode).toBe('dark');
    expect(useGameStore.getState().themeId).toBe('minimal');
  });

  it('hydrates best score from localStorage when the store loads', async () => {
    window.localStorage.setItem(BEST_SCORE_KEY, '42');

    const { useGameStore } = await loadStore();

    expect(useGameStore.getState().bestScore).toBe(42);
  });

  it('increments score and persists best score', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().addScore(12);
    useGameStore.getState().addScore(8);

    expect(useGameStore.getState().score).toBe(20);
    expect(useGameStore.getState().bestScore).toBe(20);
    expect(window.localStorage.getItem(BEST_SCORE_KEY)).toBe('20');
  });

  it('does not lower best score after resetScore and smaller score', async () => {
    const { useGameStore } = await loadStore();

    useGameStore.getState().addScore(20);
    useGameStore.getState().resetScore();
    useGameStore.getState().addScore(5);

    expect(useGameStore.getState().score).toBe(5);
    expect(useGameStore.getState().bestScore).toBe(20);
    expect(window.localStorage.getItem(BEST_SCORE_KEY)).toBe('20');
  });

  it('resets settings and score while preserving best score', async () => {
    window.localStorage.setItem(BEST_SCORE_KEY, '42');
    const { useGameStore } = await loadStore();

    useGameStore.getState().setDifficulty('hard');
    useGameStore.getState().setMode('dark');
    useGameStore.getState().setThemeId('minimal');
    useGameStore.getState().addScore(50);
    useGameStore.getState().resetAll();

    expect(useGameStore.getState().difficulty).toBe('normal');
    expect(useGameStore.getState().mode).toBe('light');
    expect(useGameStore.getState().themeId).toBe('minimal');
    expect(useGameStore.getState().score).toBe(0);
    expect(useGameStore.getState().bestScore).toBe(50);
    expect(window.localStorage.getItem(BEST_SCORE_KEY)).toBe('50');
  });

  it('does not throw when localStorage is unavailable and keeps in-memory score state', async () => {
    const localStorageSpy = vi
      .spyOn(window, 'localStorage', 'get')
      .mockImplementation(() => {
        throw new Error('localStorage unavailable');
      });

    const { useGameStore } = await loadStore();

    expect(useGameStore.getState().bestScore).toBe(0);
    expect(() => useGameStore.getState().addScore(10)).not.toThrow();
    expect(useGameStore.getState().score).toBe(10);
    expect(useGameStore.getState().bestScore).toBe(10);

    localStorageSpy.mockRestore();
  });
});
