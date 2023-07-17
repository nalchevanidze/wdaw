export type Maybe<T> = T | undefined;

export type Note = {
  id: string;
  length: number;
  at: number;
};

export type PANEL_ID = 'filter' | 'sequence' | 'wave';

export type ENVELOPE_ID = 'gain' | 'filter';

export type PLAYER_ACTION = 'play' | 'pause' | 'stop';

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

export type WAVE_ID = keyof WaveConfig;
