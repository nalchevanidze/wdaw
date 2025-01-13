import { toActions } from './midi/midi-player';
import { DAWState } from './state';
import { EngineAction } from './types';
import { getDAWState, getPreset } from './state/state';
import { SynthCoreEngine } from './engine';
import { PLAYER_ACTION } from '../core/types';

export { EngineAction } from './types';
export { DAWState, initialState } from './state';
export { presetNames } from './state/presets';
export { waveFunction } from './oscillator/osc/wave';

export type Callback = (c: { time: number; notes: number[] }) => void;

export class SynthEngine extends SynthCoreEngine {
  private play(action: PLAYER_ACTION): Partial<DAWState> {
    const isPlaying = action === 'play';
    this.player.isPlaying = isPlaying;
    if (!isPlaying) {
      this.sound.clear();
      this.player.clear();
    }
    if (action === 'stop') {
      this.player.setTime(0);
      return { isPlaying, time: 0, notes: [] };
    }
    return { isPlaying };
  }

  public dispatch = (action: EngineAction): Partial<DAWState> | undefined => {
    switch (action.type) {
      case 'PLAYER':
        return this.play(action.payload);
      case 'KEY_UP':
        this.exec(this.player.endNote(this.state.sequence, action.payload));
        break;
      case 'KEY_DOWN':
        this.exec(this.player.startNote(this.state.sequence, action.payload));
        break;
      case 'SET_TIME':
        this.player.setTime(action.payload);
        return { time: action.payload };
      case 'TOGGLE_APR_NOTE':
        return {
          sequence: this.sequencer.toggleARPNote(
            this.state.sequence,
            action.payload
          )
        };
      case 'TOGGLE_PANEL': {
        const target = action.id;
        if (target === 'wave') {
          return;
        }
        this.state[target].enabled = !this.state[target].enabled;
        return { [target]: { ...this.state[target] } };
      }
      case 'SET_MIDI': {
        this.actions = toActions(action.payload);
        return { midi: action.payload };
      }
      case 'SET_ENVELOPE': {
        Object.assign(this.state.envelopes[action.id], action.payload);
        return { envelopes: { ...this.state.envelopes } };
      }
      case 'SET_WAVE': {
        this.state.wave[action.id] = action.payload;
        return { wave: { ...this.state.wave } };
      }
      case 'SET_FILTER':
        this.state.filter[action.id] = action.payload;
        return { filter: { ...this.state.filter } };
      case 'SET_PRESET': {
        this.state = Object.assign(this.state, getPreset(action.payload));
        return { ...this.state };
      }
      case 'REFRESH':
        return { ...action.payload };
    }
  };
}
