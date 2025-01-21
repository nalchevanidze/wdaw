import { Midi, Note } from '../types';

const midiLoop = (f: () => Note[]): Midi => ({
  loop: [0, 8],
  start: 0,
  end: 64,
  notes: {
    '0': f(),
    '4': f()
  }
});

export { midiLoop };
