import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';
import { useGameStore } from './store/gameStore';

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    useGameStore.getState().resetAll();
    document.documentElement.removeAttribute('data-mode');
  });

  it('renders the game heading', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: 'Snake Game' })).toBeInTheDocument();
  });

  it('updates lifecycle controls and locks settings during a run', () => {
    render(<App />);

    const difficulty = screen.getByLabelText('Difficulty');
    const obstacles = screen.getByLabelText('Obstacles');
    const startButtons = screen.getAllByRole('button', { name: 'Start' });

    expect(screen.getByText('Ready / normal')).toBeInTheDocument();
    expect(difficulty).toBeEnabled();
    expect(obstacles).toBeEnabled();

    fireEvent.click(startButtons[0]);

    expect(screen.getByText('Playing / normal')).toBeInTheDocument();
    expect(difficulty).toBeDisabled();
    expect(obstacles).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Pause' })[0]).toBeEnabled();

    fireEvent.click(screen.getAllByRole('button', { name: 'Pause' })[0]);

    expect(screen.getByText('Paused / normal')).toBeInTheDocument();
    expect(difficulty).toBeDisabled();
    expect(screen.getAllByRole('button', { name: 'Resume' })[0]).toBeEnabled();

    fireEvent.click(screen.getAllByRole('button', { name: 'Resume' })[0]);

    expect(screen.getByText('Playing / normal')).toBeInTheDocument();
  });

  it('updates pre-run difficulty, obstacle mode, and theme controls', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText('Difficulty'), { target: { value: 'hard' } });
    fireEvent.click(screen.getByLabelText('Obstacles'));
    fireEvent.click(screen.getByRole('button', { name: 'Light' }));

    expect(screen.getByText('Ready / hard')).toBeInTheDocument();
    expect(screen.getByLabelText('Obstacles')).toBeChecked();
    expect(document.documentElement.dataset.mode).toBe('dark');
    expect(screen.getByRole('button', { name: 'Dark' })).toHaveAttribute('aria-pressed', 'true');
  });
});
