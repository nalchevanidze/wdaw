import { Preset } from '../common/types';
import { Synth } from '../synth';
import { Midi, NoteAction } from '../types';
import { NOTE_SIZE, toActions } from './utils/actions';

class Track {
  private actions: NoteAction[] = [];
  private preset: Preset;
  private gain: number = 1;
  private midi: Midi;

  public startNote = (n: number) => this.synth.startNote(this.preset, n);

  public endNote = (n: number) => this.synth.endNote(this.preset, n);

  constructor(private synth: Synth) {}

  public nextActions = (isPlaying: boolean, current: number) => {
    if (
      isPlaying &&
      (current < this.midi.start * NOTE_SIZE ||
        current > this.midi.end * NOTE_SIZE)
    ) {
      return;
    }

    const localCurrent = current % this.actions.length;

    this.synth.nextActions(
      this.preset,
      isPlaying ? this.actions[localCurrent] : undefined
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
    this.actions = toActions(midi);
  };

  public setPreset = (preset: Preset) => {
    this.preset = preset;
  };
}

export { Track };
