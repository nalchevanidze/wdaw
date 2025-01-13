export type Maybe<T> = T | undefined;

export type Note = {
  id: string;
  length: number;
  at: number;
};

export type PANEL_ID = 'filter' | 'sequence' | 'wave';

export type ENVELOPE_ID = 'gain' | 'filter';

export type PLAYER_ACTION = 'play' | 'pause' | 'stop';

export type FILTER_ID = 'cutoff' | 'envelope' | 'resonance';

export type WaveConfig = {
  enabled?: boolean;
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


export type Midi = {
  size: number;
  notes: Record<number, Note[]>;
};