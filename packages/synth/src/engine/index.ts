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
      case 'PLAYER': {
        this.setPlay(action.payload === 'play');
        if (action.payload === 'stop') {
          this.player.setTime(0);
        }
        return;
      }
      case 'KEY_UP':
        this.exec(
          this.preset,
          this.player.endNote(this.preset.sequence, action.payload)
        );
        break;
      case 'KEY_DOWN':
        this.exec(
          this.preset,
          this.player.startNote(this.preset.sequence, action.payload)
        );
        break;
      case 'SET_TIME':
        return this.player.setTime(action.payload);
      case 'SET_MIDI':
        return this.setMidi(action.payload);
    }
  };
}
