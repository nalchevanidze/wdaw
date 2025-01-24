import { NotePoint, Area } from '../types';
import { NOTE_SIZE, NOTE_STEP } from '../common/defs';
import { Point } from '@wdaw/svg';
import { getNoteIdByIndex } from '../../utils/notes';
import { CANVAS_HEIGHT } from '../piano-roll/utils';

const getTime = ([start, current]: Area) =>
  Math.round((current.x - (start?.x ?? 0)) / NOTE_STEP);

const getTune = ([start, current]: Area) =>
  Math.round((current.y - (start?.y ?? 0)) / NOTE_SIZE);

export const moveNotes = (notes: NotePoint[], area: Area) => {
  const time = getTime(area);
  const tune = getTune(area);

  return notes.map((note) =>
    note.old
      ? {
          ...note,
          position: note.old.position + time,
          i: note.old.i - tune
        }
      : note
  );
};

export const scaleNotes = (notes: NotePoint[], area: Area) => {
  const time = getTime(area);

  return notes.map((note) =>
    note.old ? { ...note, length: note.old.length + time } : note
  );
};

export const genNoteAt = ({ x, y }: Point): NotePoint => {
  const i = Math.floor(1 + (CANVAS_HEIGHT - y) / NOTE_SIZE);
  const position = Math.floor(x / NOTE_STEP);
  return {
    length: 2,
    i,
    position,
    id: getNoteIdByIndex(i - 1),
    at: position % 8
  };
};
