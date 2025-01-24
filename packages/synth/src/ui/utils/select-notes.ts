import { CANVAS_HEIGHT, Selected } from '../piano-roll/utils';
import { GraphNote, NotePoint, Aera } from '../types';

import { NOTE_SIZE, NOTE_STEP } from '../common/defs';

export const isInArea = (
  [start, end]: Aera,
  { position, i, length }: GraphNote
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

const clusterArray = <T>(list: T[], func: (_: T) => boolean): Selected<T> => {
    const selected: T[] = [];
    const inactive: T[] = [];
  
    list.forEach((elem) =>
      func(elem) ? selected.push(elem) : inactive.push(elem)
    );
  
    return { selected, inactive };
  };
  
  export const selectNotesIn = (
    { selected, inactive }: Selected<NotePoint>,
    zone?: Aera
  ) =>
    clusterArray([...selected, ...inactive], (note) =>
      zone ? isInArea(zone, note) : false
    );
  