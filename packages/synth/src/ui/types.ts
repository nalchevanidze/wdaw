import { Point } from '@wdaw/svg';
import { Note } from '../engine';

export type GraphNote = {
  position: number;
  length: number;
  i: number;
};

export type Aera = readonly [Point, Point];

type BaseNote = Note & {
  position: number;
  i: number;
  index?: number;
};

export type NotePoint = BaseNote & {
  old?: Pick<BaseNote, 'i' | 'position' | 'length'>;
};

export type EditActionType = 'select' | 'draw';

export type Maybe<T> = T | undefined;
