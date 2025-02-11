import { Preset, NoteAction } from '../common/types';
import { Arpeggiator } from './arp/arpeggiator';
import { Sound } from './oscillator/sound';

const toSequence = (preset: Preset, note: number) =>
  preset.sequence.enabled ? undefined : [note];

export class Synth {
  private sound = new Sound(this.sampleRate);
  private arp = new Arpeggiator();

  constructor(
    private sampleRate: number,
    private refreshNotes: (ns: number[]) => void
  ) {}

  public startNote(preset: Preset, note: number) {
    this.arp.startNote(note);
    this.sound.setNotes(preset, toSequence(preset, note));
    this.refreshNotes(this.getNotes());
  }

  public endNote(preset: Preset, note: number) {
    this.arp.endNote(note);
    this.sound.setNotes(preset, undefined, toSequence(preset, note));
    this.refreshNotes(this.getNotes());
  }

  public destroy() {
    this.sound.clear();
  }

  public clear() {
    this.sound.clear();
    this.arp.clear();
  }

  public getNotes = () => this.arp.getNotes();

  public nextActions(preset: Preset, action?: NoteAction) {
    action?.start?.forEach((n) => this.arp.startNote(n));
    action?.end?.forEach((n) => this.arp.endNote(n));
    const arpActions = this.arp.next(preset.sequence) ?? action;
    this.sound.setNotes(preset, arpActions?.start, arpActions?.end);
    if (action) {
      this.refreshNotes(this.getNotes());
    }
  }

  public next = this.sound.next;
}
