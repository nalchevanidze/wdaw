import { Midi, Note } from '../types';

const midiLoop = (f: () => Note[]):Midi => ({
  size: 16,
  start: 0,
  end: 64,
  notes: {
    '0': f(),
    '4': f(),
    '8': f(),
    '12': f()
  }
});

export {   midiLoop };
