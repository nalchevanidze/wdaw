import { Midi, MidiStep, NoteAction, NOTE_ACTION } from './types';
import { keysToIndexes } from '../../utils/notes';
import { Sequencer } from './sequencer';
import { Tempo } from './tempo';
import { SAMPLE_RATE } from '../oscillator/utils';
import { DAWState } from '../state';
import { Note } from '../../core/types';

const taskAt = (midi: NoteAction[], i: number, key: NOTE_ACTION): number[] => {
  const step = (midi[i] = midi[i] ?? {});

  switch (key) {
    case NOTE_ACTION.START: {
      const start = step.start ?? [];
      step.start = start;
      return start;
    }
    case NOTE_ACTION.END: {
      const end = step.end ?? [];
      step.end = end;
      return end;
    }
  }
};

export const foldMidi =
  <T>(f: (n: Note, i: number) => T) =>
  (midi: Midi): T[] =>
    Object.entries(midi.notes).reduce<T[]>(
      (acc, [i, val]) =>
        Array.isArray(val)
          ? acc.concat(val.map((note: Note): T => f(note, parseInt(i, 10))))
          : acc,
      []
    );

const toActions = (input: Midi): NoteAction[] => {
  const output: NoteAction[] = Array(input.size).fill(undefined);

  Object.entries(input.notes).forEach(([i, quarter]) => {
    quarter.forEach((note) => {
      const start = parseInt(i, 10) * 8 + note.at;
      const end = start + note.length - 1;
      const key = keysToIndexes(note.id);

      taskAt(output, start, NOTE_ACTION.START).push(key);
      taskAt(output, end, NOTE_ACTION.END).push(key);
    });
  });

  return output;
};

class MidiPlayer {
  private current = 0;
  private actions: NoteAction[];
  private tempo = new Tempo(SAMPLE_RATE);
  private notes: Set<number> = new Set([]);

  public isPlaying = false;
  public sequencer: Sequencer = new Sequencer();

  constructor(state: DAWState) {
    this.setup(state);
  }

  public next = (): MidiStep => {
    const notes = this.notes;
    if (!this.tempo.next()) {
      return { notes };
    }

    const keyNotes = this.isPlaying ? this.actions[this.current] : undefined;

    keyNotes?.start?.forEach((n) => this.note(true, n));
    keyNotes?.end?.forEach((n) => this.note(false, n));

    if (this.isPlaying) {
      this.current = (this.current + 1) % this.actions.length;
    }

    const keyboard = this.sequencer.next(notes) ?? keyNotes;

    return {
      start: keyboard?.start,
      end: keyboard?.end,
      notes,
      current: this.isPlaying ? this.current : undefined
    };
  };

  public setMidi = (midi: Midi) => {
    this.actions = toActions(midi);
  };

  public setup = (state: DAWState): void => {
    this.setMidi(state.midi);
    this.sequencer.setSequence(state.sequence);
  };

  public setTime = (time: number) => {
    this.current = time;
  };

  public play = (): void => {
    this.isPlaying = true;
  };

  public clear = () => {
    this.notes.clear();
  };

  private note = (start: boolean, note: number) => {
    const { notes } = this;

    if (start) {
      if (!notes.has(note)) {
        this.sequencer.restart();
      }
      notes.add(note);
    } else {
      this.notes.delete(note);
    }
  };

  public startNote = (note: number): MidiStep => {
    const { notes, current } = this;
    this.note(true, note);

    const start = this.sequencer.enabled ? undefined : [note];
    return { notes, current, start };
  };

  public endNote = (note: number): MidiStep => {
    const { notes, current } = this;

    this.note(false, note);

    const end = this.sequencer.enabled ? undefined : [note];
    return { notes, current, end };
  };
}

export { MidiPlayer };
