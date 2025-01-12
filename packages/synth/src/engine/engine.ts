import { audioProcessor, SoundIterator } from './oscillator/audio-processor';
import { MidiPlayer, toActions } from './midi/midi-player';
import { Sound } from './oscillator/sound';
import { DAWState } from './state';
import { MidiStep, NoteAction } from './midi/types';
import { Sequencer } from './midi/sequencer';

export type Callback = (c: { time: number; notes: number[] }) => void;

export class SynthCoreEngine implements SoundIterator {

  protected sound = new Sound();
  protected sequencer = new Sequencer();
  protected player = new MidiPlayer(this.sequencer);
  protected actions: NoteAction[];
  protected state: DAWState;

  public onChange: Callback;
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

  protected exec = ({ start, end, current, notes }: MidiStep) => {
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
}
