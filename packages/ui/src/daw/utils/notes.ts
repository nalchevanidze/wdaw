import { inRange, makeRange, Range } from '@wdaw/svg';
import { Area } from '../types';
import { addTracking, Tracked } from './tracking';

export type Selected<T> = {
  selected: Tracked<T>[];
  inactive: T[];
};

export type UINote = {
  x: number;
  y: number;
  length: number;
};

const inArea = (rx: Range, ry: Range, { x, y, length }: UINote): boolean => {
  const x2 = x + length;
  const insideNote = x < rx[0] && rx[1] < x2;
  const inXArea = inRange(x, rx) || inRange(x2, rx) || insideNote;

  return inXArea && inRange(y, ry);
};

export const selectNotesIn = (input: UINote[], zone?: Area) => {
  const notes: Selected<UINote> = { selected: [], inactive: [] };

  if (!zone) return { selected: [], inactive: input };

  const [start, end] = zone;
  const xRange = makeRange(start.x, end.x);
  const yRange = makeRange(start.y, end.y);

  input.forEach((note) =>
    inArea(xRange, yRange, note)
      ? notes.selected.push(addTracking(note))
      : notes.inactive.push(note)
  );

  return notes;
};
