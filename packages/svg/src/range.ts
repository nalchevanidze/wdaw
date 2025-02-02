export type Range = [number, number];

export const inRange = (n: number, [min, max]: Range) => min < n && n < max;

export const makeRange = (a: number, b: number): Range =>
  a < b ? [a, b] : [b, a];
