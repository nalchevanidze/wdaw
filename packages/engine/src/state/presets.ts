import { Preset } from '../common/types';

export const newPreset = (name: string) => ({
  id: crypto.randomUUID(),
  name,
  wave: {
    sine: 0,
    square: 1,
    saw: 0,
    saw2: 0,
    tech: 0,
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
      decay: 1,
      sustain: 1,
      release: 1
    },
    gain: {
      attack: 0,
      decay: 0.5,
      sustain: 0.5,
      release: 0.5
    }
  },
  filter: {
    cutoff: 0,
    resonance: 0,
    envelope: 0,
    enabled: false
  },
  sequence: {
    enabled: false
  }
});

export const pid = {
  prelude: 'm7i2w4o43or7y9wl36f',
  pluck: 'm7i2w4o4vcyn35ysj6k',
  razor: 'm7i2w4o43kexh9lnmn',
  wind: 'm7i2w4o4iqyqo1mtqng',
  kick: 'm7i2w4o4yagm4uqupe',
  bass: 'm7i2w4o4bhypc0dvihe',
  clap: 'm7i2w4o4x7jrffwgwo'
};

export const genPresets = (): Preset[] => [
  {
    id: pid.prelude,
    name: 'prelude',
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
  },
  {
    id: pid.pluck,
    name: 'pluck',
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
      cutoff: 0.15,
      resonance: 0.3,
      envelope: 0.5,
      enabled: true
    },
    sequence: {
      enabled: true,
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
      enabled: false,
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
  },
  {
    id: pid.wind,
    name: 'wind',
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
  },
  {
    id: pid.kick,
    name: 'kick',
    wave: {
      sine: 1,
      square: 0.1,
      saw: 0.2,
      saw2: 0,
      tech: 0,
      noise: 0.5,
      fm: 0,
      fmFreq: 0,
      offset: 0.5,
      voices: 1,
      octave: 0
    },
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
      envelope: 0.8,
      enabled: true
    },
    sequence: {
      enabled: false
    }
  },
  {
    id: pid.bass,
    name: 'bass',
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
      enabled: true,
      cutoff: 0.1,
      resonance: 0.3,
      envelope: 0.3
    },
    sequence: {
      enabled: false
    }
  },
  {
    id: pid.clap,
    name: 'clap',
    wave: {
      sine: 0,
      square: 0,
      saw: 0,
      saw2: 0,
      tech: 0,
      noise: 0.2,
      fm: 0,
      fmFreq: 0,
      offset: 0,
      voices: 1,
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
        sustain: 0,
        release: 0
      }
    },
    filter: {
      cutoff: 0.5,
      resonance: 0.2,
      envelope: 0.6,
      enabled: false
    },
    sequence: {
      enabled: false
    }
  }
];
