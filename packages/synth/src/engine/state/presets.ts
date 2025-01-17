import { Preset } from '../common/types';

const prelude: Preset = {
  wave: {
    sine: 0.2,
    square: 1,
    saw: 1,
    saw2: 1,
    tech: 0,
    noise: 0,
    fm: 0,
    fmFreq: 0,
    offset: 0.75,
    voices: 12,
    octave: 1
  },
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
  filter: {
    cutoff: 0.35,
    resonance: 0.2,
    envelope: 0.6,
    enabled: false
  },
  sequence: {
    enabled: false
  }
};

const pluck: Preset = {
  wave: {
    sine: 1,
    square: 0,
    saw: 0.6,
    saw2: 0,
    tech: 0.3,
    noise: 0,
    fm: 0,
    fmFreq: 0,
    offset: 0,
    voices: 1,
    octave: 1
  },
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
    cutoff: 0.1,
    resonance: 0.3,
    envelope: 0.5,
    enabled: true
  },
  sequence: {
    enabled: true,
    0: [1, 3],
    3: [1, 3],
    6: [1, 2],
    10: [1, 3],
    12: [2],
    13: [3],
    14: [1]
  }
};

const razor: Preset = {
  wave: {
    sine: 1,
    square: 0,
    saw: 0,
    saw2: 0.125,
    tech: 1,
    noise: 0,
    fm: 0.7,
    fmFreq: 0.53125,
    offset: 0,
    voices: 3,
    octave: 0
  },
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
  filter: {
    enabled: false,
    cutoff: 0.5,
    resonance: 0.2,
    envelope: 0.6
  },
  sequence: {
    enabled: true,
    0: [3],
    1: [1],
    3: [3],
    4: [1],
    6: [3],
    7: [1],
    9: [1],
    11: [1],
    12: [1],
    14: [3]
  }
};

const wind: Preset = {
  wave: {
    sine: 1,
    square: 0.1,
    saw: 0.4,
    saw2: 0.125,
    tech: 0,
    noise: 0,
    fm: 0,
    fmFreq: 0,
    offset: 0.5,
    voices: 1,
    octave: 0
  },
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
    envelope: 0.6,
    enabled: true
  },
  sequence: {
    enabled: false
  }
};

export const presets = { prelude, pluck, razor, wind };

export type PresetName = keyof typeof presets;

export const presetNames = Object.keys(presets) as PresetName[];
