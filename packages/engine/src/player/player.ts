import { EngineEvents } from '../common/events';
import { ControlPoint, ValueController } from '../state/state';
import { Tempo } from './tempo';
import { Tracks } from './tracks';

export class MidiPlayer {
  private isPlaying = false;
  private time = 0;
  private tempo = new Tempo(this.sampleRate);
  private pbmPoints?: number[];

  constructor(
    private events: EngineEvents,
    private tracks: Tracks,
    private sampleRate: number
  ) {}

  private setIsPlaying(isPlaying: boolean) {
    this.isPlaying = isPlaying;
    this.events.dispatch('isPlayingChanged', isPlaying);
  }

  public setTime = (time: number) => {
    this.time = time;
    this.events.dispatch('timeChanged', time);
  };

  public setBPM = (bpm: ValueController) => {
    if (bpm.type === 'fixed') {
      this.tempo.setBPM(bpm.value);
      this.events.dispatch('bpmChanged', bpm.value);
      return;
    }

    const pbmPoints = Array(this.tracks.size).fill(0);

    bpm.value
      .sort((a, b) => a.index - b.index)
      .reduce(
        (a, b) => {
          const step = (b.value - a.value) / (b.index - a.index);
          let value = a.value;

          for (let i = a.index; i < b.index; i++) {
            value += step;
            pbmPoints[i] = value;
          }

          return b;
        },
        { index: 0, value: 100 }
      );

    this.pbmPoints = pbmPoints;
  };

  public nextPBM = () => {
    if (!this.pbmPoints || !this.isPlaying) return;

    const value = this.pbmPoints[Math.floor(this.time)];

    this.tempo.setBPM(value);
    this.events.dispatch('bpmChanged', value);
  };

  public next = () => {
    if (this.tempo.next()) {
      this.nextPBM();
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

  public stop = () => {
    this.setTime(0);
    this.pause();
  };
}
