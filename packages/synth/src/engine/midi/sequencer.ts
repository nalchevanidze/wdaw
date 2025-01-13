import { SEQUENCE_LENGTH } from '../../core/defs';
import { Maybe } from '../../core/types';
import { ARP_NOTE_LOCATION, NoteAction, Sequence } from './types';

const END_INDEX = SEQUENCE_LENGTH * 2;

class Sequencer {
  private last: Maybe<number[]>;
  private index: number;

  public restart = (): void => {
    this.index = 0;
  };

  next = (sequence: Sequence, notes: Set<number>): NoteAction | undefined => {
    if (!sequence.enabled) {
      return undefined;
    }

    if (this.index % 2 !== 0) {
      this.index++;
      if (this.index >= END_INDEX) {
        this.index = 0;
      }
      return undefined;
    }

    const index = this.index / 2;
    const maxNotes: number = notes.size;
    const sortedNotes = Array.from(notes).sort((a, b) => (a > b ? 1 : -1));
    const start = maxNotes
      ? sequence[index]?.map((i) => {
          i--;
          return sortedNotes[i % maxNotes] + 12 * Math.floor(i / maxNotes);
        })
      : undefined;

    this.index++;

    if (this.index >= END_INDEX) {
      this.index = 0;
    }

    const end = this.last;
    this.last = start;

    return { start, end };
  };
}

const toggleARPNote = (
  sequence: Sequence,
  { row, column }: ARP_NOTE_LOCATION
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

export { Sequencer, toggleARPNote };
