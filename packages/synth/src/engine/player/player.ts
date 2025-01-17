import { Tempo } from './tempo';
import { NoteAction } from '../types';
import { SAMPLE_RATE } from '../common/defs';

export type MidiState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type MidiCallback = (s: MidiState) => void;

type ISynth = {
  getNotes(): number[];
  clear(): void;
};

class MidiPlayer {
  private current = 0;
  private tempo = new Tempo(SAMPLE_RATE);
  onChange: MidiCallback;

  constructor(private synth: ISynth) {}

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
    this.pause();
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
