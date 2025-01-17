import { Sequencer } from './midi/sequencer';
import { NoteAction, Sequence } from './midi/types';
import { Sound } from './oscillator/sound';
import { Preset } from './oscillator/types';

export class Synth {
  private sound = new Sound();
  private sequencer = new Sequencer();

  private toSequence(preset: Preset, note: number) {
    return preset.sequence.enabled ? undefined : [note];
  }

  public startNote(preset: Preset, note: number) {
    this.sequencer.startNote(note);
    this.setNotes(preset, this.toSequence(preset, note));
  }

  public endNote(preset: Preset, note: number) {
    this.sequencer.endNote(note);
    this.setNotes(preset, undefined, this.toSequence(preset, note));
  }

  public destroy() {
    this.sound.clear();
  }

  public clear() {
    this.sound.clear();
    this.sequencer.clear();
  }

  public getNotes = () => this.sequencer.getNotes();

  public setNotes = (preset: Preset, start?: number[], end?: number[]) => {
    this.sound.setNotes(preset, start, end);
  };


  public nextSequence(seq: Sequence, action: NoteAction){
    action?.start?.forEach((n) => this.sequencer.startNote(n));
    action?.end?.forEach((n) => this.sequencer.endNote(n));   
    return this.sequencer.next(seq) ?? action;
  }

  public next(preset: Preset, action?: NoteAction) {
    this.sound.setNotes(preset, action?.start, action?.end);
    return this.sound.next(preset);
  }
}
