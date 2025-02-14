const funWave = (fun: (i: number) => number): string =>
  'M' +
  Array.from(
    {
      length: 40
    },
    (_, i) => 30 + i + ' ' + (30 + fun(i / 40) * 40)
  );

const rescale = (vector: number[]): string =>
  'M' + vector.map((value) => 30 + value * 40).join(' ');

type IconLib = {
  [key: string]: string;
};

const noise = [
  0, 0.5, 0.05, 0.45, 0.1, 0.95, 0.15, 0.07, 0.2, 1, 0.25, 0.26, 0.3, 1, 0.35,
  0, 0.4, 0.8, 0.45, 0.2, 0.5, 0.81, 0.55, 0.1, 0.6, 0.8, 0.65, 0, 0.7, 1, 0.75,
  0.46, 0.8, 1, 0.85, 0, 0.9, 0.96, 0.95, 0, 1, 0.5
];

const icons: IconLib = {
  saw: rescale([0, 0.5, 0, 0, 1, 1, 1, 0.5]),
  square: rescale([0, 0.5, 0, 0, 0.5, 0, 0.5, 1, 1, 1, 1, 0.5]),
  saw2: rescale([0, 0.5, 0, 0, 0.5, 1, 0.5, 0, 1, 1, 1, 0.5]),
  noise: rescale(noise),
  sine: funWave((e) => Math.sin(e * 2 * Math.PI) / 2 + 0.5),
  fm: funWave((e) => Math.sin(e * 2 * Math.PI) / 2 + 0.5),
  tech: funWave((i) =>
    i < 0.15 ? Math.min((0.05 - (i % 0.05)) * 50 - 0.7, 1) - 0.5 : 0.5
  ),
  cutoff:
    'M25.03 34s11 .365 18.093-.415c7.092-.78 8.077-.095 12.153 5.524 4.075 5.618 19.06 29.97 19.06 29.97',
  resonance:
    'M25.86 65.488s17.086.177 24.168-30.246c6.56 30.48 25.135 29.14 25.135 29.14',
  envelope: rescale([0, 1, 0.1, 0, 0.3, 0.5, 0.5, 0.5, 1, 1]),
  fmFreq:
    'M22 49.8h6.5v20C39 71.3 37.5 30 44.3 30 51 30 50 70 56.7 70c6.7 0 2.6-39.7 6.5-40C67 30 63.8 70 70 70V50h8',
  offset: 'M30 50 l0 10 m10-20 l0 20 m10-30 l0 30 m10-20 l0 20 m10-10 l0 10'
};

export const getWaveIcon = (id: string) => icons[id];


const iconLib = {
  play: 'M20 0 L 90 50 20 100Z',
  pause: 'M30,100V0 M70,0v100',
  stop: 'M5 5 L 95 5 95 95 5 95z',
  draw: 'M72 15.2L20 68 14 88l19.4-6.6L90 23.6 73.7 7.8',
  select: 'M71 71L25.4 27M58.5 27.4l-33-.7.3 34'
};

export type IconName = keyof typeof iconLib;


export const getIcon = (id: IconName) => iconLib[id];
