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

  const clear = () => set({ selected: [], inactive: all.map(dropTracking) });

  const track = () => set({ selected: selected.map(addTracking), inactive });

  const removeSelected = () => set({ selected: [], inactive });

  const add = (...ts: T[]) =>
    set({
      selected: ts.map(addTracking),
      inactive: all.map(dropTracking)
    });

  const edit = (f: EditFunc<T>) =>
    set({ selected: mapTracked(selected, f), inactive });

  const removeWith = (f: Predicate<T>) =>
    set({
      selected: [],
      inactive: all.filter((t) => !f(t)).map(dropTracking)
    });

  useOnDelete(removeSelected, [selected, inactive]);

  return {
    refresh: (ts: T[]) => set({ selected: [], inactive: ts }),
    add,
    edit,
    all,
    selected,
    inactive,
    clear,
    track,
    selectWith: (f: Predicate<T>) => set(selectWith(all, f)),
    removeWith
  };
};
