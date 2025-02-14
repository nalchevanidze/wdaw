import { MidiFragment, Note, UIPosition } from '@wdaw/engine';
import { UINote } from './notes';

export const fromMidiFragment = ({ notes }: MidiFragment): UINote[] =>
  notes.map(
    ({ id, at, length }: Note): UINote => ({
      x: at,
      y: UIPosition.fromNote(id),
      length
    })
  );

export const toMidiFragment = (notes: UINote[]): Partial<MidiFragment> => ({
  notes: notes.map(({ length, x, y }: UINote) => ({
    at: x,
    id: UIPosition.toNote(y),
    length
  }))
});
