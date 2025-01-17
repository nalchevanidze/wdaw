import { Maybe, NoteAction } from '../../core/types';


export enum NOTE_ACTION {
  START,
  END
}

export type MidiStep = NoteAction & {
  current?: number;
};
