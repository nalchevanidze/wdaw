import { EngineEvents } from '../common/events';
import { ValueController } from '../state/state';
import { Tempo } from './tempo';
import { Tracks } from './tracks';
import { DynamicValue } from './utils/dynamic-value';

export class MidiPlayer {
  private isPlaying = false;
  private time = 0;
  private tempo = new Tempo(this.sampleRate);
  private bpm?: DynamicValue;

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

  private bpmChanged(value: number) {
    this.tempo.setBPM(value);
    this.events.dispatch('bpmChanged', value);
  }

  public setBPM = (input: ValueController) => {
    if (input.type === 'fixed') {
      this.bpm = undefined;
      this.bpmChanged(input.value);
      return;
    }

    this.bpm = new DynamicValue(input.value);
    this.bpmChanged(this.bpm.get(this.time));
  };

  private nextActions() {
    const { time, isPlaying } = this;

    if (!isPlaying) {
      return this.tracks.nextKeyboardActions();
    }

    if (this.bpm) {
      this.bpmChanged(this.bpm.get(time));
    }

    this.tracks.nextMidiActions(time);

    const nextTime = time + this.tempo.size;
    this.setTime(this.tracks.isDone(nextTime) ? 0 : nextTime);
  }

  public next = () => {
    if (this.tempo.next()) {
      this.nextActions();
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
