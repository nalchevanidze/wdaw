import { Presets, MidiFragments, MidiFragment } from '../common/types';
import { fid, genMidiFragments } from './fragments';
import { genPresets, pid } from './presets';

export type TrackState = {
  name: string;
  gain: number;
  presetId: string;
};

export type MidiRef = {
  id: string;
  start: number;
  end: number;
  trackIndex: number;
  fragmentId?: string;
};

export type TracksState = {
  tracks: TrackState[];
  midiFragments: MidiFragments;
  presets: Presets;
  midiRefs: MidiRef[];
};

type PlayerState = {
  isPlaying: boolean;
  time: number;
  bpm: number;
};

export type EngineState = PlayerState & TracksState;

export const engineState = (): EngineState => {
  const presets = Object.fromEntries(genPresets().map((p) => [p.id, p]));

  const midiRefs: MidiRef[] = [
    {
      id: 'm7i2xl12uoox91ahk8f',
      trackIndex: 0,
      start: 512,
      end: 1024,
      fragmentId: fid.piano
    },
    {
      id: 'm7i2xl124ucbq33ep0m',
      trackIndex: 1,
      start: 256,
      end: 1024,
      fragmentId: fid.bass
    },
    {
      id: 'm7i2xl1277uszw9el7e',
      trackIndex: 2,
      start: 0,
      end: 1024,
      fragmentId: fid.kick
    },
    {
      id: 'm7i2xl12sdwtq69wct8',
      trackIndex: 3,
      start: 128,
      end: 192,
      fragmentId: fid.clap1
    },
    {
      id: 'm7i2xl123b4eichq2sh',
      trackIndex: 3,
      start: 192,
      end: 256,
      fragmentId: fid.clapFast
    },
    {
      id: 'm7i2xl127dj7x642flh',
      trackIndex: 3,
      start: 384,
      end: 448,
      fragmentId: fid.clap2
    },
    {
      id: 'm7i2xl1269jl3gq8jia',
      trackIndex: 3,
      start: 448,
      end: 512,
      fragmentId: fid.clapFast
    },
    {
      id: 'm7i2xl121ysrazelthr',
      trackIndex: 3,
      start: 768,
      end: 960,
      fragmentId: fid.clap2
    },
    {
      id: 'm7i2xl12utl2b2q91af',
      trackIndex: 3,
      start: 960,
      end: 1024,
      fragmentId: fid.clapFast
    }
  ];

  const tracks: TrackState[] = [
    { name: 'Piano', presetId: pid.pluck, gain: 0.4 },
    { name: 'Bass', presetId: pid.bass, gain: 0.3 },
    { name: 'Kick', presetId: pid.kick, gain: 1 },
    { name: 'Clap', presetId: pid.clap, gain: 0.3 }
  ];

  return {
    bpm: 120,
    midiRefs,
    midiFragments: genMidiFragments(),
    presets,
    isPlaying: false,
    time: 0,
    tracks
  };
};

export const makeMidiRef = ({
  trackIndex,
  start,
  end
}: Omit<MidiRef, 'id'>): MidiRef => ({
  id: crypto.randomUUID(),
  trackIndex,
  start,
  end
});

export const makeFragment = (name: string): MidiFragment & {id: string} => ({
  id: crypto.randomUUID(),
  name,
  notes: [],
  loop: [0, 64]
});
