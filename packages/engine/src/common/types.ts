export type Maybe<T> = T | undefined;
// SYNTH

export type Sequence = Record<number, Maybe<number[]>>;

export type Module<T> = { disabled?: boolean } & T;

export type Filter = {
  cutoff: number;
  resonance: number;
  envelope: number;
};

export type Preset = {
  id: string;
  name: string;
  wave: Wave;
  envelopes: Record<'filter' | 'gain', Envelope>;
  filter: Module<Filter>;
  sequence: Module<Sequence>;
};

export type Presets = Record<string, Preset>;

export type Wave = {
  sine: number;
  square: number;
  saw: number;
  saw2: number;
  tech: number;
  noise: number;
  fm: number;
  fmFreq: number;
  offset: number;
  voices: number;
  octave: number;
};

export type Envelope = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

export type NoteAction = {
  start?: number[];
  end?: number[];
};

export type Note = {
  id: string;
  note: string;
  length: number;
  at: number;
};

export type MidiFragment = {
  id: string;
  name: string;
  notes: Note[];
  loop: [number, number];
};

export type MidiFragments = Record<string, MidiFragment>;

export type Midi = {
  start: number;
  end: number;
  fragmentId: string;
};

export type MidiRef = {
  id: string;
  trackId: number;
  fragmentId?: string;
  start: number;
  end: number;
};

export type TrackInput = {
  name: string;
  gain: number;
  presetId: string;
};

export type TracksInput = {
  tracks: TrackInput[];
  midiFragments: MidiFragments;
  presets: Presets;
  midiRefs: MidiRef[];
};
