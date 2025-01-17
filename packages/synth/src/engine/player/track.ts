import { Midi, NoteAction } from '../types';
import { toActions } from './utils/actions';

type ISynth = {
  getNotes(): number[];
  clear(): void;
};

class Track {
  private actions: NoteAction[] = [];

  constructor(private synth: ISynth) {}

  public next = (current: number) => this.actions[current];

  public notes = () => this.synth.getNotes();

  public clear = () => this.synth.clear();

  public done = (current: number) => current > this.actions.length;

  public setMidi = (midi: Midi): void => {
    this.actions = toActions(midi);
  };
}

export { Track };
