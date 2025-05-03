import { produce } from 'immer';
import { AppState, GameState, MouseState } from './state';
import { Action } from './action';
import { Point } from './lib/types';
import { compose, composen, scale, translate } from './lib/se2';
import { vdiag, vscale, vsub } from './lib/vutil';

function reduceMouseWheel(state: GameState, ms: MouseState, p_in_unit_canvas: Point, delta: number): GameState {
  const scaleFactor = Math.pow(1.25, delta / 114);

  const new_game_from_unit_canvas = composen(
    state.game_from_unit_canvas,
    translate(p_in_unit_canvas),
    scale(vdiag(scaleFactor)),
    translate(vscale(p_in_unit_canvas, -1)),
  );

  return produce(state, s => {
    s.game_from_unit_canvas = new_game_from_unit_canvas;
  });
}

function reduceMouseUp(state: GameState, ms: MouseState, p_in_unit_canvas: Point): GameState {
  return produce(state, s => { s.mouseState = { t: 'up', p_in_unit_canvas } });
}

function reduceMouseDown(state: GameState, ms: MouseState, p_in_unit_canvas: Point): GameState {
  return produce(state, s => {
    s.mouseState = {
      t: 'pan',
      p_in_unit_canvas,
    }
  });

}

function reduceMouseMove(state: GameState, ms: MouseState, p_in_unit_canvas: Point): GameState {
  switch (ms.t) {
    case 'up': return produce(state, s => { s.mouseState = { t: 'up', p_in_unit_canvas } });
    case 'pan': {
      const new_game_from_unit_canvas = compose(state.game_from_unit_canvas, translate(vsub(ms.p_in_unit_canvas, p_in_unit_canvas)));
      return produce(state, s => {
        s.mouseState = { t: 'pan', p_in_unit_canvas };
        s.game_from_unit_canvas = new_game_from_unit_canvas;
      });
    }
  }
}

export function reduce(state: AppState, action: Action): AppState {
  switch (action.t) {
    case 'increment': {
      state;
    }
    case 'side-effect': {
      return state;
    }
    case 'mouseMove': {
      const ms = state.gameState.mouseState;
      const newGameState = reduceMouseMove(state.gameState, ms, action.p_in_unit_canvas);
      return produce(state, s => { s.gameState = newGameState; });
    }
    case 'mouseUp': {
      const ms = state.gameState.mouseState;
      const newGameState = reduceMouseUp(state.gameState, ms, action.p_in_unit_canvas);
      return produce(state, s => { s.gameState = newGameState; });
    }
    case 'mouseDown': {
      const ms = state.gameState.mouseState;
      const newGameState = reduceMouseDown(state.gameState, ms, action.p_in_unit_canvas);
      return produce(state, s => { s.gameState = newGameState; });
    }
    case 'mouseWheel': {
      const ms = state.gameState.mouseState;
      const newGameState = reduceMouseWheel(state.gameState, ms, action.p_in_unit_canvas, action.delta);
      return produce(state, s => { s.gameState = newGameState; });
    }
  }
}
