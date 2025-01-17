export type Maybe<T> = T | undefined;


// SYNTH

export type Sequence = Record<number, Maybe<number[]>> & { enabled?: boolean };

export type FilterConfig = {
  cutoff: number;
  resonance: number;
  envelope: number;
  enabled: boolean;
};

export type Preset = {
  wave: WaveConfig;
  envelopes: Record<'filter' | 'gain', EnvelopeConfig>;
  filter: FilterConfig;
  sequence: Sequence;
};

export type WaveConfig = {
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

export type EnvelopeConfig = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};


export type WAVE_ID = keyof WaveConfig;

export type ENVELOPE_ID = 'gain' | 'filter';

export type FILTER_ID = 'cutoff' | 'envelope' | 'resonance';
