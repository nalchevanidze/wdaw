import { EngineEvents } from '../common/events';
import { Tempo } from './tempo';
import { Tracks } from './tracks';
import { DynamicValue, DynamicValueInput } from './utils/dynamic-value';

export class MidiPlayer {
  private isPlaying = false;
  private time = 0;
  private tempo = new Tempo(this.sampleRate);
  private bpm = new DynamicValue((v) => {
    this.tempo.setBPM(v);
    this.events.dispatch('changed/bpm', v);
  });

  constructor(
    private events: EngineEvents,
    private tracks: Tracks,
    private sampleRate: number
  ) {}

  private setIsPlaying(isPlaying: boolean) {
    this.isPlaying = isPlaying;
    this.events.dispatch('changed/isPlaying', isPlaying);
  }

  public setTime = (time: number) => {
    this.time = time;
    this.events.dispatch('changed/time', time);
  };

  public setBPM = (value: DynamicValueInput) =>
    this.bpm.set(value).next(this.time);

  private nextActions() {
    const step = this.tempo.next();
    if (step <= 0) return;

    const { time, isPlaying } = this;

    if (!isPlaying) {
      return this.tracks.nextKeyboardActions();
    }

    this.bpm.next(time);
    this.tracks.nextMidiActions(time);

    const nextTime = time + step;
    this.setTime(this.tracks.isDone(nextTime) ? 0 : nextTime);
  }

  public next = () => {
    this.nextActions();
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
