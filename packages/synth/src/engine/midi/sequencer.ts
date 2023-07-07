import { SEQUENCE_LENGTH } from "../state/presets";
import { Maybe } from "../../types";
import { ARP_NOTE_LOCATION, NoteAction, Sequence } from "./types";

const END_INDEX = SEQUENCE_LENGTH * 2;

class Sequencer {
  private last: Maybe<number[]>;
  private sequence: Sequence = {};
  private index: number;

  constructor(sequence: Sequence = {}) {
    this.sequence = sequence;
  }

  public setSequence = (seq: Sequence): void => {
    this.sequence = seq;
  };

  public restart = (): void => {
    this.index = 0;
  };

  get enabled(): boolean {
    return this.sequence.enabled ?? false;
  }

  next = (notes: Set<number>): NoteAction | undefined => {
    
    if(!this.enabled){
      return undefined
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
      ? this.sequence[index]?.map((i) => {
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

  public toggleARPNote = ({ row, column }: ARP_NOTE_LOCATION) => {
    const chord = this.sequence[row] ?? [];
    this.sequence[row] = chord;
    const index = chord.indexOf(column);

    if (index === -1) {
      chord.push(column);
    } else {
      chord.splice(index, 1);
    }

    return { ...this.sequence };
  };
}

export { Sequencer };
