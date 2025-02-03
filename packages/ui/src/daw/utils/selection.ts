import { addTracking, dropTracking, Tracked } from './tracking';

export type Selected<T> = {
  selected: Tracked<T>[];
  inactive: T[];
};

export type Predicate<T> = (t: T) => boolean;

export const selectWith = <T extends object>(ts: T[], f: Predicate<T>) => {
  const result: Selected<T> = { selected: [], inactive: [] };

  ts.forEach((t) =>
    f(t)
      ? result.selected.push(addTracking(t))
      : result.inactive.push(dropTracking(t as Tracked<T>))
  );

  return result;
};
