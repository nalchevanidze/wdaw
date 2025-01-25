import { getNoteIdByIndex, keysToIndexes } from '../../utils/notes';
import { Midi, Note } from '../../engine';
import { UINote } from './notes';

export const flatten = ({ notes }: Midi): UINote[] =>
  notes.map(
    ({ id, at, length }: Note): UINote => ({
      length,
      at,
      positionY: keysToIndexes(id) + 1
    })
  );

export const deepen = (notes: UINote[]): Partial<Midi> => ({
  notes: notes.map(({ length, at, positionY }: UINote) => ({
    at,
    length,
    id: getNoteIdByIndex(positionY - 1)
  }))
});
