import { fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { useGameStore } from './store/gameStore';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.getState().resetAll();
    document.documentElement.removeAttribute('data-mode');
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders the game heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Snake Game' })).toBeInTheDocument();
  });

  it('updates lifecycle controls and locks settings during a run', () => {
    render(<App />);

    const hardDifficulty = within(screen.getByRole('group', { name: 'Difficulty' })).getByRole(
      'button',
      { name: 'Hard' },
    );
    const slowSpeed = within(screen.getByRole('group', { name: 'Speed' })).getByRole('button', {
      name: 'Slow',
    });
    const obstacles = screen.getByLabelText('Obstacles');
    const startButtons = screen.getAllByRole('button', { name: 'Start' });

    expect(screen.getByText('Ready / normal')).toBeInTheDocument();
    expect(hardDifficulty).toBeEnabled();
    expect(slowSpeed).toHaveAttribute('aria-pressed', 'true');
    expect(obstacles).toBeEnabled();

    fireEvent.click(startButtons[0]);

    expect(screen.getByText('Playing / normal')).toBeInTheDocument();
    expect(hardDifficulty).toBeDisabled();
    expect(slowSpeed).toBeDisabled();
    expect(obstacles).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Pause' })[0]).toBeEnabled();

    fireEvent.click(screen.getAllByRole('button', { name: 'Pause' })[0]);

    expect(screen.getByText('Paused / normal')).toBeInTheDocument();
    expect(hardDifficulty).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Resume' })[0]).toBeEnabled();

    fireEvent.click(screen.getAllByRole('button', { name: 'Resume' })[0]);

    expect(screen.getByText('Playing / normal')).toBeInTheDocument();
  });

  it('updates pre-run difficulty, obstacle mode, and theme controls', () => {
    render(<App />);

    fireEvent.click(
      within(screen.getByRole('group', { name: 'Difficulty' })).getByRole('button', {
        name: 'Hard',
      }),
    );
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Theme' })).getByRole('button', {
        name: 'Arcade',
      }),
    );
    fireEvent.click(
      within(screen.getByRole('group', { name: 'Speed' })).getByRole('button', {
        name: 'Normal',
      }),
    );
    fireEvent.click(screen.getByLabelText('Obstacles'));
    fireEvent.click(screen.getByRole('button', { name: 'Light' }));

    expect(screen.getByText('Ready / hard')).toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Difficulty' })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Theme' })).not.toBeInTheDocument();
    expect(
      within(screen.getByRole('group', { name: 'Theme' })).getByRole('button', { name: 'Arcade' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(screen.getByRole('group', { name: 'Speed' })).getByRole('button', { name: 'Normal' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByLabelText('Obstacles')).toBeChecked();
    expect(document.documentElement.dataset.mode).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('arcade');
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('shows keyboard shortcut guidance and supports space and restart shortcuts', () => {
    render(<App />);

    expect(screen.getByText('Move')).toBeInTheDocument();
    expect(screen.getByText('Arrow keys / WASD')).toBeInTheDocument();
    expect(screen.getByText('Start / pause / resume')).toBeInTheDocument();
    expect(screen.getByText('Space')).toBeInTheDocument();
    expect(screen.getAllByText('Restart').length).toBeGreaterThan(0);
    expect(screen.getByText('R')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: ' ' });
    expect(screen.getByText('Playing / normal')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: ' ' });
    expect(screen.getByText('Paused / normal')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: ' ' });
    expect(screen.getByText('Playing / normal')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'r' });
    expect(screen.getByText('Playing / normal')).toBeInTheDocument();
  });
});
