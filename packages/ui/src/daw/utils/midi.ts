import { MidiFragment, UIPosition } from '@wdaw/engine';
import { UINote } from './notes';

export const toMidiFragment = (notes: UINote[]): Partial<MidiFragment> => ({
  notes: notes.map(({ length, x, y }: UINote) => ({
    at: x,
    id: UIPosition.toNote(y),
    length
  }))
});
