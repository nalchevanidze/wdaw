import { Area, IArea } from '@wdaw/svg';

export type UINote = {
  x: number;
  y: number;
  length: number;
};

export const toArea = ({ x, y, length }: UINote): IArea => ({
  x1: x,
  x2: x + length,
  y1: y - 1,
  y2: y + 1
});

