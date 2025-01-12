import { SoundEvent } from './sound-event';
import { SynthConfig } from './types';
import { nList, safeWaveValue } from './utils';

type NotesRegister = {
  [key: number]: SoundEvent;
};

export class Sound {
  private notes: NotesRegister;
  private stack: SoundEvent[];

  constructor() {
    this.stack = nList(6, () => new SoundEvent());
    this.notes = {}
  }

  private osc = (isActive: boolean) =>
    this.stack.filter((osc) => isActive === osc.isLive());

  public clear = () => {
    this.stack.forEach((osc) => osc.kill());
    this.notes = {};
  };

  public next(state: SynthConfig) {
    const value = this.osc(true).reduce((v, osc) => v + osc.next(state), 0);

    return safeWaveValue(value);
  }

  newEvent() {
    const event = new SoundEvent();
    this.stack.push(event);
    return event;
  }

  open(state: SynthConfig, note: number) {
    if (this.notes[note]) {
      return;
    }

    const sound = this.osc(false)[0] ?? this.newEvent();
    this.notes[note] = sound;
    sound.open(state, note);
  }

  close(state: SynthConfig, note: number) {
    if (this.notes[note]) {
      this.notes[note].close(state);
      delete this.notes[note];
    }
  }
  
}

const x = async ()=>{
  const response = await fetch("url");
  const reader = response.body.getReader();
  
  while (true) {
    const {value, done} = await reader.read();
    if (done) break;
    
    // process each chunk
  }
}
