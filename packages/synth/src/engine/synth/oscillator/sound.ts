import { SoundEvent } from './sound-event';
import { Preset } from './types';
import { nList, safeWaveValue } from './utils';

type NotesRegister = {
  [key: number]: SoundEvent;
};

export class Sound {
  private notes: NotesRegister;
  private stack: SoundEvent[];

  constructor() {
    this.stack = nList(6, () => new SoundEvent());
    this.notes = {};
  }

  private osc = (isActive: boolean) =>
    this.stack.filter((osc) => isActive === osc.isLive());

  public clear = () => {
    this.stack.forEach((osc) => osc.kill());
    this.notes = {};
  };

  public next(state: Preset) {
    const value = this.osc(true).reduce((v, osc) => v + osc.next(state), 0);

    return safeWaveValue(value);
  }

  public setNotes = (preset: Preset, start?: number[], end?: number[]) => {
    const open = (n: number) => this.open(preset, n);
    const close = (n: number) => this.close(preset, n);
    start?.forEach(open);
    end?.forEach(close);
  };

  newEvent() {
    const event = new SoundEvent();
    this.stack.push(event);
    return event;
  }

  private open(state: Preset, note: number) {
    if (this.notes[note]) {
      return;
    }

    const sound = this.osc(false)[0] ?? this.newEvent();
    this.notes[note] = sound;
    sound.open(state, note);
  }

  private close(state: Preset, note: number) {
    if (this.notes[note]) {
      this.notes[note].close(state);
      delete this.notes[note];
    }
  }
}
