import { Midi, Note, UIPosition } from '@wdaw/engine';
import { UINote } from './notes';

export const flatten = ({ notes }: Midi): UINote[] =>
  notes.map(
    ({ id, at, length }: Note): UINote => ({
      x: at,
      y: UIPosition.fromNote(id),
      length,
    })
  );

export const deepen = (notes: UINote[]): Partial<Midi> => ({
  notes: notes.map(({ length, x, y }: UINote) => ({
    at: x,
    id: UIPosition.toNote(y),
    length
  }))
});
