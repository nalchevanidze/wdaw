import { Point, StageContext } from '@wdaw/svg';
import * as React from 'react';
import { Maybe } from '../types';

export type MODE = 'SCALE' | 'MOVE' | 'SELECT';

type MEvent = React.MouseEvent<SVGGElement, MouseEvent>;

export const useDragging = () => {
  const getCoordinates = React.useContext(StageContext);

  const [mode, setMode] = React.useState<MODE | undefined>(undefined);
  const [dragging, setDragging] = React.useState<Maybe<Point>>(undefined);

  const startDraggingE = (name: MODE, e: MEvent) => {
    setMode(name);
    setDragging(getCoordinates(e));
  };
  const endDraggingE = () => {
    setMode(undefined);
    setDragging(undefined);
  };

  return {
    mode,
    dragging,
    setMode,
    startDraggingE,
    endDraggingE
  };
};
