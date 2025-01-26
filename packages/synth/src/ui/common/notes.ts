import { Point } from '@wdaw/svg';
import { distanceX, distanceY } from '../utils/area';
import { CANVAS_HEIGHT } from '../piano-roll/utils';
import { Area } from '../types';
import { NOTE, STEP } from './defs';
import { addTracking, Tracked } from '../utils/tracking';

export type Selected<T> = {
  selected: Tracked<T>[];
  inactive: T[];
};

export type UINote = {
  positionY: number;
  at: number;
  length: number;
};

export const moveNotes = (
  notes: Tracked<UINote>[],
  area: Area
): Tracked<UINote>[] => {
  const time = distanceX(area, STEP);
  const tune = distanceY(area, NOTE);

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
  const time = distanceX(area, STEP);

  return notes.map((note) =>
    note.origin ? { ...note, length: note.origin.length + time } : note
  );
};

export const genNoteAt = ({ x, y }: Point): UINote => {
  const positionY = Math.floor(1 + (CANVAS_HEIGHT - y) / NOTE);
  const at = Math.floor(x / STEP);
  return { length: STEP, positionY, at };
};

export const isInArea = (
  [start, end]: Area,
  { at, positionY, length }: UINote
): boolean => {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const startX = at * STEP;
  const endX = startX + length * STEP;
  const xIsInArea =
    (minX < startX && maxX > startX) ||
    (minX < endX && maxX > endX) ||
    (minX > startX && maxX < endX);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);
  const y = CANVAS_HEIGHT - NOTE * positionY;
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
  { selected, inactive }: Selected<UINote>,
  zone?: Area
) =>
  clusterArray([...selected, ...inactive], (note) =>
    zone ? isInArea(zone, note) : false
  );
