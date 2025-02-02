import { Point } from '@wdaw/svg';
import { distanceX, distanceY } from './area';
import { Area } from '../types';
import { addTracking, dropTracking, Tracked } from './tracking';

export type Selected<T> = {
  selected: Tracked<T>[];
  inactive: T[];
};

export type UINote = {
  positionY: number;
  at: number;
  length: number;
};

export type Dimentions = {
  noteHeight: number;
  canvasHeight: number;
};

export const moveNotes = (
  { noteHeight }: Dimentions,
  notes: Tracked<UINote>[],
  area: Area
): Tracked<UINote>[] => {
  const time = distanceX(area, 2);
  const tune = distanceY(area, noteHeight);

  return notes.map(
    (note): Tracked<UINote> =>
      note.origin
        ? {
            length: note.length,
            origin: note.origin,
            at: note.origin.at + time,
            positionY: note.origin.positionY - tune
          }
        : note
  );
};

export const scaleNotes = (
  notes: Tracked<UINote>[],
  area: Area
): Tracked<UINote>[] => {
  const time = distanceX(area, 2);

  return notes.map((note) =>
    note.origin ? { ...note, length: note.origin.length + time } : note
  );
};

export const genNoteAt = (
  { canvasHeight, noteHeight }: Dimentions,
  { x, y }: Point
): UINote => {
  const positionY = Math.floor(1 + (canvasHeight - y) / noteHeight);
  const at = Math.floor(x);
  return { length: 1, positionY, at };
};

const getRange = (a: number, b: number): [number, number] => [
  Math.min(a, b),
  Math.max(a, b)
];

const inRange = (n: number, [min, max]: [number, number]) => min < n && n < max;

const inArea = (
  { canvasHeight, noteHeight }: Dimentions,
  [start, end]: Area,
  { at, positionY, length }: UINote
): boolean => {
  const xRange = getRange(start.x, end.x);
  const yRange = getRange(start.y, end.y);

  const note = {
    start: at,
    end: at + length,
    y: canvasHeight - noteHeight * positionY
  };

  const selectionInsideNote = note.start < xRange[0] && xRange[1] < note.end;

  const xIsInArea =
    inRange(note.start, xRange) ||
    inRange(note.end, xRange) ||
    selectionInsideNote;

  return xIsInArea && inRange(note.y, yRange);
};

export const selectNotesIn = (
  dims: Dimentions,
  input: UINote[],
  zone?: Area
) => {
  const notes: Selected<UINote> = { selected: [], inactive: [] };

  input.forEach((note) =>
    zone && inArea(dims, zone, note)
      ? notes.selected.push(addTracking(note))
      : notes.inactive.push(note)
  );

  return notes;
};
