import { NotePoint, Area } from '../types';
import { NOTE_SIZE, NOTE_STEP } from '../common/defs';
import { Point } from '@wdaw/svg';
import { CANVAS_HEIGHT } from '../piano-roll/utils';
import { distanceX, distanceY } from './area';
import { Tracked } from './tracking';

export const moveNotes = (
  notes: Tracked<NotePoint>[],
  area: Area
): Tracked<NotePoint>[] => {
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
  notes: Tracked<NotePoint>[],
  area: Area
): Tracked<NotePoint>[] => {
  const time = distanceX(area, NOTE_STEP);

  return notes.map((note) =>
    note.origin ? { ...note, length: note.origin.length + time } : note
  );
};

export const genNoteAt = ({ x, y }: Point): NotePoint => {
  const i = Math.floor(1 + (CANVAS_HEIGHT - y) / NOTE_SIZE);
  const position = Math.floor(x / NOTE_STEP);
  return { length: NOTE_STEP, i, position };
};
