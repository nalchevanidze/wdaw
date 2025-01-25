import { Point } from '@wdaw/svg';
import { distanceX, distanceY } from '../utils/area';
import { CANVAS_HEIGHT, Selected } from '../piano-roll/utils';
import { Area } from '../types';
import { NOTE_SIZE, NOTE_STEP } from './defs';
import { addTracking, Tracked } from '../utils/tracking';

export type UINote = {
  i: number;
  position: number;
  length: number;
};

export const moveNotes = (
  notes: Tracked<UINote>[],
  area: Area
): Tracked<UINote>[] => {
  const time = distanceX(area, NOTE_STEP);
  const tune = distanceY(area, NOTE_SIZE);

  return notes.map((note) =>
    note.origin
      ? {
          ...note,
          position: note.origin.position + time,
          i: note.origin.i - tune
        }
      : note
  );
};

export const scaleNotes = (
  notes: Tracked<UINote>[],
  area: Area
): Tracked<UINote>[] => {
  const time = distanceX(area, NOTE_STEP);

  return notes.map((note) =>
    note.origin ? { ...note, length: note.origin.length + time } : note
  );
};

export const genNoteAt = ({ x, y }: Point): UINote => {
  const i = Math.floor(1 + (CANVAS_HEIGHT - y) / NOTE_SIZE);
  const position = Math.floor(x / NOTE_STEP);
  return { length: NOTE_STEP, i, position };
};

export const isInArea = (
  [start, end]: Area,
  { position, i, length }: UINote
): boolean => {
  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);
  const startX = position * NOTE_STEP;
  const endX = startX + length * NOTE_STEP;
  const xIsInArea =
    (minX < startX && maxX > startX) ||
    (minX < endX && maxX > endX) ||
    (minX > startX && maxX < endX);
  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);
  const y = CANVAS_HEIGHT - NOTE_SIZE * i;
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
