import { OCTAVE_SIZE } from './notes';

const keyboardMap: string[] = [
  'z',
  's',
  'x',
  'd',
  'c',
  'v',
  'g',
  'b',
  'h',
  'n',
  'j',
  'm',
  'q',
  '2',
  'w',
  '3',
  'e',
  'r',
  '5',
  't',
  '6',
  'y',
  '7',
  'u'
];

const noteFromKeyboard = (e: KeyboardEvent | number) => {
  if (typeof e === 'number') {
    return e;
  }

  const key = keyboardMap.indexOf(e.key);

  return key === -1 ? undefined : key + OCTAVE_SIZE;
};

export { noteFromKeyboard };
