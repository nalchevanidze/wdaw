import { Point, usePoint, Area } from '@wdaw/svg';
import * as React from 'react';
import { Maybe, MEvent } from '../types';
import { useMouseEvent } from '../../hooks/use-mouse-event';

export type MODE = 'scale' | 'move' | 'select';

type Optins<T> = {
  onMove: {
    select(a: Maybe<Area>): void;
    move(moveX: number, moveY: number): void;
    scale(moveX: number): void;
  };
  onEnd?(mode?: MODE): void;
  onStart?: (p: T) => void;
  onBackground?: (p: Point) => void | Maybe<MODE>;
};

export type HandlerMap<K extends string, T> = Record<
  K,
  (note: T) => void | Maybe<MODE>
>;

export const useDragging = <T>(ops: Optins<T>) => {
  const toPoint = usePoint();

  const [area, setArea] = React.useState<Area | undefined>();
  const [dragging, setDragging] = React.useState<Maybe<Point>>(undefined);

  const setMode = useMouseEvent<MODE>({
    move: (p, mode) => {
      const area = dragging ? new Area(dragging, p) : undefined;

      switch (mode) {
        case 'select':
          setArea(area);
          return ops.onMove.select(area);
        case 'move':
          return area ? ops.onMove.move(area.moveX, area.moveY) : undefined;
        case 'scale':
          return area ? ops.onMove.scale(area.moveX) : undefined;
      }
    },
    end: (mode) => {
      setArea(undefined);
      setDragging(undefined);
      ops.onEnd?.(mode);
    }
  });

  const onElement = (name: MODE) => (e: MEvent, t?: T) => {
    setMode(name);
    setDragging(toPoint(e));

    if (t !== undefined) {
      ops.onStart?.(t);
    }
  };

  const onBackground = (e: MEvent) => {
    const name = ops.onBackground?.(toPoint(e));
    if (name) {
      onElement(name)(e);
    }
  };

  return {
    area,
    onElement,
    onBackground
  };
};
