# Snake Game Design

## Goal

Build a modern minimal single-page Snake game that works on desktop web and H5 mobile screens. The game must use Vite, React, TypeScript, Canvas rendering, Tailwind CSS v4, and a lightweight store for difficulty, theme, and score state.

## Confirmed Scope

- Single-page application.
- Modern Minimal visual direction.
- Desktop keyboard controls with arrow keys and WASD.
- H5 touch controls with on-screen direction buttons.
- Start, pause, resume, and restart actions.
- Score and best score display.
- Best score persistence with `localStorage`.
- Difficulty selection: `easy`, `normal`, `hard`.
- Speed progression during a run.
- Optional obstacle mode.
- Tailwind CSS v4 styling.
- Light and dark mode support.
- Theme architecture prepared for future multiple themes.
- Store-managed difficulty, theme, and score state.

## Architecture

The app has three main layers:

1. `game engine`: pure TypeScript game rules with no React dependency.
2. `canvas renderer`: draws the current game snapshot to a Canvas element.
3. `React UI`: owns the single-page layout, controls, panels, and input bindings.

The data flow is one-way:

```text
input -> controller -> engine state update -> canvas redraw -> UI state display
```

The engine remains isolated so rules can be tested without browser rendering. React owns screen layout and user interactions, while Canvas owns the grid drawing.

## Game State

The game state machine is:

```text
ready -> running -> paused -> gameOver
```

Restarting starts a new board using the current difficulty, obstacle mode, and theme settings.

The engine tracks:

- Snake body coordinates.
- Current direction and queued next direction.
- Food coordinate.
- Obstacle coordinates.
- Game phase.
- Tick interval.
- Food eaten count.
- Collision result.

The engine prevents direct 180-degree direction reversal. Food generation excludes snake and obstacle cells. Collisions with walls, snake body, or obstacles end the run.

## Difficulty And Scoring

Difficulty controls initial speed, score multiplier, and obstacle count.

| Difficulty | Initial Tick | Score Multiplier | Obstacles |
| --- | ---: | ---: | ---: |
| easy | 160 ms | 1x | 4 |
| normal | 120 ms | 1.5x | 7 |
| hard | 90 ms | 2x | 10 |

Every 5 foods, the tick interval decreases by 8 ms until it reaches a floor of 60 ms. Eating food increases score by `10 * multiplier`.

## Store Boundary

Use a lightweight store, preferably `zustand`, for global UI and persisted state:

- `difficulty`: selected difficulty and setter.
- `theme`: selected theme id, light/dark mode, and setters.
- `score`: current score, best score, score increment, reset, and persistence.

The high-frequency snake board state remains outside the store in the game controller and engine. This avoids unnecessary React re-renders on every tick. The store receives only stable values that UI panels need to render.

## Theme Design

Tailwind CSS v4 provides layout utilities, responsive styling, and theme tokens. Theme values are exposed through CSS variables so both React components and Canvas rendering use the same colors.

Initial theme support:

- `light`
- `dark`

The theme model uses a `themeId` field so later themes such as `classic`, `neon`, or `contrast` can be added without rewriting component logic.

## Layout And H5 Adaptation

The first screen is the playable game, not a marketing page.

Desktop layout:

- Centered square Canvas board.
- Side or adjacent control panel depending on available width.
- Score, best score, difficulty, obstacle toggle, theme switch, and action buttons visible without scrolling.

Mobile/H5 layout:

- Vertical layout.
- Canvas remains square and fits the viewport width.
- Controls move below the board.
- Direction buttons are large enough for touch and keep fixed dimensions.
- Text and controls must not overlap at narrow widths.

The Canvas drawing uses logical grid coordinates and scales to the actual pixel size of the rendered square.

## Components

Planned top-level units:

- `App`: page shell and layout composition.
- `GameBoard`: Canvas element and resize handling.
- `ControlPanel`: start, pause, restart, difficulty, obstacle mode, theme controls.
- `ScorePanel`: current score and best score.
- `TouchControls`: H5 direction buttons.
- `StatusOverlay`: ready, paused, and game-over messaging.

## Error Handling And Edge Cases

- If localStorage is unavailable, best score falls back to in-memory state.
- Direction input before game start updates queued direction only when valid.
- Difficulty changes while running apply on the next new game, not mid-run.
- Theme changes apply immediately.
- Obstacle generation must guarantee enough free cells for snake and food.
- Resize must redraw Canvas without changing game coordinates.

## Testing Strategy

Engine unit tests cover:

- Movement by direction.
- Reversal prevention.
- Eating food and growing.
- Food generation avoiding occupied cells.
- Wall collision.
- Self collision.
- Obstacle collision.
- Speed progression.
- Difficulty scoring.

Store tests cover:

- Difficulty changes.
- Theme changes.
- Score reset and increment.
- Best score persistence.
- localStorage fallback behavior.

Verification commands:

```powershell
pnpm test
pnpm build
```

Manual smoke checks:

- Desktop keyboard controls.
- H5 touch controls.
- Pause, resume, and restart.
- Difficulty selection.
- Obstacle mode.
- Score and best score persistence.
- Light/dark theme switching.
- Responsive layout at desktop and mobile widths.

## Acceptance Criteria

- The app is a working SPA.
- The first screen is the game.
- Desktop web and H5 mobile layouts are usable.
- Canvas board remains square across viewport sizes.
- Keyboard and touch controls both work.
- Difficulty, theme, and score are managed through the store.
- Best score persists after reload.
- Tailwind CSS v4 is installed and used.
- Light and dark mode work.
- Theme structure supports future theme ids.
- Engine tests and build verification pass.
