export function noteToFrequency(index: number): number {
  let pow: number = (index - 49) / 12;
  return 2 ** pow * 440;
}

export const safeWaveValue = (value: number): number =>
  Math.min(Math.max(value, -1), 1);

export const nList = <T>(n: number, f: (_: number) => T) =>
  Array.from({ length: n }, f);

type Options = {
  power?:number;
  steps?: number;
};

export function* counter(
  duration: number = 0.5,
  startValue: number = 1,
  endValue: number = 0,
  {power = 3 ,steps = 2048} : Options = {}
): IterableIterator<number> {
  if (duration === 0) return endValue;

  let left: number = 0;
  let difference: number = endValue - startValue;
  duration = duration * steps;

  while (++left < duration) {
    let level = (left / duration) ** power;
    yield startValue + difference * level;
  }

  return endValue;
}

export const SAMPLE_RATE: number = 44100;
