import { Area, Zone } from '@wdaw/svg';
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

const toZone = ({ x, y, length }: UINote) => ({
  x1: x,
  x2: x + length,
  y1: y - 1,
  y2: y + 1
});

export const selectNotesIn = (input: UINote[], area?: Area) => {
  const notes: Selected<UINote> = { selected: [], inactive: [] };

  if (!area) return { selected: [], inactive: input };

  const zone = new Zone(area);

  input.forEach((note) =>
    zone.isOverlaping(toZone(note))
      ? notes.selected.push(addTracking(note))
      : notes.inactive.push(note)
  );

  return notes;
};
