import { Area } from './types';

export type Range = [number, number];

export const inRange = (n: number, [min, max]: Range) => min < n && n < max;

const makeRange = (a: number, b: number): Range =>
  a < b ? [a, b] : [b, a];

export const isOverlaping = (range: Range, [start, end]: Range): boolean => {
  const inside = start < range[0] && range[1] < end;

  return inRange(start, range) || inRange(end, range) || inside;
};

export type IZone = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export class Zone {
  xrange: Range;
  yrange: Range;

  constructor([start, end]: Area) {
    this.xrange = makeRange(start.x, end.x);
    this.yrange = makeRange(start.y, end.y);
  }

  isOverlaping = ({ x1, x2, y1, y2 }: IZone) =>
    isOverlaping(this.xrange, [x1, x2]) && isOverlaping(this.yrange, [y1, y2]);
}
