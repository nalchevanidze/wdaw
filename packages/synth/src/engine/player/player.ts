import { Tempo } from './tempo';
import { SAMPLE_RATE } from '../common/defs';
import { Tracks } from './tracks';

export type MidiState = {
  isPlaying: boolean;
  time: number;
  notes: number[];
};

export type MidiCallback = (s: MidiState) => void;

class MidiPlayer {
  private current = 0;
  private tempo = new Tempo(SAMPLE_RATE);
  private isPlaying = false;

  onChange: MidiCallback;

  constructor(private track: Tracks) {}

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
    if (this.tempo.next()) {
      this.track.nextActions(this.isPlaying, this.current);

      if (this.isPlaying) {
        this.refresh();
      }

      if (this.isPlaying) {
        this.current = this.current + 1;
      }

      if (this.track.isDone(this.current)) {
        this.current = 0;
      }
    }

    return this.track.next();
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
    this.refresh();
  };

  public pause = (): void => {
    this.isPlaying = false;
    this.track.clear();
    this.refresh();
  };

  stop() {
    this.pause();
    const time = 0;
    this.current = time;
    this.onChange({
      isPlaying: false,
      time,
      notes: []
    });
  }
}

export { MidiPlayer };
