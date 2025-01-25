import { Preset } from '../common/types';
import { Synth } from '../synth';
import { Midi, NoteAction } from '../types';
import { NOTE_SIZE, toActions } from './utils/actions';

class Track {
  private actions: NoteAction[] = [];
  private preset: Preset;
  private gain: number = 1;
  private midi: Midi;
  private loopSize: number;
  private offset: number;

  public startNote = (n: number) => this.synth.startNote(this.preset, n);

  public endNote = (n: number) => this.synth.endNote(this.preset, n);

  constructor(private synth: Synth) {}

  public nextActions = (isPlaying: boolean, current: number) => {
    const { start, end } = this.midi;

    if (
      isPlaying &&
      (current < start * NOTE_SIZE || current > end * NOTE_SIZE)
    ) {
      this.clear();
      return;
    }

    const loopCurrent = (current - this.offset) % this.loopSize;

    this.synth.nextActions(
      this.preset,
      isPlaying ? this.actions[loopCurrent] : undefined
    );
  };

  public setGain(n: number) {
    this.gain = n;
  }

  public next = () => this.synth.next(this.preset) * this.gain;

  public notes = () => this.synth.getNotes();

  public clear = () => this.synth.clear();

  public size = () => this.midi.end * 8;

  public setMidi = (midi: Midi): void => {
    this.midi = midi;
    const {
      start,
      loop: [s, e]
    } = this.midi;

    const size = e - s;

    this.offset = (start % size) * NOTE_SIZE;
    this.loopSize = size * NOTE_SIZE;

    this.actions = toActions(midi);
  };

  public setPreset = (preset: Preset) => {
    this.preset = preset;
  };
}

export { Track };
