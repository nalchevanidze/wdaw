import { Midi, Note, UIPosition } from '@wdaw/engine';
import { UINote } from './notes';

export const flatten = ({ notes }: Midi): UINote[] =>
  notes.map(
    ({ id, at, length }: Note): UINote => ({
      length,
      at,
      y: UIPosition.fromNote(id)
    })
  );

export const deepen = (notes: UINote[]): Partial<Midi> => ({
  notes: notes.map(({ length, at, y }: UINote) => ({
    at,
    length,
    id: UIPosition.toNote(y)
  }))
});
