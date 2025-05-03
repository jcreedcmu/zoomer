import { Effect } from "./effect";
import { SE2, mkSE2 } from "./lib/se2";
import { Point } from "./lib/types";

export type AppState = {
  counter: number,
  effects: Effect[],
  debugStr: string,
  gameState: GameState,
}

export type MouseState =
  | { t: 'pan', p_in_unit_canvas: Point }
  | { t: 'up', p_in_unit_canvas: Point }
  ;

export type GameState = {
  mouseState: MouseState,
  game_from_unit_canvas: SE2, // maps the unit square [0,1] x [0,1] to game world coordinates
}

export function mkState(): AppState {
  return {
    counter: 0, effects: [], debugStr: '',
    gameState:
    {
      mouseState: { t: 'up', p_in_unit_canvas: { x: 0, y: 0 } },
      game_from_unit_canvas: mkSE2({ x: 1, y: 1 }, { x: 0, y: 0 }),
    }
  };
}
