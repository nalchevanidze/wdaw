import { Midi } from '../types';

const prelude: Midi = {
  name: "prelude",
  size: 16,
  notes: {
    '0': [
      { at: 0, id: 'C#3', length: 32 },
      { at: 0, id: 'F#2', length: 32 },
      { at: 0, id: 'D#1', length: 32 }
    ],
    '4': [
      { at: 0, id: 'C#3', length: 32 },
      { at: 0, id: 'F#2', length: 32 },
      { at: 0, id: 'D#1', length: 32 }
    ],
    '8': [
      { at: 0, id: 'F#2', length: 32 },
      { at: 0, id: 'D#2', length: 32 },
      { at: 0, id: 'C#1', length: 32 }
    ],
    '12': [
      { at: 0, id: 'F#2', length: 32 },
      { at: 0, id: 'D#2', length: 32 },
      { at: 0, id: 'B0', length: 32 }
    ]
  }
};

const bass: Midi = {
  name: "bass",
  size: 16,
  notes: {
    '0': [{ at: 0, id: 'D#2', length: 32 }],
    '4': [{ at: 0, id: 'D#2', length: 32 }],
    '8': [{ at: 0, id: 'C#2', length: 32 }],
    '12': [{ at: 0, id: 'F#2', length: 32 }]
  }
};

export { prelude, bass };
