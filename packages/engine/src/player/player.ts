import { Tempo } from './tempo';
import { Tracks } from './tracks';

export type MidiState = PlayerState | NotesState;

type PlayerState = {
  isPlaying: boolean;
  time: number;
};

type NotesState = {
  id: number;
  notes: number[];
};

export type MidiCallback = (s: MidiState) => void;

class MidiPlayer {
  private current = 0;
  private tempo = new Tempo(this.sampleRate);
  private isPlaying = false;

  onChange: MidiCallback = () => {
    console.warn('default onChange handler call');
  };

  constructor(
    private track: Tracks,
    private sampleRate: number
  ) {}

  public refresh() {
    requestAnimationFrame(() =>
      this.onChange({
        isPlaying: this.isPlaying,
        time: this.current,
        notes: this.track.notes()
      })
    );
  }

  public setBPM = this.tempo.setBPM;

  public next = () => {
    if (this.tempo.next()) {
      this.track.nextActions(this.isPlaying, this.current);

      if (this.isPlaying) {
        this.current = this.current + this.tempo.size;
        this.refresh();
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
