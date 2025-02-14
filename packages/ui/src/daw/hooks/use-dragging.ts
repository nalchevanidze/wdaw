import { Point, Trajectory, usePoint, Area } from '@wdaw/svg';
import * as React from 'react';
import { Maybe, MEvent, MHandler } from '../types';
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
  const [mode, setMode] = React.useState<MODE | undefined>(undefined);
  const [dragging, setDragging] = React.useState<Maybe<Point>>(undefined);

  const start = (name: MODE, e: MEvent) => {
    setMode(name);
    setDragging(toPoint(e));
  };

  const end = () => {
    setArea(undefined);
    setMode(undefined);
    setDragging(undefined);
    ops.onEnd?.(mode);
  };

  const move = (p: Point) => {
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
  };

  const onBackground = (e: MEvent) => {
    const name = ops.onBackground?.(toPoint(e));
    if (name) {
      start(name, e);
    }
  };

  const onStart = (name: MODE) => (e: MEvent, t?: T) => {
    start(name, e);
    if (t !== undefined) {
      ops.onStart?.(t);
    }
  };

  useMouseEvent({ move, end, isListening: Boolean(mode) });

  return {
    area,
    start,
    onBackground,
    onStart
  };
};
