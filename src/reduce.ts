import { produce } from 'immer';
import { AppState, GameState, MouseState } from './state';
import { Action } from './action';
import { Point } from './lib/types';
import { compose, composen, inverse, scale, translate } from './lib/se2';
import { vdiag, vscale, vsub } from './lib/vutil';
import { apply_to_rect } from './lib/se2-extra';
import { insetRect } from './lib/util';

function reduceMouseWheel(state: GameState, ms: MouseState, p_in_unit_canvas: Point, delta: number): GameState {

  const scaleFactor = Math.pow(1.25, delta / 114);

  // Limit zoom out
  if (scaleFactor > 1 && state.game_from_unit_canvas.scale.x > 1.5) {
    return state;
  }

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
      const newGameState = postProcess(reduceMouseMove(state.gameState, ms, action.p_in_unit_canvas));
      return produce(state, s => { s.gameState = newGameState; });
    }
    case 'mouseUp': {
      const ms = state.gameState.mouseState;
      const newGameState = postProcess(reduceMouseUp(state.gameState, ms, action.p_in_unit_canvas));
      return produce(state, s => { s.gameState = newGameState; });
    }
    case 'mouseDown': {
      const ms = state.gameState.mouseState;
      const newGameState = postProcess(reduceMouseDown(state.gameState, ms, action.p_in_unit_canvas));
      return produce(state, s => { s.gameState = newGameState; });
    }
    case 'mouseWheel': {
      const ms = state.gameState.mouseState;
      const newGameState = postProcess(reduceMouseWheel(state.gameState, ms, action.p_in_unit_canvas, action.delta));
      return produce(state, s => { s.gameState = newGameState; });
    }
  }
}

function postProcess(state: GameState): GameState {
  const xlate: Point = state.game_from_unit_canvas.translate;

  if (state.stage == 'red-square') {
    const unit_canvas_from_game = inverse(state.game_from_unit_canvas);
    const rect_in_unit_canvas = apply_to_rect(unit_canvas_from_game, insetRect({ p: vdiag(0), sz: vdiag(1) }, 0.4));
    if (rect_in_unit_canvas.p.x <= 0 && rect_in_unit_canvas.p.y <= 0 &&
      rect_in_unit_canvas.p.x + rect_in_unit_canvas.sz.x >= 1 && rect_in_unit_canvas.p.y + rect_in_unit_canvas.sz.y >= 1) {

      return produce(state, s => {
        s.stage = 'gray-square';
        s.game_from_unit_canvas = { scale: { x: 1, y: 1 }, translate: { x: 0.6, y: 0 } }
      });
    }
  }

  if (state.stage == 'gray-square') {
    const unit_canvas_from_game = inverse(state.game_from_unit_canvas);
    const rect_in_unit_canvas = apply_to_rect(unit_canvas_from_game, insetRect({ p: vdiag(0), sz: vdiag(1) }, 0.4));
    if (rect_in_unit_canvas.p.x <= 0 && rect_in_unit_canvas.p.y <= 0 &&
      rect_in_unit_canvas.p.x + rect_in_unit_canvas.sz.x >= 1 && rect_in_unit_canvas.p.y + rect_in_unit_canvas.sz.y >= 1) {

      return produce(state, s => {
        s.stage = 'red-square';
        s.game_from_unit_canvas = { scale: { x: 1, y: 1 }, translate: { x: -0.6, y: 0 } }
      });
    }
  }

  const mods: { x?: number, y?: number } = {}
  if (xlate.x > 1) {
    mods.x = -1;
  }
  if (xlate.y > 1) {
    mods.y = -1;
  }
  if (xlate.x < -1) {
    mods.x = 1;
  }
  if (xlate.y < -1) {
    mods.y = 1;
  }
  return produce(state, s => {
    if (mods.x != undefined) { s.game_from_unit_canvas.translate.x = mods.x };
    if (mods.y != undefined) { s.game_from_unit_canvas.translate.y = mods.y };
  });
}
