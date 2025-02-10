import { NoteAction } from '../common/types';

export type MidiStep = NoteAction & {
  current?: number;
};
