import { Envelope, Filter, Module, Preset, Wave } from '../common/types';

const wave = ({ ...props }: Partial<Wave>): Wave => ({
  sine: 0,
  square: 0,
  saw: 0,
  saw2: 0,
  tech: 0,
  noise: 0,
  fm: 0,
  fmFreq: 0,
  offset: 0,
  octave: 1,
  voices: 1,
  ...props
});

const filter = ({ ...p }: Partial<Module<Filter>>): Module<Filter> => ({
  cutoff: 0,
  resonance: 0,
  envelope: 0,
  ...p
});

const env = ({ ...p }: Partial<Module<Envelope>>): Module<Envelope> => ({
  attack: 0,
  decay: 0.5,
  sustain: 0.5,
  release: 0.5,
  ...p
});

export const makePreset = (name: string) => ({
  id: crypto.randomUUID(),
  name,
  wave: wave({ square: 1 }),
  envelopes: { filter: env({}), gain: env({}) },
  filter: filter({ disabled: true }),
  sequence: { disabled: true }
});

export const pid = {
  prelude: '6931e27b-7266-4116-8480-72d47cb41df0',
  pluck: 'a0fbbda3-1b94-4299-bcb4-89da15809e88',
  razor: 'cc264e6f-76c0-436d-a360-3f9561e7f6d6',
  wind: '9b1ac378-fe1e-4828-8bd9-a1ab35424ec6',
  kick: 'fdfad340-fdce-46fe-9c9b-a619d4ce7676',
  bass: '85333e85-2d1c-4b0b-92a2-9de913938b13',
  clap: '5dc41231-d398-4b49-b785-331023a923aa'
};

export const genPresets = (): Preset[] => [
  {
    id: pid.prelude,
    name: 'prelude',
    wave: wave({
      sine: 0.2,
      square: 1,
      saw: 1,
      saw2: 1,
      offset: 0.75,
      voices: 12
    }),
    envelopes: {
      filter: {
        attack: 0,
        decay: 0.4,
        sustain: 0.08,
        release: 0.1
      },
      gain: {
        attack: 0,
        decay: 0.05,
        sustain: 0.5,
        release: 0.3
      }
    },
    filter: filter({ disabled: true }),
    sequence: { disabled: true }
  },
  {
    id: pid.pluck,
    name: 'pluck',
    wave: wave({ sine: 1, saw: 0.6, tech: 0.3 }),
    envelopes: {
      filter: {
        attack: 0,
        decay: 0.2,
        sustain: 0.2,
        release: 0.3
      },
      gain: {
        attack: 0,
        decay: 0.385,
        sustain: 0.185,
        release: 0.7
      }
    },
    filter: {
      cutoff: 0.15,
      resonance: 0.3,
      envelope: 0.5
    },
    sequence: {
      0: [1],
      2: [2],
      6: [1],
      12: [2],
      13: [3],
      14: [1]
    }
  },
  {
    id: pid.razor,
    name: 'razor',
    wave: wave({
      sine: 1,
      saw2: 0.125,
      tech: 1,
      fm: 0.7,
      fmFreq: 0.53125,
      voices: 3
    }),
    envelopes: {
      filter: {
        attack: 0,
        decay: 0.4,
        sustain: 0.08,
        release: 0.1
      },
      gain: {
        attack: 0,
        decay: 0.2,
        sustain: 1,
        release: 0.05
      }
    },
    filter: filter({ disabled: true }),
    sequence: { disabled: true }
  },
  {
    id: pid.wind,
    name: 'wind',
    wave: wave({
      sine: 1,
      square: 0.1,
      saw: 0.4,
      saw2: 0.125,
      offset: 0.5
    }),
    envelopes: {
      filter: {
        attack: 0.7,
        decay: 0.7,
        sustain: 0.08,
        release: 0.1
      },
      gain: {
        attack: 0.2,
        decay: 0.2,
        sustain: 1,
        release: 0.3
      }
    },
    filter: {
      cutoff: 0.5,
      resonance: 0.2,
      envelope: 0.6
    },
    sequence: {
      disabled: true
    }
  },
  {
    id: pid.kick,
    name: 'kick',
    wave: wave({
      sine: 1,
      square: 0.1,
      saw: 0.2,
      noise: 0.5,
      offset: 0.5
    }),
    envelopes: {
      filter: {
        attack: 0,
        decay: 0.05,
        sustain: 0.0,
        release: 0
      },
      gain: {
        attack: 0,
        decay: 0.3,
        sustain: 0.1,
        release: 0.2
      }
    },
    filter: {
      cutoff: 0.1,
      resonance: 0.6,
      envelope: 0.8
    },
    sequence: { disabled: true }
  },
  {
    id: pid.bass,
    name: 'bass',
    wave: wave({
      sine: 1,
      saw2: 0.12,
      tech: 1,
      fm: 0.7,
      fmFreq: 0.5,
      voices: 3
    }),
    envelopes: {
      filter: {
        attack: 0,
        decay: 0.5,
        sustain: 0.08,
        release: 0.1
      },
      gain: {
        attack: 0,
        decay: 0.6,
        sustain: 0.8,
        release: 0.1
      }
    },
    filter: {
      cutoff: 0.1,
      resonance: 0.3,
      envelope: 0.3
    },
    sequence: { disabled: true }
  },
  {
    id: pid.clap,
    name: 'clap',
    wave: wave({ noise: 0.2 }),
    envelopes: {
      filter: {
        attack: 0,
        decay: 0.4,
        sustain: 0.08,
        release: 0.1
      },
      gain: {
        attack: 0,
        decay: 0.2,
        sustain: 0,
        release: 0
      }
    },
    filter: filter({ disabled: true }),
    sequence: { disabled: true }
  }
];
