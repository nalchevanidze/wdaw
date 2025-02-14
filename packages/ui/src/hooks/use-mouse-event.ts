import { Point, usePoint } from '@wdaw/svg';
import { useEffect } from 'react';

type Handlers = {
  move: (p: Point) => void;
  end: () => void;
  isListening: boolean;
};

export const useMouseEvent = ({ end, move, isListening }: Handlers) => {
  const toPoint = usePoint();

  useEffect(() => {
    if (!isListening) return;

    const onMousemove = (event: MouseEvent) => move(toPoint(event));
    const onMouseup = () => end();

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);

    return () => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };
  }, [isListening]);
};
