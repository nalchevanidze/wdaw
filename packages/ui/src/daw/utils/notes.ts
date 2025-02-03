import { inRange, isOverlaping, makeRange, Range } from '@wdaw/svg';
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

export const selectNotesIn = (input: UINote[], zone?: Area) => {
  const notes: Selected<UINote> = { selected: [], inactive: [] };

  if (!zone) return { selected: [], inactive: input };

  const [start, end] = zone;
  const xRange = makeRange(start.x, end.x);
  const yRange = makeRange(start.y, end.y);

  input.forEach((note) =>
    isOverlaping(xRange, [note.x, note.x + note.length]) &&
    inRange(note.y, yRange)
      ? notes.selected.push(addTracking(note))
      : notes.inactive.push(note)
  );

  return notes;
};
