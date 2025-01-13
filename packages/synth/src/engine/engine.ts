import { audioProcessor, SoundIterator } from './oscillator/audio-processor';
import { MidiPlayer, toActions } from './midi/midi-player';
import { Sound } from './oscillator/sound';
import { MidiStep, NoteAction } from './midi/types';
import { Sequencer } from './midi/sequencer';
import { Preset } from './oscillator/types';
import { Midi, PLAYER_ACTION } from '../core/types';

export type Callback = (c: {
  isPlaying: boolean;
  time: number;
  notes: number[];
}) => void;

class CoreEngine {
  private sound = new Sound();
  private sequencer = new Sequencer();
  private player = new MidiPlayer(this.sequencer);

  public onChange: Callback;

  public setPlay(mode: PLAYER_ACTION) {
    const isPlaying = mode === 'play';
    this.player.isPlaying = isPlaying;

    if (!isPlaying) {
      this.sound.clear();
      this.player.clear();
    }

    if (mode === 'stop') {
      this.player.setTime(0);
      this.onChange({
        isPlaying: false,
        time: 0,
        notes: []
      });
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

  setTime(t: number) {
    this.player.setTime(t);
    this.onChange({
      isPlaying: this.player.isPlaying,
      time: t,
      notes: Array.from(this.player.notes)
    });
  }

  public next(preset: Preset, actions: NoteAction[]) {
    this.exec(preset, this.player.next(actions, preset.sequence));
    return this.sound.next(preset);
  }

  private exec = (preset: Preset, { start, end, current, notes }: MidiStep) => {
    const open = (n: number) => this.sound.open(preset, n);
    const close = (n: number) => this.sound.close(preset, n);

    start?.forEach(open);
    end?.forEach(close);

    if (current !== undefined) {
      requestAnimationFrame(() =>
        this.onChange({
          isPlaying: this.player.isPlaying,
          time: current,
          notes: Array.from(notes)
        })
      );
    }
  };
}

export class SynthEngine implements SoundIterator {
  private engine = new CoreEngine();
  private actions: NoteAction[];
  private closeContext: () => void;
  private preset: Preset;
  public onChange: Callback;

  constructor() {
    this.closeContext = audioProcessor(this);
    this.engine.onChange = (c) => this.onChange(c);
  }

  public endNote = (n: number) => this.engine.endNote(this.preset, n);

  public startNote = (n: number) => this.engine.startNote(this.preset, n);

  public setMidi(midi: Midi) {
    this.actions = toActions(midi);
  }

  public setPreset(preset: Preset) {
    this.preset = preset;
  }

  public destroy() {
    this.engine.destroy();
    this.closeContext();
  }

  public setTime = (t: number) => this.engine.setTime(t);

  public next() {
    return this.engine.next(this.preset, this.actions);
  }
}
