import {  Point, Trajectory, usePoint, Zone } from '@wdaw/svg';
import * as React from 'react';
import { Maybe, MEvent, MHandler } from '../types';
import { distanceX, distanceY } from '../utils/area';

export type MODE = 'scale' | 'move' | 'select';

type OnBackgroundHandler = (p: Point) => Maybe<MODE>;
type onInactiveHandler<T> = (p: T) => Maybe<MODE>;

export type AreaHandler = (a: Maybe<Zone>) => void;

type Optins<T> = {
  onMove: {
    select: AreaHandler;
    move: (x: number, y: number) => void;
    scale: (size: number) => void;
  };
  onEnd?(mode?: MODE): void;
  onBackground?: OnBackgroundHandler;
  onSelected?: () => void;
  onInactive?: onInactiveHandler<T>;
};

export type HandlerMap<K extends string, T> = Record<
  K,
  (note: T) => Maybe<MODE>
>;

export const useDragging = <T>(ops: Optins<T>) => {
  const toPoint = usePoint();

  const [area, setSelectionArea] = React.useState<Zone | undefined>();
  const [mode, setMode] = React.useState<MODE | undefined>(undefined);
  const [dragging, setDragging] = React.useState<Maybe<Point>>(undefined);

  const start = (name: MODE, e: MEvent) => {
    setMode(name);
    setDragging(toPoint(e));
  };
  const end = () => {
    setSelectionArea(undefined);
    setMode(undefined);
    setDragging(undefined);
    ops.onEnd?.(mode);
  };

  const onMove: MHandler = (e) => {
    if (mode) {
      const area: Maybe<Trajectory> = dragging ? [dragging, toPoint(e)] : undefined;
      const zone: Maybe<Zone> = area ? new Zone(...area) : undefined;

      if (mode == 'select') {
        setSelectionArea(zone);
      }

      switch (mode) {
        case 'select':
          setSelectionArea(zone);
          return ops.onMove.select(zone);
        case 'move':
          if (!area) return;
          return ops.onMove.move(distanceX(area), distanceY(area));
        case 'scale':
          if (!area) return;
          return ops.onMove.scale(distanceX(area));
      }
    }
  };

  const onBackground = (e: MEvent) => {
    const name = ops.onBackground?.(toPoint(e));
    if (name) {
      start(name, e);
    }
  };

  const onSelected =
    (name: MODE): MHandler =>
    (e) => {
      start(name, e);
      ops.onSelected?.();
    };

  const onInactive = (e: MEvent, t: T) => {
    const name = ops.onInactive?.(t);

    if (name) {
      start(name, e);
    }
  };

  return {
    area,
    start,
    end,
    onMove,
    onBackground,
    onSelected,
    onInactive
  };
};
