export type Predicate<T> = (t: T) => boolean;

export const partition = <T extends object>(ts: T[], f: Predicate<T>) => {
  const as: T[] = [];
  const bs: T[] = [];

  ts.forEach((t) => (f(t) ? as.push(t) : bs.push(t)));

  return [as, bs] as const;
};

export const idString = (t: (number | string)[]) => t.join(':');

export const eq =
  <T>(a: T) =>
  (b: T) =>
    a === b;
