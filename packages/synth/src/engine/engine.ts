import { audioProcessor, SoundIterator } from './oscillator/audio-processor';
import { MidiPlayer, toActions } from './midi/midi-player';
import { Sound } from './oscillator/sound';
import { MidiStep, NoteAction } from './midi/types';
import { Sequencer } from './midi/sequencer';
import { Preset } from './oscillator/types';
import { Midi } from '../core/types';

export type Callback = (c: { time: number; notes: number[] }) => void;

export class SynthCoreEngine implements SoundIterator {
  private sound = new Sound();
  private sequencer = new Sequencer();
  protected player = new MidiPlayer(this.sequencer);
  protected actions: NoteAction[];
  private closeContext: () => void;
  private preset: Preset;

  public onChange: Callback;

  constructor() {
    this.closeContext = audioProcessor(this);
  }

  purge() {
    if (!this.player.isPlaying) {
      this.sound.clear();
      this.player.clear();
    }
  }

  setup(preset: Preset, midi: Midi) {
    this.preset = preset;
    this.actions = toActions(midi);
  }

  setPreset(preset: Preset) {
    this.preset = preset;
  }

  public destroy() {
    this.player.setTime(0);
    this.sound.clear();
    this.player.clear();
    this.closeContext();
  }

  protected exec = (
    preset: Preset,
    { start, end, current, notes }: MidiStep
  ) => {
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

  public next() {
    this.exec(
      this.preset,
      this.player.next(this.actions, this.preset.sequence)
    );
    return this.sound.next(this.preset);
  }
}
