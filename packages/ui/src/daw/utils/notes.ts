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

export const selectNotesIn = (input: UINote[], area?: Area) => {
  const notes: Selected<UINote> = { selected: [], inactive: [] };

  if (!area) return { selected: [], inactive: input };

  const zone = new Zone(area);

  input.forEach((note) =>
    zone.isOverlaping({
      x1: note.x,
      x2: note.x + note.length,
      y1: note.y - 1,
      y2: note.y + 1
    })
      ? notes.selected.push(addTracking(note))
      : notes.inactive.push(note)
  );

  return notes;
};
