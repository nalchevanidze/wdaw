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

export const useSelection = <T extends object>(initial: T[]) => {
  const [{ selected, inactive }, set] = useState<Selected<T>>({
    selected: [],
    inactive: initial
  });

  const all = [...selected, ...inactive];

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
    reset,
    add,
    edit,
    all,
    clear,
    selectWith,
    removeWith
  };
};
