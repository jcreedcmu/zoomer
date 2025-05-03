import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { doEffect } from './effect';
import { MainCanvas } from './main-canvas';
import { extractEffects } from './lib/extract-effects';
import { useEffectfulReducer } from './lib/use-effectful-reducer';
import { reduce } from './reduce';
import { GameState, mkState } from './state';

export type AppProps = {
  color: string,
};

export function App(props: AppProps): JSX.Element {
  const [state, dispatch] = useEffectfulReducer(mkState(), extractEffects(reduce), doEffect);
  const { counter } = state;
  return <>
    <MainCanvas dispatch={dispatch} gameState={state.gameState} /><p />
  </>;
}

export function init() {
  const props: AppProps = {
    color: '#f0f',
  };
  const root = createRoot(document.querySelector('.app')!);
  root.render(<App {...props} />);
}
