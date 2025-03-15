import { TypedEvents } from '../common/events';
import { Time } from '../common/time';
import { ChangeEvents } from '../common/types';
import { Tempo } from './tempo';
import { Tracks } from './tracks';
import { DynamicValue, Scalar } from './utils/dynamic-value';

export class MidiPlayer {
  private isPlaying = false;

  private tempo = new Tempo(this.sampleRate);
  private bpm = new DynamicValue((v) => {
    this.tempo.setBPM(v);
    this.events.dispatch('changed/bpm', v);
  });

  constructor(
    private events: TypedEvents<ChangeEvents>,
    private tracks: Tracks,
    private time: Time,
    private sampleRate: number
  ) {}

  private setIsPlaying(isPlaying: boolean) {
    this.isPlaying = isPlaying;
    this.events.dispatch('changed/isPlaying', isPlaying);
  }

  public setBPM = (value: Scalar.Input) =>
    this.bpm.set(value).next(this.time.get());

  private nextActions() {
    const step = this.tempo.next();
    if (step <= 0) return;

    const { isPlaying } = this;
    const time = this.time.get();

    if (!isPlaying) {
      return this.tracks.nextKeyboardActions();
    }

    this.bpm.next(time);
    this.tracks.nextMidiActions(time);

    const nextTime = time + step;
    this.time.set(this.tracks.isDone(nextTime) ? 0 : nextTime);
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
    this.time.set(0);
    this.pause();
  };
}
