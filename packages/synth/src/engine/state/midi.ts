import { Midi } from '../types';

const prelude: Midi = {
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
  size: 16,
  notes: {
    '0': [{ at: 0, id: 'D#2', length: 8 }],
    '4': [{ at: 0, id: 'D#2', length: 8 }],
    '8': [{ at: 0, id: 'C#2', length: 8 }],
    '12': [{ at: 0, id: 'F#2', length: 8 }]
  }
};

const drum: Midi = {
  size: 16,
  notes: {
    '0': [
      { at: 0, id: 'C#1', length: 4 },
      { at: 8, id: 'C#1', length: 4 },
      { at: 16, id: 'C#1', length: 4 },
      { at: 24, id: 'C#1', length: 4 }
    ],
    '4': [
      { at: 0, id: 'C#1', length: 4 },
      { at: 8, id: 'C#1', length: 4 },
      { at: 16, id: 'C#1', length: 4 },
      { at: 24, id: 'C#1', length: 4 }
    ],
    '8': [
      { at: 0, id: 'C#1', length: 4 },
      { at: 8, id: 'C#1', length: 4 },
      { at: 16, id: 'C#1', length: 4 },
      { at: 24, id: 'C#1', length: 4 }
    ],
    '12': [
      { at: 0, id: 'C#1', length: 4 },
      { at: 8, id: 'C#1', length: 4 },
      { at: 16, id: 'C#1', length: 4 },
      { at: 24, id: 'C#1', length: 4 }
    ]
  }
};

export { prelude, bass, drum };
