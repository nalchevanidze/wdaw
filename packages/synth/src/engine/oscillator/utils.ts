export const noteToFrequency = (index: number): number =>
  2 ** ((index - 49) / 12) * 440;

export const safeWaveValue = (value: number): number =>
  Math.min(Math.max(value, -1), 1);

export const nList = <T>(n: number, f: (_: number) => T) =>
  Array.from({ length: n }, f);

type Options = {
  power?: number;
  steps?: number;
};

export function* counter(
  duration = 0.5,
  startValue = 1,
  endValue = 0,
  { power = 3, steps = 2048 }: Options = {}
): IterableIterator<number> {
  if (duration === 0) return endValue;

  let left = 0;
  const difference: number = endValue - startValue;
  duration = duration * steps;

  while (++left < duration) {
    const level = (left / duration) ** power;
    yield startValue + difference * level;
  }

  return endValue;
}

export const SAMPLE_RATE = 44100;
