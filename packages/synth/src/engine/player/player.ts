import { NOTE_ACTION } from './types';
import { keysToIndexes } from '../../utils/notes';
import { Tempo } from './tempo';
import { SAMPLE_RATE } from '../synth/oscillator/utils';
import { Midi, NoteAction } from '../../core/types';
import { Synth } from '../synth/synth';

export type MidiState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type MidiCallback = (s: MidiState) => void;

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

export const toActions = (input: Midi): NoteAction[] => {
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
  private tempo = new Tempo(SAMPLE_RATE);
  onChange: MidiCallback;

  constructor(private synth: Synth) {}

  public isPlaying = false;

  public refresh() {
    requestAnimationFrame(() =>
      this.onChange({
        isPlaying: this.isPlaying,
        time: this.current,
        notes: this.synth.getNotes()
      })
    );
  }

  public next = (actions: NoteAction[]) => {
    if (!this.tempo.next()) {
      return undefined;
    }

    const result = this.isPlaying ? actions[this.current] : undefined;

    if (this.isPlaying) {
      this.current = (this.current + 1) % actions.length;
    }

    return result ?? {};
  };

  public setTime = (time: number) => {
    this.current = time;
    this.onChange({
      isPlaying: this.isPlaying,
      time,
      notes: this.synth.getNotes()
    });
  };

  public play = (): void => {
    this.isPlaying = true;
  };

  public pause = (): void => {
    this.isPlaying = false;
    this.synth.clear();
  };

  stop() {
    this.pause()
    const time = 0;
    this.current = time;
    this.onChange({
      isPlaying: false,
      time: time,
      notes: []
    });
  }
}

export { MidiPlayer };
