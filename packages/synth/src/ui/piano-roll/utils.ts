import { Point } from '@wdaw/svg';
import {
  getNoteIdByIndex,
  keysToIndexes,
  OCTAVE_SIZE
} from '../../utils/notes';
import { GraphNote, NotePoint, Aera } from '../types';
import { Midi, Note } from '../../engine';
import { NOTE_SIZE, NOTE_STEP, TIMELINE_HEIGHT } from '../common/defs';

export const SUB_QUARTER = NOTE_SIZE * 4;

export const QUARTER = SUB_QUARTER * 4;

export const CANVAS_HEIGHT = NOTE_SIZE * OCTAVE_SIZE * 4;

export const CANVAS_WIDTH = QUARTER * 4;

export const OCTAVE_HEIGHT = NOTE_SIZE * OCTAVE_SIZE;

export const KEYBOARD_WIDTH = 20;

export const STAGE_WIDTH = KEYBOARD_WIDTH + CANVAS_WIDTH;

export const STAGE_HEIGHT = TIMELINE_HEIGHT + CANVAS_HEIGHT;

const notePosition = (index: number, at: number): number => index * 8 + at;

export const sortNumbers = (n1: number, n2: number): number[] =>
  [n1, n2].sort((a, b) => (a > b ? 1 : -1));

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

export const deepen = (flat: NotePoint[], old: Midi): Midi => {
  const notes: Midi['notes'] = {};

  flat.forEach(({ length, position, i }: NotePoint) => {
    const index = Math.floor(position / 8);
    const at = position % 8;
    const id = getNoteIdByIndex(i - 1);
    notes[index] = notes[index] || [];
    notes[index].push({ at, id, length });
  });

  return { ...old, notes };
};

export const editNotes = (
  mode: 'MOVE' | 'SCALE',
  notes: NotePoint[],
  dragging: Point,
  current: Point
) => {
  const time = Math.round((current.x - (dragging?.x ?? 0)) / NOTE_STEP);
  const tune = Math.round((current.y - (dragging?.y ?? 0)) / NOTE_SIZE);

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

export type Selected<T> = {
  selected: T[];
  inactive: T[];
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
