const keys = [
  { id: 'C', index: 0 },
  { id: 'D', index: 2 },
  { id: 'E', index: 4 },
  { id: 'F', index: 5 },
  { id: 'G', index: 7 },
  { id: 'A', index: 9 },
  { id: 'B', index: 11 },
  { semi: true, id: 'C#', left: 9.2, index: 1 },
  { semi: true, id: 'D#', left: 23.6, index: 3 },
  { semi: true, id: 'F#', left: 52.1, index: 6 },
  { semi: true, id: 'G#', left: 66.5, index: 8 },
  { semi: true, id: 'A#', left: 81.5, index: 10 }
];

type Key = { key: number; left?: string; semi: boolean };

export const allKeys = [1, 2, 3].map((octave) =>
  keys.map(
    ({ index, left, semi }): Key => ({
      key: octave * 12 + index,
      left: left ? left + '%' : undefined,
      semi: Boolean(semi)
    })
  )
);
