export type Range = [number, number];

export const inRange = (n: number, [min, max]: Range) => min < n && n < max;

export const makeRange = (a: number, b: number): Range =>
  a < b ? [a, b] : [b, a];

export const isOverlaping = (range: Range, [start, end]: Range): boolean => {
  const inside = start < range[0] && range[1] < end;

  return inRange(start, range) || inRange(end, range) || inside;
};
