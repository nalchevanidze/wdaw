import { Preset } from '../common/types';
import { Synth } from '../synth';
import { RecordLoop } from './record';
import { NoteLoops } from './utils/actions';
import { DynamicValue, DynamicValueInput } from './utils/dynamic-value';

const derfaultPreset: Preset = {
  id: 'default',
  name: 'prelude',
  wave: {
    sine: 0.2,
    square: 1,
    saw: 1,
    saw2: 1,
    tech: 0,
    noise: 0,
    fm: 0,
    fmFreq: 0,
    offset: 0.75,
    voices: 12,
    octave: 1
  },
  envelopes: {
    filter: {
      attack: 0,
      decay: 0.4,
      sustain: 0.08,
      release: 0.1
    },
    gain: {
      attack: 0,
      decay: 0.05,
      sustain: 0.5,
      release: 0.3
    }
  },
  filter: {
    cutoff: 0.35,
    resonance: 0.2,
    envelope: 0.6,
    disabled: true
  },
  sequence: {
    disabled: true
  }
};

class Track {
  private loops: RecordLoop[] = [];
  private currentGain: number = 1;
  public size = 0;
  private preset: Preset = derfaultPreset;
  private gain = new DynamicValue((v) => {
    console.log(v)
    this.currentGain = v;
  });

  constructor(private synth: Synth) {}

  public startNote = (n: number) => this.synth.startNote(this.preset, n);

  public endNote = (n: number) => this.synth.endNote(this.preset, n);

  public nextMidiActions = (current: number) => {
    if (current > this.size) {
      this.clear();
      return;
    }

    for (const loop of this.loops) {
      const inRange = loop.start <= current && current <= loop.end;

      if (inRange) {
        this.synth.nextActions(this.preset, loop.get(current));
      }
    }
  };

  public nextKeyboardActions = () => this.synth.nextActions(this.preset);

  public setGain(value: DynamicValueInput) {
    this.gain.set(value);
  }

  public next = () => this.synth.next(this.preset) * this.currentGain;

  public clear = () => this.synth.clear();

  public setNoteLoops = ({ loops, size }: NoteLoops): void => {
    this.loops = loops;
    this.size = size;
  };

  public setPreset = (preset: Preset) => {
    this.preset = preset;
  };
}

export { Track };
