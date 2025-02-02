import { Point } from '@wdaw/svg';
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
  notes: Tracked<UINote>[],
  [time, tune]: [number, number]
): Tracked<UINote>[] => {
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
  size: number
): Tracked<UINote>[] =>
  notes.map((note) =>
    note.origin ? { ...note, length: note.origin.length + size } : note
  );

const getPositionY = ({ canvasHeight, noteHeight }: Dimentions, y: number) =>
  Math.floor(1 + (canvasHeight - y) / noteHeight);

export const genNoteAt = (d: Dimentions, { x, y }: Point): UINote => ({
  length: 1,
  positionY: getPositionY(d, y),
  at: Math.floor(x)
});

type Range = [number, number];

const getRange = (a: number, b: number): Range => [
  Math.min(a, b),
  Math.max(a, b)
];

const inRange = (n: number, [min, max]: Range) => min < n && n < max;

const inArea = (
  xRange: Range,
  yRange: Range,
  { at, positionY, length }: UINote
): boolean => {
  const end = at + length;

  const isInsideNote = at < xRange[0] && xRange[1] < end;

  const xIsInArea = inRange(at, xRange) || inRange(end, xRange) || isInsideNote;
  
  return xIsInArea && inRange(positionY, yRange);
};

export const selectNotesIn = (d: Dimentions, input: UINote[], zone?: Area) => {
  const notes: Selected<UINote> = { selected: [], inactive: [] };

  if (!zone) return { selected: [], inactive: input };

  const [start, end] = zone;
  const xRange = getRange(start.x, end.x);
  const yRange = getRange(getPositionY(d, start.y), getPositionY(d, end.y));

  input.forEach((note) =>
    inArea(xRange, yRange, note)
      ? notes.selected.push(addTracking(note))
      : notes.inactive.push(note)
  );

  return notes;
};
