import { useState } from 'react';
import {
  addTracking,
  dropTracking,
  EditFunc,
  mapTracked,
  Tracked
} from '../utils/tracking';
import { useOnDelete } from '../utils/key-actions';
import { partition, Predicate } from '../../common/utils';

type Selected<T> = {
  selected: Tracked<T>[];
  inactive: T[];
};

export const useSelection = <T extends object>(
  initial: T[],
  toId?: (i: T) => string | number
) => {
  const [{ selected, inactive }, set] = useState<Selected<T>>({
    selected: [],
    inactive: initial
  });

  const all = [...selected, ...inactive];

  const sync = (ts: T[]) => {
    if (!toId) {
      return set({ selected: [], inactive: ts.map(dropTracking) });
    }

    const tmap = Object.fromEntries(ts.map((t) => [toId(t), t]));
    const lookup = (x: T) => tmap[toId(x)];

    set({
      selected: selected.map(lookup).map(addTracking),
      inactive: inactive.map(lookup).map(dropTracking)
    });
  };

  const reset = (ts: T[]) =>
    set({ selected: [], inactive: ts.map(dropTracking) });

  const clear = () => reset(all);
  const removeSelected = () => reset(inactive);
  const removeWith = (f: Predicate<T>) => reset(all.filter((t) => !f(t)));

  const selectWith = (f: Predicate<T>) => {
    const [sel, ina] = partition(all, f);
    set({
      selected: sel.map(addTracking),
      inactive: ina.map(dropTracking)
    });
  };

  const add = (...ts: T[]) =>
    set({
      selected: ts.map(addTracking),
      inactive: all.map(dropTracking)
    });

  const edit = (f: EditFunc<T>) =>
    set({ selected: mapTracked(selected, f), inactive });

  useOnDelete(removeSelected, [selected, inactive]);

  return {
    sync,
    add,
    edit,
    all,
    clear,
    selectWith,
    removeWith,
    selected
  };
};
