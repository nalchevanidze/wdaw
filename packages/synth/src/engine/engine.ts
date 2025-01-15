import { audioProcessor, SoundIterator } from './oscillator/audio-processor';
import { MidiCallback, MidiPlayer, toActions } from './midi/midi-player';
import { Sound } from './oscillator/sound';
import { MidiStep, NoteAction } from './midi/types';
import { Sequencer } from './midi/sequencer';
import { Preset } from './oscillator/types';
import { Midi, PLAYER_ACTION } from '../core/types';

class CoreEngine {
  private sound = new Sound();
  private sequencer = new Sequencer();
  private player = new MidiPlayer(this.sequencer);

  setMidiCallback(f: MidiCallback) {
    this.player.onChange = f;
  }

  public setPlay(mode: PLAYER_ACTION) {
    const isPlaying = mode === 'play';
    this.player.isPlaying = isPlaying;

    if (!isPlaying) {
      this.sound.clear();
      this.player.clear();
    }

    if (mode === 'stop') {
      this.player.stop();
    }
  }

  public endNote(preset: Preset, n: number) {
    this.exec(preset, this.player.endNote(preset.sequence, n));
  }

  public startNote(preset: Preset, n: number) {
    this.exec(preset, this.player.startNote(preset.sequence, n));
  }

  public destroy() {
    this.player.setTime(0);
    this.sound.clear();
    this.player.clear();
  }

  public setTime = (t: number) =>  this.player.setTime(t);


  public next(preset: Preset, actions: NoteAction[]) {
    this.exec(preset, this.player.next(actions, preset.sequence));
    return this.sound.next(preset);
  }

  private exec = (preset: Preset, { start, end }: MidiStep) => {
    const open = (n: number) => this.sound.open(preset, n);
    const close = (n: number) => this.sound.close(preset, n);
    start?.forEach(open);
    end?.forEach(close);
  };
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

  public setMidi = (midi: Midi) => (this.actions = toActions(midi));

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
