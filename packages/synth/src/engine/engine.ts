import { audioProcessor, SoundIterator } from './oscillator/audio-processor';
import { MidiPlayer, toActions } from './midi/midi-player';
import { Sound } from './oscillator/sound';
import { MidiStep, NoteAction } from './midi/types';
import { Sequencer } from './midi/sequencer';
import { Preset } from './oscillator/types';
import { Midi, PLAYER_ACTION } from '../core/types';

export type Callback = (c: { time: number; notes: number[] }) => void;

export class SynthEngine implements SoundIterator {
  private sound = new Sound();
  private sequencer = new Sequencer();
  private actions: NoteAction[];
  private closeContext: () => void;
  private preset: Preset;
  private player = new MidiPlayer(this.sequencer);

  public onChange: Callback;

  constructor() {
    this.closeContext = audioProcessor(this);
  }

  public setPlay(mode: PLAYER_ACTION) {
    const isPlaying = mode === 'play';
    this.player.isPlaying = isPlaying;

    if (!isPlaying) {
      this.sound.clear();
      this.player.clear();
    }

    if (mode === 'stop') {
      this.player.setTime(0);
    }
  }

  public endNote(n: number) {
    this.exec(this.preset, this.player.endNote(this.preset.sequence, n));
  }

  public startNote(n: number) {
    this.exec(this.preset, this.player.startNote(this.preset.sequence, n));
  }

  public setMidi(midi: Midi) {
    this.actions = toActions(midi);
  }

  public setPreset(preset: Preset) {
    this.preset = preset;
  }

  public destroy() {
    this.player.setTime(0);
    this.sound.clear();
    this.player.clear();
    this.closeContext();
  }

  setTime(t: number) {
    this.player.setTime(t);
  }

  public next() {
    this.exec(
      this.preset,
      this.player.next(this.actions, this.preset.sequence)
    );
    return this.sound.next(this.preset);
  }

  private exec = (preset: Preset, { start, end, current, notes }: MidiStep) => {
    const open = (n: number) => this.sound.open(preset, n);
    const close = (n: number) => this.sound.close(preset, n);

    start?.forEach(open);
    end?.forEach(close);

    if (current !== undefined) {
      requestAnimationFrame(() =>
        this.onChange({ time: current, notes: Array.from(notes) })
      );
    }
  };
}
