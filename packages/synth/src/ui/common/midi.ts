import { UIPosition } from '../../utils/notes';
import { Midi, Note } from '../../engine';
import { UINote } from './notes';

export const flatten = ({ notes }: Midi): UINote[] =>
  notes.map(
    ({ id, at, length }: Note): UINote => ({
      length,
      at,
      positionY: UIPosition.fromNote(id)
    })
  );

export const deepen = (notes: UINote[]): Partial<Midi> => ({
  notes: notes.map(({ length, at, positionY }: UINote) => ({
    at,
    length,
    id: UIPosition.toNote(positionY - 1)
  }))
});
