import { produce } from 'immer';
import { AppState } from './state';
import { Action } from './action';

export function reduce(state: AppState, action: Action): AppState {
  switch (action.t) {
    case 'increment': {
      state;
    }
    case 'side-effect': {
      return state;
    }
    case 'mouseDown': {
      const { x, y } = action.p_in_unit_canvas;
      return state;
    }
    case 'mouseMove': { console.log('mousemove', action.p_in_unit_canvas); return state; }
    case 'mouseUp': { console.log('mouseup', action.p_in_unit_canvas); return state; }
  }
}
