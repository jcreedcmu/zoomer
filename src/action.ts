import { Point } from "./lib/types";

export type Action =
  | { t: 'increment' }
  | { t: 'side-effect' }
  | { t: 'mouseDown', p_in_canvas: Point }
  ;

export type Dispatch = (action: Action) => void;
