import { Maybe, NoteAction } from '../../common/types';
import { SEQUENCE_LENGTH } from '../../common/defs';

export type Sequence = Record<number, Maybe<number[]>> & { enabled?: boolean };

const END_INDEX = SEQUENCE_LENGTH * 2;

class Arpeggiator {
  private last: Maybe<number[]>;
  private index: number;
  public notes: Set<number> = new Set([]);

  public getNotes = () => Array.from(this.notes);

  startNote(note: number) {
    if (!this.notes.has(note)) {
      this.index = 0;
    }

    this.notes.add(note);
  }

  endNote(note: number) {
    this.notes.delete(note);
  }

  next = (sequence: Sequence): NoteAction | undefined => {
    const { notes } = this;

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

  clear() {
    this.notes.clear();
  }
}

export { Arpeggiator };
