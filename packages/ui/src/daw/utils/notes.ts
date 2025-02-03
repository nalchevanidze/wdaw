import { Zone } from '@wdaw/svg';
import { selectIn } from './selection';

export type UINote = {
  x: number;
  y: number;
  length: number;
};

export const selectNotesIn = selectIn<UINote>(({ x, y, length }) => ({
  x1: x,
  x2: x + length,
  y1: y - 1,
  y2: y + 1
}));
