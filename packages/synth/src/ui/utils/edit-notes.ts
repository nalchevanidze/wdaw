import { NotePoint, Area } from '../types';
import { NOTE_SIZE, NOTE_STEP } from '../common/defs';
import { Point } from '@wdaw/svg';
import { getNoteIdByIndex } from '../../utils/notes';
import { CANVAS_HEIGHT } from '../piano-roll/utils';

export const editNotes = (
  mode: 'MOVE' | 'SCALE',
  notes: NotePoint[],
  [start, current]: Area
) => {
  const time = Math.round((current.x - (start?.x ?? 0)) / NOTE_STEP);
  const tune = Math.round((current.y - (start?.y ?? 0)) / NOTE_SIZE);

  switch (mode) {
    case 'SCALE':
      return notes.map((note) =>
        note.old ? { ...note, length: note.old.length + time } : note
      );
    case 'MOVE':
      return notes.map((note) =>
        note.old
          ? {
              ...note,
              position: note.old.position + time,
              i: note.old.i - tune
            }
          : note
      );
  }
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
