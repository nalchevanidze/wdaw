import { Point } from '@wdaw/svg';

export type Area = readonly [Point, Point];

type Note = {
  i: number;
  position: number;
  length: number;
};

export type NotePoint = Note & {
  origin?: Note;
};

export type EditActionType = 'select' | 'draw';

export type Maybe<T> = T | undefined;
