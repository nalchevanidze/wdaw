import { Trajectory } from '@wdaw/svg';

export const withAccuracy =
  (f: (time: number) => void, step: number) => (n: number) =>
    f(toAccuracy(n, step));

export const toAccuracy = (n: number, step: number) =>
  Math.round(n / step) * step;

export const distanceX = ([start, current]: Trajectory) =>
  Math.round(current.x - (start?.x ?? 0));

export const distanceY = ([start, current]: Trajectory) =>
  Math.round(current.y - (start?.y ?? 0));
