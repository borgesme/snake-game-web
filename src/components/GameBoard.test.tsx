import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../lib/game/engine';
import { GameBoard } from './GameBoard';

describe('GameBoard', () => {
  it('handles movement keys even when an action button keeps focus', () => {
    const onDirection = vi.fn();
    const state = { ...createInitialState({ difficulty: 'normal', obstaclesEnabled: false }) };

    render(
      <>
        <button type="button">Start</button>
        <GameBoard mode="light" state={state} onDirection={onDirection} />
      </>,
    );

    fireEvent.keyDown(screen.getByRole('button', { name: 'Start' }), { key: 'w' });

    expect(onDirection).toHaveBeenCalledWith('up');
  });
});
