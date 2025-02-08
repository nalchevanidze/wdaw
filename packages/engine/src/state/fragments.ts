import { MidiFragments } from '../common/types';

export const genMidiFragments = (): MidiFragments => ({
  piano: {
    loop: [0, 256],
    notes: [
      { length: 32, id: 'F#2', at: 0 },
      { length: 32, id: 'A#1', at: 0 },
      { length: 32, id: 'F#2', at: 32 },
      { length: 32, id: 'A#1', at: 32 },
      { length: 32, id: 'D#2', at: 64 },
      { length: 32, id: 'C#1', at: 64 },
      { length: 32, id: 'D#2', at: 96 },
      { length: 32, id: 'F#1', at: 96 },
      { length: 32, id: 'F#3', at: 128 },
      { length: 32, id: 'A#2', at: 128 },
      { length: 32, id: 'F#3', at: 160 },
      { length: 32, id: 'A#2', at: 160 },
      { length: 32, id: 'D#3', at: 192 },
      { length: 32, id: 'C#2', at: 192 },
      { length: 32, id: 'D#3', at: 224 },
      { length: 32, id: 'F#2', at: 224 }
    ]
  },
  bass: {
    loop: [0, 128],
    notes: [
      { length: 4, id: 'A#1', at: 6 },
      { length: 4, id: 'A#1', at: 12 },
      { length: 4, id: 'A#1', at: 20 },
      { length: 4, id: 'A#1', at: 36 },
      { length: 4, id: 'A#1', at: 44 },
      { length: 4, id: 'A#1', at: 52 },
      { length: 4, id: 'C#2', at: 70 },
      { length: 4, id: 'C#2', at: 76 },
      { length: 4, id: 'C#2', at: 84 },
      { length: 4, id: 'G#1', at: 92 },
      { length: 4, id: 'F#2', at: 100 },
      { length: 4, id: 'F#2', at: 108 },
      { length: 4, id: 'F#2', at: 116 },
      { length: 4, id: 'D#2', at: 124 }
    ]
  },
  clap: {
    loop: [32, 64],
    notes: [
      { length: 4, id: 'C#1', at: 44 },
      { length: 4, id: 'C#1', at: 56 }
    ]
  },
  kick: {
    loop: [0, 32],
    notes: [
      { length: 4, id: 'C#1', at: 0 },
      { length: 4, id: 'C#1', at: 8 },
      { length: 4, id: 'C#1', at: 16 },
      { length: 4, id: 'C#1', at: 24 }
    ]
  }
});
