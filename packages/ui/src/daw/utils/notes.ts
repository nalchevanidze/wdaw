import { Point } from '@wdaw/svg';
import { distanceX, distanceY } from './area';
import { Area } from '../types';
import { addTracking, Tracked } from './tracking';

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

export const isInArea = (
  { canvasHeight, noteHeight }: Dimentions,
  [start, end]: Area,
  { at, positionY, length }: UINote
): boolean => {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const startX = at;
  const endX = startX + length;
  const xIsInArea =
    (minX < startX && maxX > startX) ||
    (minX < endX && maxX > endX) ||
    (minX > startX && maxX < endX);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);
  const y = canvasHeight - noteHeight * positionY;
  const yIsInArea = minY < y && maxY > y;
  return xIsInArea && yIsInArea;
};

const clusterArray = <T extends object>(
  list: T[],
  func: (_: T) => boolean
): Selected<T> => {
  const selected: Tracked<T>[] = [];
  const inactive: T[] = [];

  list.forEach((elem) =>
    func(elem) ? selected.push(addTracking<T>(elem)) : inactive.push(elem)
  );

  return { selected, inactive };
};

export const selectNotesIn = (
  dims: Dimentions,
  { selected, inactive }: Selected<UINote>,
  zone?: Area
) =>
  clusterArray([...selected, ...inactive], (note) =>
    zone ? isInArea(dims, zone, note) : false
  );
