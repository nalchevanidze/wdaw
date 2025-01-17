import { Tempo } from './tempo';
import { NoteAction } from '../types';
import { SAMPLE_RATE } from '../common/defs';
import { Track } from './track';

export type MidiState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type MidiCallback = (s: MidiState) => void;

class MidiPlayer {
  private current = 0;
  private tempo = new Tempo(SAMPLE_RATE);
  onChange: MidiCallback;

  constructor(private track: Track) {}

  public isPlaying = false;

  public refresh() {
    requestAnimationFrame(() =>
      this.onChange({
        isPlaying: this.isPlaying,
        time: this.current,
        notes: this.track.notes()
      })
    );
  }

  public next = () => {
    if (!this.tempo.next()) {
      return undefined;
    }

    const result = this.isPlaying ? this.track.next(this.current) : undefined;

    if (this.isPlaying) {
      this.current = this.current + 1;
    }

    if (this.track.done(this.current)) {
      this.current = 0;
    }

    return result ?? {};
  };

  public setTime = (time: number) => {
    this.current = time;
    this.onChange({
      isPlaying: this.isPlaying,
      time,
      notes: this.track.notes()
    });
  };

  public play = (): void => {
    this.isPlaying = true;
  };

  public pause = (): void => {
    this.isPlaying = false;
    this.track.clear();
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
