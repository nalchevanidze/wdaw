import { Point } from '@wdaw/svg';

export type Area = readonly [Point, Point];

type OriginNote = {
  i: number;
  position: number;
  length: number;
};

export type NotePoint = {
  position: number;
  length: number;
  i: number;
  index?: number;
  origin?: OriginNote;
};

export type EditActionType = 'select' | 'draw';

export type Maybe<T> = T | undefined;
