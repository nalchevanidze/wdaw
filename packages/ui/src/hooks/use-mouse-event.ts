import { Point, usePoint } from '@wdaw/svg';
import * as React from 'react';

type Move = { type: 'move' } & Point;
type Up = { type: 'up' };

type Event = Move | Up;

type Handler = (e: Event) => void;

export const useMouseEvent = (f: Handler, args: unknown[] = []) => {
  const toPoint = usePoint();
  const onMove = (e: MouseEvent) => f({ type: 'move', ...toPoint(e) });
  const onUp = (_: MouseEvent) => f({ type: 'up' });

  React.useEffect(() => {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, args);
};
