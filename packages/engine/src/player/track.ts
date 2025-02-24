import { Preset } from '../common/types';
import { Synth } from '../synth';
import { RecordLoop } from './record';
import { NoteLoops } from './utils/actions';

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
    enabled: false
  },
  sequence: {
    enabled: false
  }
};

class Track {
  private loops: RecordLoop[] = [];
  private gain: number = 1;
  public size = 0;
  private preset: Preset = derfaultPreset;

  constructor(private synth: Synth) {}

  public startNote = (n: number) => this.synth.startNote(this.preset, n);

  public endNote = (n: number) => this.synth.endNote(this.preset, n);

  public nextActions = (isPlaying: boolean, current: number) => {
    if (isPlaying && current > this.size) {
      this.clear();
      return;
    }

    for (const loop of this.loops) {
      const inRange = loop.start <= current && current <= loop.end;

      if (inRange || !isPlaying) {
        this.synth.nextActions(
          this.preset,
          isPlaying ? loop.get(current) : undefined
        );
      }
    }
  };

  public setGain(n: number) {
    this.gain = n;
  }

  public next = () => this.synth.next(this.preset) * this.gain;

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
