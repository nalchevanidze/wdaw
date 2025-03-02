import { MidiFragment } from '../common/types';

export const makeFragment = (name: string): MidiFragment => ({
  id: crypto.randomUUID(),
  name,
  notes: [],
  loop: [0, 64]
});

export const fid = {
  piano: '3d2ba839-ed91-4da5-a02a-01585af6ee4d',
  clap1: '7dc84f88-9742-417c-bff3-ccd679f145f3',
  clap2: '7ec4f35f-e1f2-4659-9d6a-b548a0bdad35',
  clapFast: '5b7aedf0-e12b-40cd-8a73-e296f9aa7181',
  bass: 'ffb50873-e996-4a48-9753-ab5a3899975a',
  kick: '469e3b68-d1dc-43d0-bd48-da16859ef3e9'
};

export const genMidiFragments = (): MidiFragment[] => [
  {
    id: fid.piano,
    name: 'Piano',
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
  {
    id: fid.bass,
    name: 'Bass',
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
  {
    id: fid.clap1,
    name: 'Clap 1',
    loop: [32, 64],
    notes: [
      { length: 4, id: 'C#1', at: 44 },
      { length: 4, id: 'C#1', at: 56 }
    ]
  },
  {
    id: fid.clapFast,
    name: 'Clap Fast',
    loop: [0, 64],
    notes: [
      { length: 2, id: 'C#1', at: 0 },
      { length: 2, id: 'C#1', at: 4 },
      { length: 2, id: 'C#1', at: 8 },
      { length: 2, id: 'C#1', at: 12 },
      { length: 2, id: 'C#1', at: 16 },
      { length: 2, id: 'C#1', at: 20 },
      { length: 2, id: 'C#1', at: 24 },
      { length: 2, id: 'C#1', at: 28 },
      { length: 2, id: 'C#1', at: 32 },
      { length: 2, id: 'C#1', at: 36 },
      { length: 2, id: 'C#1', at: 40 },
      { length: 2, id: 'C#1', at: 42 },
      { length: 2, id: 'C#1', at: 44 },
      { length: 2, id: 'C#1', at: 46 },
      { length: 2, id: 'C#1', at: 48 },
      { length: 2, id: 'C#1', at: 50 },
      { length: 2, id: 'C#1', at: 52 },
      { length: 2, id: 'C#1', at: 54 },
      { length: 2, id: 'C#1', at: 56 },
      { length: 2, id: 'C#1', at: 58 },
      { length: 2, id: 'C#1', at: 60 },
      { length: 2, id: 'C#1', at: 62 }
    ]
  },
  {
    id: fid.clap2,
    name: 'Clap 2',
    loop: [0, 32],
    notes: [
      { length: 4, id: 'C#1', at: 4 },
      { length: 4, id: 'C#1', at: 12 },
      { length: 4, id: 'C#1', at: 18 },
      { length: 4, id: 'C#1', at: 24 }
    ]
  },
  {
    id: fid.kick,
    name: 'Kick',
    loop: [0, 32],
    notes: [
      { length: 4, id: 'C#1', at: 0 },
      { length: 4, id: 'C#1', at: 8 },
      { length: 4, id: 'C#1', at: 16 },
      { length: 4, id: 'C#1', at: 24 }
    ]
  }
];
