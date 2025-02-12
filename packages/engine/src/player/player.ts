import { mkEvent } from '../common/events';
import { Tempo } from './tempo';
import { Tracks } from './tracks';

export class MidiPlayer {
  private isPlaying = false;
  private time = 0;
  private tempo = new Tempo(this.sampleRate);
  public target = new EventTarget();

  constructor(
    private tracks: Tracks,
    private sampleRate: number
  ) {}

  private setIsPlaying(isPlaying: boolean) {
    this.isPlaying = isPlaying;
    this.target.dispatchEvent(mkEvent('isPlayingChanged', isPlaying));
  }

  public setTime = (time: number) => {
    this.time = time;
    this.target.dispatchEvent(mkEvent('timeChanged', time));
  };

  public setBPM = this.tempo.setBPM;

  public next = () => {
    if (this.tempo.next()) {
      this.tracks.nextActions(this.isPlaying, this.time);

      if (this.isPlaying) {
        this.setTime(this.time + this.tempo.size);
      }

      if (this.tracks.isDone(this.time)) {
        this.setTime(0);
      }
    }

    return this.tracks.next();
  };

  public play = (): void => {
    this.setIsPlaying(true);
  };

  public pause = (): void => {
    this.setIsPlaying(false);
    this.tracks.clear();
  };

  public stop() {
    this.setTime(0);
    this.pause();
  }
}
