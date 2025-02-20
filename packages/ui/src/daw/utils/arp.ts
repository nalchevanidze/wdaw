import { Sequence } from '@wdaw/engine';

export type Location = {
  row: number;
  column: number;
};

export const toggleARPNote = (
  sequence: Sequence,
  { row, column }: Location
) => {
  const chord = sequence[row] ?? [];

  sequence[row] = chord;

  const index = chord.indexOf(column);

  if (index === -1) {
    chord.push(column);
  } else {
    chord.splice(index, 1);
  }

  return { ...sequence };
};
