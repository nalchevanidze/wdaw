import { Sequence } from "../midi/types";

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

export type FilterConfig = {
  cutoff: number;
  resonance: number;
  envelope: number;
  enabled: boolean;
};

export type EnvelopeConfig = {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
};

export type SynthConfig = {
  wave: WaveConfig;
  envelopes: Record<"filter" | "gain", EnvelopeConfig>;
  filter: FilterConfig;
  sequence: Sequence;
};
