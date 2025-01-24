import { Point, StageContext } from '@wdaw/svg';
import * as React from 'react';
import { Area, Maybe } from '../types';

export type MODE = 'scale' | 'move' | 'select';

export type MEvent = React.MouseEvent<SVGGElement, MouseEvent>;
export type MHandler = React.MouseEventHandler<SVGGElement>;

type OnBackgroundHandler = (p: Point) => Maybe<MODE>;

type Optins = {
  onMove: Record<MODE, (a: Maybe<Area>) => void>;
  onEnd?(mode?: MODE): void;
  onBackground: OnBackgroundHandler;
  onSelected?: () => void;
};

export const useDragging = (ops: Optins) => {
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

  const onMouseMove: MHandler = (e) => {
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
    const name = ops.onBackground(getCoordinates(e));
    if (name) {
      start(name, e);
    }
  };

  const onSelected =
    (name: MODE) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
      start(name, e);
      ops.onSelected?.();
    };

  return { area, start, end, onMouseMove, onBackground, onSelected };
};
