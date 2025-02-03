import { Area, IZone } from '@wdaw/svg';
import { addTracking, Tracked } from './tracking';

export type Selected<T> = {
  selected: Tracked<T>[];
  inactive: T[];
};
export const selectIn =
  <T extends object>(f: (t: T) => IZone) =>
  (input: T[], zone?: Area) => {
    const result: Selected<T> = { selected: [], inactive: [] };

    if (!zone) return { selected: [], inactive: input };

    input.forEach((t) =>
      zone.isOverlaping(f(t))
        ? result.selected.push(addTracking(t))
        : result.inactive.push(t)
    );

    return result;
  };
