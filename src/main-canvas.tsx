import *  as React from 'react';
import { CanvasInfo, useCanvas } from './lib/use-canvas';
import { Dispatch } from './action';
import { fillRect, relpos, rrelpos } from './lib/dutil';

export type MainCanvasProps = {
  dispatch: Dispatch,
}

export type MainCanvasState = {


}

function render(ci: CanvasInfo, state: MainCanvasState): void {
  const { d, size } = ci;
  d.clearRect(0, 0, size.x, size.y);
  const min = Math.min(size.x, size.y);

  d.fillStyle = '#fed';
  d.fillRect(0, 0, size.x, size.y);

  d.fillStyle = '#def';
  d.beginPath();
  d.arc(size.x / 2, size.y / 2, min / 2 - 10, 0, 2 * Math.PI);
  d.fill();

  d.fillStyle = '#449';
  const text = 'x';
  d.font = min * (1 / 10 + (130 / 200 / text.length)) + 'px serif';
  d.textBaseline = 'alphabetic';
  d.textAlign = 'center';

  const metrics = d.measureText(text);

  d.fillText(text, size.x / 2, size.y / 2 + (metrics.emHeightAscent) / 2);
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
