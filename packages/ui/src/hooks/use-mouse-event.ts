import * as React from 'react';

type Handler = (m: 'MOVE' | 'UP') => (e: MouseEvent) => void;

export const useMouseEvent = (f: Handler, args: unknown[] = []) => {
  const onMove = f('MOVE');
  const onUp = f('UP');

  React.useEffect(() => {
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, args);
};
