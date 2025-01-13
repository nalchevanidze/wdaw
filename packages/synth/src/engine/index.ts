import { toActions } from './midi/midi-player';
import { DAWState } from './state';
import { EngineAction } from './types';
import { getPreset } from './state/state';
import { SynthCoreEngine } from './engine';
import { PLAYER_ACTION } from '../core/types';
import { toggleARPNote } from './midi/sequencer';

export { EngineAction } from './types';
export { DAWState, initialState } from './state';
export { presetNames } from './state/presets';
export { waveFunction } from './oscillator/osc/wave';

export type Callback = (c: { time: number; notes: number[] }) => void;

export class SynthEngine extends SynthCoreEngine {
  private play(action: PLAYER_ACTION): Partial<DAWState> {
    const isPlaying = action === 'play';
    this.player.isPlaying = isPlaying;
    this.purge();

    if (action === 'stop') {
      this.player.setTime(0);
      return { isPlaying, time: 0, notes: [] };
    }

    return { isPlaying };
  }

  public dispatch = (
    state: DAWState,
    action: EngineAction
  ): Partial<DAWState> | undefined => {
    const { envelopes, wave, filter, sequence } = state;
    switch (action.type) {
      case 'PLAYER':
        return this.play(action.payload);
      case 'KEY_UP':
        this.exec(state, this.player.endNote(sequence, action.payload));
        break;
      case 'KEY_DOWN':
        this.exec(state, this.player.startNote(sequence, action.payload));
        break;
      case 'SET_TIME':
        return { time: this.player.setTime(action.payload) };
      case 'TOGGLE_APR_NOTE':
        return { sequence: toggleARPNote(sequence, action.payload) };
      case 'TOGGLE_PANEL':
        return action.id === 'wave'
          ? undefined
          : {
              [action.id]: {
                ...state[action.id],
                enabled: !state[action.id].enabled
              }
            };
      case 'SET_MIDI': {
        this.actions = toActions(action.payload);
        return { midi: action.payload };
      }
      case 'SET_ENVELOPE':
        return { envelopes: { ...envelopes, [action.id]: action.payload } };
      case 'SET_WAVE':
        return { wave: { ...wave, [action.id]: action.payload } };
      case 'SET_FILTER':
        return { filter: { ...filter, [action.id]: action.payload } };
      case 'SET_PRESET':
        return getPreset(action.payload);
      case 'REFRESH':
        return { ...action.payload };
    }
  };
}
