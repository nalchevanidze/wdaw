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
      return this.bpmChanged(input.value);
    }
    this.bpm = new DynamicValue(input.value);
  };

  public nextPBM = () => {
    if (!this.bpm || !this.isPlaying) return;

    this.bpmChanged(this.bpm.get(this.time));
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
