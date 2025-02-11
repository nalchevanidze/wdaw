import { MidiCallback } from '../common/types';
import { Tempo } from './tempo';
import { Tracks } from './tracks';

export class MidiPlayer {
  private current = 0;
  private tempo = new Tempo(this.sampleRate);
  private isPlaying = false;

  onChange: MidiCallback = () => {
    console.warn('default onChange handler call');
  };

  constructor(
    private tracks: Tracks,
    private sampleRate: number
  ) {}

  public refresh() {
    this.onChange({ isPlaying: this.isPlaying, time: this.current });
  }

  public setBPM = this.tempo.setBPM;

  public next = () => {
    if (this.tempo.next()) {
      this.tracks.nextActions(this.isPlaying, this.current);

      if (this.isPlaying) {
        this.current = this.current + this.tempo.size;
        this.refresh();
      }

      if (this.tracks.isDone(this.current)) {
        this.current = 0;
      }
    }

    return this.tracks.next();
  };

  public setTime = (time: number) => {
    this.current = time;
    this.refresh();
  };

  public play = (): void => {
    this.isPlaying = true;
    this.refresh();
  };

  public pause = (): void => {
    this.isPlaying = false;
    this.tracks.clear();
    this.refresh();
  };

  stop() {
    this.current = 0;
    this.pause();
  }
}
