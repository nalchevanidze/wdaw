// https://en.wikipedia.org/wiki/A440_(pitch_standard)
// represent A4 note
const A440 = 440;

// shift A4 to A0
const shiftOctave = 12 * 4;

// shifts note A0 to C0
const shiftNote = 10;

const shift = -shiftNote - shiftOctave;

// with reference C0 = 1, where result for 1 should be 16.351597831287414 Hz
export const noteToFrequency = (index: number): number =>
  2 ** ((shift + index) / 12) * A440;

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
