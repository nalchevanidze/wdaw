import { Maybe} from '../../core/types';

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
};

export type ARP_NOTE_LOCATION = {
  row: number;
  column: number;
};
