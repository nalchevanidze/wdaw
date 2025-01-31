import { Point, StageContext } from '@wdaw/svg';
import * as React from 'react';
import { Area, Maybe, MEvent, MHandler } from '../types';

export type MODE = 'scale' | 'move' | 'select';

type OnBackgroundHandler = (p: Point) => Maybe<MODE>;
type onInactiveHandler<T> = (p: T) => Maybe<MODE>;

type Optins<T> = {
  onMove: Record<MODE, (a: Maybe<Area>) => void>;
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
  const getCoordinates = React.useContext(StageContext);

  const [area, setSelectionArea] = React.useState<Area | undefined>();
  const [mode, setMode] = React.useState<MODE | undefined>(undefined);
  const [dragging, setDragging] = React.useState<Maybe<Point>>(undefined);

  const start = (name: MODE, e: MEvent) => {
    setMode(name);
    setDragging(getCoordinates(e));
  };
  const end = () => {
    setSelectionArea(undefined);
    setMode(undefined);
    setDragging(undefined);
    ops.onEnd?.(mode);
  };

  const onMove: MHandler = (e) => {
    if (mode) {
      const area: Maybe<Area> = dragging
        ? [dragging, getCoordinates(e)]
        : undefined;

      if (mode == 'select') {
        setSelectionArea(area);
      }
      ops.onMove[mode](area);
    }
  };

  const onBackground = (e: MEvent) => {
    const name = ops.onBackground?.(getCoordinates(e));
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
