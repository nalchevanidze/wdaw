import { Midi, Note } from '../types';

const midiLoop = (f: () => Note[]):Midi => ({
  size: 16,
  notes: {
    '0': f(),
    '4': f(),
    '8': f(),
    '12': f()
  }
});

export {   midiLoop };
