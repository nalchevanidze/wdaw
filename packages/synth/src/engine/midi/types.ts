import { Maybe } from '../../types';

export type Note = {
  id: string;
  length: number;
  at: number;
};

export type Midi = {
  size: number;
  notes: Record<number, Note[]>;
};

export type Sequence = Record<number, Maybe<number[]>> & { enabled?: boolean };

export enum NOTE_ACTION {
  START,
  END
}

export type NoteAction = {
  start?: number[];
  end?: number[];
};

export type MidiStep = NoteAction & {
  current?: number;
  notes: Set<number>;
};

export type ARP_NOTE_LOCATION = {
  row: number;
  column: number;
};
