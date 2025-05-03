import *  as React from 'react';
import { CanvasInfo, useCanvas } from './lib/use-canvas';
import { Dispatch } from './action';
import { fillRect, relpos, rrelpos } from './lib/dutil';
import { GameState } from './state';
import { SE2, compose, inverse, mkSE2 } from './lib/se2';
import { Point, Rect } from './lib/types';
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

  function put_in_unit(p_in_canvas: Point): Point {
    return {
      x: p_in_canvas.x / (mc.current?.size.x || 100),
      y: p_in_canvas.y / (mc.current?.size.y || 100)
    };
  }

  function onMouseMove(ev: MouseEvent): any {
    if (mc.current) {
      dispatch({ t: 'mouseMove', p_in_unit_canvas: put_in_unit(relpos(ev, mc.current.c)) });
    }
  }

  function onMouseUp(ev: MouseEvent): any {
    if (mc.current) {
      dispatch({ t: 'mouseUp', p_in_unit_canvas: put_in_unit(relpos(ev, mc.current.c)) });
    }
  }

  React.useEffect(() => {
    console.log('reinstalling handlers');
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
  }, []);

  function onMouseDown(e: React.MouseEvent): void {
    dispatch({ t: 'mouseDown', p_in_unit_canvas: put_in_unit(rrelpos(e)) });
  }

  function onWheel(e: React.WheelEvent): void {
    dispatch({ t: 'mouseWheel', p_in_unit_canvas: put_in_unit(rrelpos(e)), delta: e.deltaY });
  }

  return <canvas className="center" onMouseDown={onMouseDown} onWheel={onWheel} ref={cref} />;
}
