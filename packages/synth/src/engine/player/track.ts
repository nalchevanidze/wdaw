import { Preset } from '../common/types';
import { Synth } from '../synth';
import { Midi, NoteAction } from '../types';
import { toActions } from './utils/actions';

class Track {
  private actions: NoteAction[] = [];
  private preset: Preset;

  public startNote = (n: number) => this.synth.startNote(this.preset, n);

  public endNote = (n: number) => this.synth.endNote(this.preset, n);

  constructor(private synth: Synth) {}

  public next = (isPlaying: boolean, current: number) =>
    this.synth.next(this.preset, (isPlaying ? this.actions[current] : {}) ?? {});

  public background = () => this.synth.next(this.preset);

  public notes = () => this.synth.getNotes();

  public clear = () => this.synth.clear();

  public isDone = (current: number) => current >= this.actions.length;

  public setMidi = (midi: Midi): void => {
    this.actions = toActions(midi);
  };

  public setPreset = (preset: Preset) => {
    this.preset = preset;
  }
}

export { Track };
