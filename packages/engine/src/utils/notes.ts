import { noteToFrequency } from '../synth/oscillator/utils';

export const BASE_NOTES: string[] = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B'
];

export const OCTAVE_SIZE = BASE_NOTES.length;

const OCTAVE_RANGE = 4;

const toString = (index: number): string => {
  const i = index - 1;
  const head = BASE_NOTES[i % OCTAVE_SIZE];
  const octaveIndex = Math.min(OCTAVE_RANGE, Math.floor(i / OCTAVE_SIZE));
  return `${head}${octaveIndex}`;
};

const fromString = (note: string): number => {
  const indexPosition = note.length - 1;
  const octaveIndex = Math.min(
    OCTAVE_RANGE,
    Number(note.charAt(indexPosition))
  );
  note = note.slice(0, indexPosition);
  const keyIndex = BASE_NOTES.indexOf(note.toUpperCase());
  if (keyIndex === -1) {
    throw new Error('invalid Note');
  }
  return keyIndex + 1 + octaveIndex * OCTAVE_SIZE;
};

const measure = (input: string) => {
  const ocatvePlus = 0;
  const note = fromString(input);
  const range = Math.max(note + Math.floor(ocatvePlus) * 12, 0);
  const freq = noteToFrequency(range);
  console.log(input, range, freq);
};

console.log(toString(49));

console.log(440 * 2 ** (49 / 12));

measure('C0');
measure('F0');
measure('C1');
measure('A4');

export const NoteUnit = {
  toString,
  fromString
};
