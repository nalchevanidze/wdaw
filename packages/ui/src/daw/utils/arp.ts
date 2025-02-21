import { Sequence } from '@wdaw/engine';

export type Location = {
  row: number;
  column: number;
};

export const toggleARPNote = (
  sequence: Sequence,
  { row, column }: Location
) => {
  const chord = sequence[column] ?? [];

  sequence[column] = chord;

  const index = chord.indexOf(row);

  if (index === -1) {
    chord.push(row);
  } else {
    chord.splice(index, 1);
  }

  return { ...sequence };
};
