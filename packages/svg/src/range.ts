import { Point } from './types';

export type Range = [number, number];

export const inRange = (n: number, [min, max]: Range) => min < n && n < max;

const makeRange = (a: number, b: number): Range => (a < b ? [a, b] : [b, a]);

const isOverlaping = (range: Range, [start, end]: Range): boolean => {
  const inside = start < range[0] && range[1] < end;

  return inRange(start, range) || inRange(end, range) || inside;
};

export type IArea = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

export class Area implements IArea {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  distanceX: number;
  distanceY: number;

  constructor(start: Point, end: Point) {
    const xrange = makeRange(start.x, end.x);
    const yrange = makeRange(start.y, end.y);

    this.x1 = xrange[0];
    this.x2 = xrange[1];
    this.y1 = yrange[0];
    this.y2 = yrange[1];

    this.distanceX = Math.round(end.x - start?.x);
    this.distanceY = Math.round(end.y - (start?.y ?? 0));
  }

  map = (f: (x: Point) => Point) =>
    new Area(f({ x: this.x1, y: this.y1 }), f({ x: this.x2, y: this.y2 }));

  isOverlaping = ({ x1, x2, y1, y2 }: IArea) =>
    isOverlaping([this.x1, this.x2], [x1, x2]) &&
    isOverlaping([this.y1, this.y2], [y1, y2]);
}
