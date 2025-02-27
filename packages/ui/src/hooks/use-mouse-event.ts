import { Point, usePoint } from '@wdaw/svg';
import { useEffect, useState } from 'react';

type Handlers<T> = {
  move: (p: Point, t: T) => void;
  end?: (t: T) => void;
};

export const useMouseEvent = <T>({ end, move }: Handlers<T>) => {
  const toPoint = usePoint();

  const [current, setCurrent] = useState<T | undefined>();

  useEffect(() => {
    if (!current) return;

    const onMousemove = (event: MouseEvent) => move(toPoint(event), current);

    const onMouseup = () => {
      end?.(current);
      setCurrent(undefined);
    };

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);

    return () => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };
  }, [current]);

  return setCurrent;
};
