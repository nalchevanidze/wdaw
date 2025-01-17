import { audioProcessor, SoundIterator } from './oscillator/audio-processor';
import { MidiCallback, MidiPlayer, toActions } from './midi/midi-player';
import { Sound } from './oscillator/sound';
import { MidiStep, NoteAction } from './midi/types';
import { Sequencer } from './midi/sequencer';
import { Preset } from './oscillator/types';
import { Midi, PLAYER_ACTION } from '../core/types';
import { Synth } from './synth';

class CoreEngine {
  private synth = new Synth();
  private player = new MidiPlayer(this.synth);

  setMidiCallback(f: MidiCallback) {
    this.player.onChange = f;
  }

  public setPlay(mode: PLAYER_ACTION) {
    const isPlaying = mode === 'play';
    this.player.isPlaying = isPlaying;

    if (!isPlaying) {
      this.synth.clear();
    }

    if (mode === 'stop') {
      this.player.stop();
    }
  }

  public startNote(preset: Preset, n: number) {
    this.synth.startNote(preset, n);
    this.player.refresh();
  }

  public endNote(preset: Preset, n: number) {
    this.synth.endNote(preset, n);
    this.player.refresh();
  }

  public destroy() {
    this.player.setTime(0);
    this.synth.clear();
  }

  public setTime = (t: number) => this.player.setTime(t);

  public next(preset: Preset, actions: NoteAction[]) {
    const action = this.player.next(actions);
    this.player.refresh();
    return this.synth.next(preset, action);
  }
}

export class SynthEngine implements SoundIterator {
  private engine = new CoreEngine();
  private actions: NoteAction[];
  private closeContext: () => void;
  private preset: Preset;

  constructor() {
    this.closeContext = audioProcessor(this);
  }

  public setPlay = (mode: PLAYER_ACTION) => this.engine.setPlay(mode);

  public endNote = (n: number) => this.engine.endNote(this.preset, n);

  public startNote = (n: number) => this.engine.startNote(this.preset, n);

  public setMidi = (midi: Midi): void => {
    this.actions = toActions(midi);
  };

  public setMidiCallback = (f: MidiCallback) => this.engine.setMidiCallback(f);

  public setPreset(preset: Preset) {
    this.preset = preset;
  }

  public setTime = (t: number) => this.engine.setTime(t);

  public next = () => this.engine.next(this.preset, this.actions);

  public destroy() {
    this.engine.destroy();
    this.closeContext();
  }
}
