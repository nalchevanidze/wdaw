import { DAWState } from './state';
import { EngineAction } from './types';
import { SynthCoreEngine } from './engine';
export { EngineAction } from './types';
export { DAWState, initialState } from './state';
export { presetNames } from './state/presets';
export { waveFunction } from './oscillator/osc/wave';

export type Callback = (c: { time: number; notes: number[] }) => void;

export class SynthEngine extends SynthCoreEngine {
  public dispatch = (action: EngineAction): void => {
    switch (action.type) {
      case 'PLAYER':
        return this.setPlay(action.payload);
      case 'KEY_UP':
        this.endNote(action.payload);
        break;
      case 'KEY_DOWN':
        this.startNote(action.payload);
        break;
      case 'SET_TIME':
        return this.setTime(action.payload);
      case 'SET_MIDI':
        return this.setMidi(action.payload);
    }
  };
}
