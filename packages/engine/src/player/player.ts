import { Tempo } from './tempo';
import { Tracks } from './tracks';

export type EventTypes = {
  isPlayingChanged: boolean;
  timeChanged: number;
};

export type EventHandler<T extends EventName> = (e: EventTypes[T]) => void;
export type EventName = keyof EventTypes;

const mkEvent = <T extends EventName>(name: T, value: EventTypes[T]) =>
  new CustomEvent(name, { detail: value });

export const mapHandler =
  <N extends EventName>(name: N, f: EventHandler<N>) =>
  (e: Event): void => {
    if (!(e instanceof CustomEvent)) return undefined;

    const { detail } = e;

    switch (name) {
      case 'isPlayingChanged':
        if (typeof detail !== 'boolean') {
          return;
        }
        return f(detail as EventTypes[N]);
      case 'timeChanged':
        if (typeof detail !== 'number') {
          return;
        }
        return f(detail as EventTypes[N]);
    }
  };

export class MidiPlayer {
  private _current = 0;
  private tempo = new Tempo(this.sampleRate);
  private _isPlaying = false;
  public target = new EventTarget();

  constructor(
    private tracks: Tracks,
    private sampleRate: number
  ) {}

  set isPlaying(isPlaying: boolean) {
    this._isPlaying = isPlaying;
    this.target.dispatchEvent(mkEvent('isPlayingChanged', isPlaying));
  }

  get isPlaying() {
    return this._isPlaying;
  }

  set current(current: number) {
    this._current = current;
    this.target.dispatchEvent(mkEvent('timeChanged', current));
  }

  get current() {
    return this._current;
  }

  public setBPM = this.tempo.setBPM;

  public next = () => {
    if (this.tempo.next()) {
      this.tracks.nextActions(this.isPlaying, this.current);

      if (this.isPlaying) {
        this.current = this.current + this.tempo.size;
      }

      if (this.tracks.isDone(this.current)) {
        this.current = 0;
      }
    }

    return this.tracks.next();
  };

  public setTime = (time: number) => {
    this.current = time;
  };

  public play = (): void => {
    this.isPlaying = true;
  };

  public pause = (): void => {
    this.isPlaying = false;
    this.tracks.clear();
  };

  stop() {
    this.current = 0;
    this.pause();
  }
}
