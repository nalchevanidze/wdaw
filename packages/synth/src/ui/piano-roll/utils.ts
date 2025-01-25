import {
  getNoteIdByIndex,
  keysToIndexes,
  OCTAVE_SIZE
} from '../../utils/notes';
import { Midi, Note } from '../../engine';
import { NOTE_SIZE, TIMELINE_HEIGHT } from '../common/defs';
import { Tracked } from '../utils/tracking';
import { NotePoint } from '../utils/notes';

export const CANVAS_HEIGHT = NOTE_SIZE * OCTAVE_SIZE * 4;

export const KEYBOARD_WIDTH = 20;

export const STAGE_HEIGHT = TIMELINE_HEIGHT + CANVAS_HEIGHT;

const notePosition = (index: number, at: number): number =>
  index * NOTE_SIZE + at;

const foldMidi =
  <T>(f: (n: Note, i: number) => T) =>
  (midi: Midi): T[] =>
    Object.entries(midi.notes).reduce<T[]>(
      (acc, [i, val]) =>
        Array.isArray(val)
          ? acc.concat(val.map((note: Note): T => f(note, parseInt(i, 10))))
          : acc,
      []
    );

export const flatten = foldMidi<NotePoint>((note, i) => ({
  ...note,
  index: i,
  i: keysToIndexes(note.id) + 1,
  position: notePosition(i, note.at)
}));

export const deepen = (flat: NotePoint[]): Partial<Midi> => {
  const notes: Midi['notes'] = {};

  flat.forEach(({ length, position, i }: NotePoint) => {
    const index = Math.floor(position / NOTE_SIZE);
    const at = position % NOTE_SIZE;
    const id = getNoteIdByIndex(i - 1);
    notes[index] = notes[index] || [];
    notes[index].push({ at, id, length });
  });

  return { notes };
};

export type Selected<T> = {
  selected: Tracked<T>[];
  inactive: T[];
};
