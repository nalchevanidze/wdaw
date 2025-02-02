import { Point } from '@wdaw/svg';
import { Area, Maybe } from '../types';

export type Dimentions = {
  noteHeight: number;
  canvasHeight: number;
};

const getPositionY = ({ canvasHeight, noteHeight }: Dimentions, y: number) =>
  Math.floor(1 + (canvasHeight - y) / noteHeight);

export const normalizer =
  (d: Dimentions) =>
  ({ x, y }: Point): Point => ({
    x: Math.floor(x),
    y: getPositionY(d, y)
  });

export const mapAera = (f: (p: Point) => Point, area?: Area): Maybe<Area> =>
  area ? [f(area[0]), f(area[1])] : undefined;
