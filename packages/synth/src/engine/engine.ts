import { audioProcessor, SoundIterator } from './oscillator/audio-processor';
import { MidiCallback, MidiPlayer, toActions } from './midi/midi-player';
import { Preset } from './oscillator/types';
import { Midi, PLAYER_ACTION } from '../core/types';
import { Synth } from './synth';
import { NoteAction } from './midi/types';

export class SynthEngine implements SoundIterator {
  private synth = new Synth();
  private player = new MidiPlayer(this.synth);

  private actions: NoteAction[];
  private preset: Preset;
  private closeContext: () => void;

  constructor() {
    this.closeContext = audioProcessor(this);
  }

  public setMidiCallback(f: MidiCallback) {
    this.player.onChange = f;
  }

  public setPreset(preset: Preset) {
    this.preset = preset;
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

  public startNote(n: number) {
    this.synth.startNote(this.preset, n);
    this.player.refresh();
  }

  public endNote(n: number) {
    this.synth.endNote(this.preset, n);
    this.player.refresh();
  }

  public destroy() {
    this.player.setTime(0);
    this.synth.clear();
    this.closeContext();
  }

  public setTime = (t: number) => this.player.setTime(t);

  public next() {
    this.player.refresh();
    return this.synth.next(this.preset, this.player.next(this.actions));
  }

  public setMidi = (midi: Midi): void => {
    this.actions = toActions(midi);
  };
}
