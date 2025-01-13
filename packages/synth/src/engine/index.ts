import { toActions } from './midi/midi-player';
import { DAWState } from './state';
import { EngineAction } from './types';
import { getPreset } from './state/state';
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
    const { preset } = this;

    switch (action.type) {
      case 'PLAYER':
        return this.play(action.payload);
      case 'KEY_UP':
        this.exec(preset, this.player.endNote(preset.sequence, action.payload));
        break;
      case 'KEY_DOWN':
        this.exec(
          preset,
          this.player.startNote(preset.sequence, action.payload)
        );
        break;
      case 'SET_TIME':
        return { time: this.player.setTime(action.payload) };
      case 'TOGGLE_APR_NOTE':
        return {
          sequence: this.sequencer.toggleARPNote(
            preset.sequence,
            action.payload
          )
        };
      case 'TOGGLE_PANEL': {
        if (action.id === 'wave') {
          return;
        }
        this.preset[action.id].enabled = !this.preset[action.id].enabled;
        return { [action.id]: { ...this.preset[action.id] } };
      }
      case 'SET_MIDI': {
        this.actions = toActions(action.payload);
        return { midi: action.payload };
      }
      case 'SET_ENVELOPE': {
        Object.assign(this.preset.envelopes[action.id], action.payload);
        return { envelopes: { ...this.preset.envelopes } };
      }
      case 'SET_WAVE': {
        this.preset.wave[action.id] = action.payload;
        return { wave: { ...this.preset.wave } };
      }
      case 'SET_FILTER':
        this.preset.filter[action.id] = action.payload;
        return { filter: { ...this.preset.filter } };
      case 'SET_PRESET': {
        this.preset = Object.assign(this.preset, getPreset(action.payload));
        return { ...this.preset };
      }
      case 'REFRESH':
        return { ...action.payload };
    }
  };
}
