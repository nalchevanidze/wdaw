import { Sequencer } from './midi/sequencer';
import { NoteAction, Sequence } from './midi/types';
import { Sound } from './oscillator/sound';
import { Preset } from './oscillator/types';

const toSequence = (preset: Preset, note: number) =>
  preset.sequence.enabled ? undefined : [note];

export class Synth {
  private sound = new Sound();
  private sequencer = new Sequencer();

  public startNote(preset: Preset, note: number) {
    this.sequencer.startNote(note);
    this.sound.setNotes(preset, toSequence(preset, note));
  }

  public endNote(preset: Preset, note: number) {
    this.sequencer.endNote(note);
    this.sound.setNotes(preset, undefined, toSequence(preset, note));
  }

  public destroy() {
    this.sound.clear();
  }

  public clear() {
    this.sound.clear();
    this.sequencer.clear();
  }

  public getNotes = () => this.sequencer.getNotes();

  public next(preset: Preset, action?: NoteAction): number {
    if (!action) {
      return this.sound.next(preset);
    }

    action.start?.forEach((n) => this.sequencer.startNote(n));
    action.end?.forEach((n) => this.sequencer.endNote(n));

    const arpActions = this.sequencer.next(preset.sequence) ?? action;

    this.sound.setNotes(preset, arpActions?.start, arpActions?.end);

    return this.sound.next(preset);
  }
}
