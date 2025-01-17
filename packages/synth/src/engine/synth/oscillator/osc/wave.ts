import { WaveConfig } from '../../../types';

export const waveFunction = (
  i: number,
  { square, saw, saw2, tech, sine, noise }: WaveConfig
) => {
  let value = 0;

  if (square) {
    value += square * (i > 0.5 ? 1 : -1);
  }

  if (saw) {
    value += saw * (1 - i * 2);
  }

  if (saw2) {
    value += saw2 * (1 - ((i * 2) % 1) * 2);
  }

  if (tech) {
    value +=
      tech * (i > 0.15 ? 0 : Math.min((0.05 - (i % 0.05)) * 50 - 0.7, 1));
  }

  if (sine) {
    value += sine * Math.sin(i * Math.PI * 2);
  }

  if (noise > 0) {
    value += noise * (1 - Math.random() * 2);
  }

  const totalVolume = square + saw + saw2 + tech + sine + noise;

  return totalVolume === 0 ? 0 : value / (totalVolume + 1);
};
