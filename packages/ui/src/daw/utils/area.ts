import { Area } from '../types';

export const withAccuracy = (n: number, step: number) =>
  Math.round(n / step) * step;

export const distanceX = ([start, current]: Area) =>
  Math.round(current.x - (start?.x ?? 0));

export const distanceY = ([start, current]: Area) =>
  Math.round(current.y - (start?.y ?? 0));
