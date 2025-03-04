export const toAccuracy = (step: number) => (n: number) =>
  Math.round(n / step) * step;
