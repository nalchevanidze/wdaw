type Key = {
  index: number;
  left?: string;
  semi?: boolean;
};

const keys = [
  { id: 'C' },
  { semi: true, id: 'C#', left: 9.2 },
  { id: 'D' },
  { semi: true, id: 'D#', left: 23.6 },
  { id: 'E' },
  { id: 'F' },
  { semi: true, id: 'F#', left: 52.1 },
  { id: 'G' },
  { semi: true, id: 'G#', left: 66.5 },
  { id: 'A' },
  { semi: true, id: 'A#', left: 81.5 },
  { id: 'B' }
].map(
  (key, index): Key => ({
    ...key,
    index,
    left: key.left ? key.left + '%' : undefined
  })
);

export const allkeys: Key[] = [
  ...keys.filter((e) => !e.semi),
  ...keys.filter((e) => e.semi)
];
