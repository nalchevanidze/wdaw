const patern = [
  { id: 'C', index: 0 },
  { id: 'D', index: 2 },
  { id: 'E', index: 4 },
  { id: 'F', index: 5 },
  { id: 'G', index: 7 },
  { id: 'A', index: 9 },
  { id: 'B', index: 11 },
  { id: 'C#', fixed: 9.2, index: 1 },
  { id: 'D#', fixed: 23.6, index: 3 },
  { id: 'F#', fixed: 52.1, index: 6 },
  { id: 'G#', fixed: 66.5, index: 8 },
  { id: 'A#', fixed: 81.5, index: 10 }
];

type Key = { key: number; fixed?: string; };

export const keys = [1, 2, 3].flatMap((octave) =>
  patern.map(
    ({ index, fixed,  }): Key => ({
      key: octave * 12 + index,
      fixed: fixed ? ((octave - 1) * 100) / 3 + fixed / 3 + '%' : undefined,
    })
  )
);
