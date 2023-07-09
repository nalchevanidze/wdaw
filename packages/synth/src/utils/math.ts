export const unitInterval = (n: number) => Math.min(Math.max(n, 0), 1);

export const positive = (n: number) => Math.max(0, n);

export type Range = [number, number];

export const intRange = (value: number, [min, max]: Range) => {
  let size = max - min;
  return Math.floor(min + value * size);
};
