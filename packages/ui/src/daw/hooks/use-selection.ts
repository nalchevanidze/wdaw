import { useState } from 'react';
import {
  addTracking,
  dropTracking,
  EditFunc,
  mapTracked
} from '../utils/tracking';
import { Selected } from '../utils/selection';

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

  return {
    add,
    edit,
    all,
    selected,
    inactive,
    set,
    clear,
    track,
    removeSelected
  };
};
