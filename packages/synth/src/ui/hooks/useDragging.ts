import { Point, StageContext } from '@wdaw/svg';
import * as React from 'react';
import { Aera, Maybe } from '../types';

export type MODE = 'SCALE' | 'MOVE' | 'SELECT';

export type MEvent = React.MouseEvent<SVGGElement, MouseEvent>;
export type MHandler = React.MouseEventHandler<SVGGElement>;

type Optins = {
  onMouseMove(mode: MODE, area: Maybe<Aera>): void;
  onEndDragging?(mode?: MODE): void;
};

export const useDragging = (ops: Optins) => {
  const getCoordinates = React.useContext(StageContext);

  const [selectionArea, setSelectionArea] = React.useState<Aera | undefined>();
  const [mode, setMode] = React.useState<MODE | undefined>(undefined);
  const [dragging, setDragging] = React.useState<Maybe<Point>>(undefined);

  const startDragging = (name: MODE, e: MEvent) => {
    setMode(name);
    setDragging(getCoordinates(e));
  };
  const endDragging = () => {
    setSelectionArea(undefined);
    setMode(undefined);
    setDragging(undefined);
    ops.onEndDragging?.(mode);
  };

  const onMouseMove: MHandler = (e) => {
    if (mode) {
      const area: Maybe<Aera> = dragging
        ? [dragging, getCoordinates(e)]
        : undefined;

      if (mode == 'SELECT') {
        setSelectionArea(area);
      }
      ops.onMouseMove(mode, area);
    }
  };

  return { selectionArea, startDragging, endDragging, onMouseMove };
};
