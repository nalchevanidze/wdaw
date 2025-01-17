import { NoteAction } from '../../core/types';
import { Arpeggiator } from './arp/arpeggiator';
import { Sound } from './oscillator/sound';
import { Preset } from './oscillator/types';

const toSequence = (preset: Preset, note: number) =>
  preset.sequence.enabled ? undefined : [note];

export class Synth {
  private sound = new Sound();
  private arp = new Arpeggiator();

  public startNote(preset: Preset, note: number) {
    this.arp.startNote(note);
    this.sound.setNotes(preset, toSequence(preset, note));
  }

  public endNote(preset: Preset, note: number) {
    this.arp.endNote(note);
    this.sound.setNotes(preset, undefined, toSequence(preset, note));
  }

  public destroy() {
    this.sound.clear();
  }

  public clear() {
    this.sound.clear();
    this.arp.clear();
  }

  public getNotes = () => this.arp.getNotes();

  public next(preset: Preset, action?: NoteAction): number {
    if (!action) {
      return this.sound.next(preset);
    }

    action.start?.forEach((n) => this.arp.startNote(n));
    action.end?.forEach((n) => this.arp.endNote(n));

    const arpActions = this.arp.next(preset.sequence) ?? action;

    this.sound.setNotes(preset, arpActions?.start, arpActions?.end);

    return this.sound.next(preset);
  }
}
