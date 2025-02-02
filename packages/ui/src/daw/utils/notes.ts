import { Point } from '@wdaw/svg';
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

export const moveNotes = (
  notes: Tracked<UINote>[],
  [time, tune]: [number, number]
): Tracked<UINote>[] => {
  return notes.map(
    (note): Tracked<UINote> =>
      note.origin
        ? {
            length: note.length,
            origin: note.origin,
            x: note.origin.x + time,
            y: note.origin.y - tune
          }
        : note
  );
};

export const scaleNotes = (
  notes: Tracked<UINote>[],
  size: number
): Tracked<UINote>[] =>
  notes.map((note) =>
    note.origin ? { ...note, length: note.origin.length + size } : note
  );

export const genNoteAt = ({ x, y }: Point): UINote => ({ length: 1, y, x });

type Range = [number, number];

const getRange = (a: number, b: number): Range => [
  Math.min(a, b),
  Math.max(a, b)
];

const inRange = (n: number, [min, max]: Range) => min < n && n < max;

const inArea = (xr: Range, yr: Range, { x, y, length }: UINote): boolean => {
  const end = x + length;
  const insideNote = x < xr[0] && xr[1] < end;
  const inXArea = inRange(x, xr) || inRange(end, xr) || insideNote;

  return inXArea && inRange(y, yr);
};

export const selectNotesIn = (input: UINote[], zone?: Area) => {
  const notes: Selected<UINote> = { selected: [], inactive: [] };

  if (!zone) return { selected: [], inactive: input };

  const [start, end] = zone;
  const xRange = getRange(start.x, end.x);
  const yRange = getRange(start.y, end.y);

  input.forEach((note) =>
    inArea(xRange, yRange, note)
      ? notes.selected.push(addTracking(note))
      : notes.inactive.push(note)
  );

  return notes;
};
