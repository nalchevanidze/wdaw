import { Area, isOverlaping, makeRange } from '@wdaw/svg';
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
    isOverlaping(yRange, [note.y, note.y + 1])
      ? notes.selected.push(addTracking(note))
      : notes.inactive.push(note)
  );

  return notes;
};
