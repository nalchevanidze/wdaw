
export const withAccuracy =
  (f: (time: number) => void, step: number) => (n: number) =>
    f(toAccuracy(n, step));

export const toAccuracy = (n: number, step: number) =>
  Math.round(n / step) * step;
