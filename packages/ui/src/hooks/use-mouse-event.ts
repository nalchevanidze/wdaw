import { Point, usePoint } from '@wdaw/svg';
import * as React from 'react';

type Handlers = {
  move: (p: Point) => void;
  up: () => void;
};

export const useMouseEvent = (handlers: Handlers, args: unknown[] = []) => {
  const toPoint = usePoint();
  const onMove = (event: MouseEvent) => handlers.move(toPoint(event));

  const onUp = (_: MouseEvent) => handlers.up();

  React.useEffect(() => {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, args);
};
