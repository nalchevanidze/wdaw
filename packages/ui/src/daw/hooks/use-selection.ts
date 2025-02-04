import { useState } from 'react';
import {
  addTracking,
  dropTracking,
  EditFunc,
  mapTracked
} from '../utils/tracking';
import { selectWith, Selected, Predicate } from '../utils/selection';
import { useOnDelete } from '../utils/key-actions';

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
    selected,
    inactive,
    clear,
    selectWith: (f: Predicate<T>) => set(selectWith(all, f)),
    removeWith
  };
};
