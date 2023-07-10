import { SoundEvent } from './sound-event';
import { SynthConfig } from './types';
import { nList, safeWaveValue } from './utils';

type NotesRegister = {
  [key: number]: SoundEvent;
};

export class Sound {
  private notes: NotesRegister;
  private config: SynthConfig;
  private stack: SoundEvent[];

  constructor(config: SynthConfig) {
    this.notes = {};
    this.config = config;
    this.stack = nList(6, () => new SoundEvent(config));
  }

  private osc = (isActive: boolean) =>
    this.stack.filter((osc) => isActive === osc.isLive());

  public clear = () => {
    this.stack.forEach((osc) => osc.kill());
    this.notes = {};
  };

  public setup(state: SynthConfig) {
    this.config = state;
    this.stack.forEach((x) => x.setup(state));
  }

  public next() {
    const value = this.osc(true).reduce((v, osc) => v + osc.next(), 0);

    return safeWaveValue(value);
  }

  newEvent() {
    const event = new SoundEvent(this.config);
    this.stack.push(event);
    return event;
  }

  open = (note: number): void => {
    if (this.notes[note]) {
      return;
    }

    const sound = this.osc(false)[0] ?? this.newEvent();

    this.notes[note] = sound;
    sound.open(note);
  };

  close = (note: number): void => {
    if (this.notes[note]) {
      this.notes[note].close();
      delete this.notes[note];
    }
  };
}
