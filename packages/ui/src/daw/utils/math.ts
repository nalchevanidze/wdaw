import {  Range } from '@wdaw/svg';

export const unitInterval = (n: number) => Math.min(Math.max(n, 0), 1);

export const positive = (n: number) => Math.max(0, n);

export const intRange = (value: number, [min, max]: Range) => {
  const size = max - min;
  return Math.floor(min + value * size);
};
