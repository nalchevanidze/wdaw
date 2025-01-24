import { NotePoint, Aera } from '../types';
import { NOTE_SIZE, NOTE_STEP } from '../common/defs';

export const editNotes = (
    mode: 'MOVE' | 'SCALE',
    notes: NotePoint[],
    [start, current]: Aera
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
  