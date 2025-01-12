import { audioProcessor, SoundIterator } from './oscillator/audio-processor';
import { MidiPlayer, toActions } from './midi/midi-player';
import { Sound } from './oscillator/sound';
import { DAWState } from './state';
import { MidiStep, NoteAction } from './midi/types';
import { EngineAction } from './types';
import { getDAWState } from './state/state';
import { Sequencer } from './midi/sequencer';
import { Midi } from '../core/types';

export { EngineAction } from './types';
export { DAWState, initialState } from './state';
export { presetNames } from './state/presets';
export { waveFunction } from './oscillator/osc/wave';

export type Callback = (c: { time: number; notes: number[] }) => void;

export class SynthEngine implements SoundIterator {
  private sound = new Sound();
  private sequencer = new Sequencer();
  private player = new MidiPlayer(this.sequencer);
  private actions: NoteAction[];

  public onChange: Callback;
  private state: DAWState;
  private closeContext: () => void;

  constructor(state: DAWState) {
    this.state = state;
    this.actions = toActions(state.midi);
    this.closeContext = audioProcessor(this);
  }

  public destroy() {
    this.player.setTime(0);
    this.sound.clear();
    this.player.clear();
    this.closeContext();
  }

  private exec = ({ start, end, current, notes }: MidiStep) => {
    const open = (n: number) => this.sound.open(this.state, n);
    const close = (n: number) => this.sound.close(this.state, n);

    start?.forEach(open);
    end?.forEach(close);

    if (current !== undefined) {
      requestAnimationFrame(() =>
        this.onChange({ time: current, notes: Array.from(notes) })
      );
    }
  };

  public next() {
    this.exec(this.player.next(this.actions, this.state.sequence));
    return this.sound.next(this.state);
  }

  public dispatch = (action: EngineAction): Partial<DAWState> | undefined => {
    switch (action.type) {
      case 'PLAYER': {
        const isPlaying = action.payload === 'play';
        this.player.isPlaying = isPlaying;
        if (!isPlaying) {
          this.sound.clear();
          this.player.clear();
        }
        if (action.payload === 'stop') {
          this.player.setTime(0);
          return { isPlaying, time: 0, notes: [] };
        }
        return { isPlaying };
      }
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
        this.state = getDAWState(action.payload);
        return { ...this.state };
      }
      case 'REFRESH':
        return { ...action.payload };
    }
  };
}
