import { Point } from "./lib/types";

export type Action =
  | { t: 'increment' }
  | { t: 'side-effect' }
  | { t: 'mouseWheel', p_in_unit_canvas: Point, delta: number }
  | { t: 'mouseDown', p_in_unit_canvas: Point }
  | { t: 'mouseMove', p_in_unit_canvas: Point }
  | { t: 'mouseUp', p_in_unit_canvas: Point }
  ;

export type Dispatch = (action: Action) => void;
