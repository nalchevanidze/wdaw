import { Point, Trajectory, usePoint, Area } from '@wdaw/svg';
import * as React from 'react';
import { Maybe, MEvent } from '../types';
import { distanceX, distanceY } from '../utils/area';
import { useMouseEvent } from '../../hooks/use-mouse-event';

export type MODE = 'scale' | 'move' | 'select';

export type AreaHandler = (a: Maybe<Area>) => void;

type Optins<T> = {
  onMove: {
    select: AreaHandler;
    move: (x: number, y: number) => void;
    scale: (size: number) => void;
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
    move: (p: Point, mode) => {
      const t: Maybe<Trajectory> = dragging ? [dragging, p] : undefined;

      switch (mode) {
        case 'select':
          const area = t ? new Area(...t) : undefined;
          setArea(area);
          return ops.onMove.select(area);
        case 'move':
          if (!t) return;
          return ops.onMove.move(distanceX(t), distanceY(t));
        case 'scale':
          if (!t) return;
          return ops.onMove.scale(distanceX(t));
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
