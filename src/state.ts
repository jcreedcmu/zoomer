import { Effect } from "./effect";

export type AppState = {
  counter: number,
  effects: Effect[],
  debugStr: string,
}

export function mkState(): AppState {
  return { counter: 0, effects: [], debugStr: '' };
}
