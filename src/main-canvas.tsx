import *  as React from 'react';
import { CanvasInfo, useCanvas } from './lib/use-canvas';
import { Dispatch } from './action';
import { fillRect, relpos, rrelpos } from './lib/dutil';
import { GameState } from './state';
import { SE2, compose, inverse, mkSE2 } from './lib/se2';
import { Rect } from './lib/types';
import { insetRect } from './lib/util';
import { vdiag } from './lib/vutil';
import { apply_to_rect } from './lib/se2-extra';

export type MainCanvasProps = {
  dispatch: Dispatch,
  gameState: GameState,
}

export type MainCanvasState = {
  gameState: GameState,
}

function render(ci: CanvasInfo, state: MainCanvasState): void {
  const { d, size } = ci;
  d.clearRect(0, 0, size.x, size.y);

  const unit_canvas_from_canvas = mkSE2({ x: 1 / size.x, y: 1 / size.y }, { x: 0, y: 0 });
  const { gameState: { game_from_unit_canvas } } = state;
  const canvas_from_game = inverse(compose(game_from_unit_canvas, unit_canvas_from_canvas));

  const min = Math.min(size.x, size.y);

  d.fillStyle = '#eee';
  d.fillRect(0, 0, size.x, size.y);

  const rect: Rect = apply_to_rect(canvas_from_game, insetRect({ p: vdiag(0), sz: vdiag(1) }, 0.4));
  fillRect(d, rect, '#e53');
}

function onLoad(ci: CanvasInfo): void {

}

export function MainCanvas(props: MainCanvasProps): JSX.Element {
  const { dispatch } = props;
  const [cref, mc] = useCanvas(props, render, [props], onLoad);
  function onMouseDown(e: React.MouseEvent): void {
    dispatch({ t: 'mouseDown', p_in_canvas: rrelpos(e) });
  }
  return <canvas className="center" onMouseDown={onMouseDown} ref={cref} />;
}
