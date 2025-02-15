import { useState } from 'react';
import {
  addTracking,
  dropTracking,
  EditFunc,
  mapTracked,
  Mixed,
  Tracked
} from '../utils/tracking';
import { partition, Predicate } from '../../common/utils';
import { useOnDeleteKey } from './use-on-delete-key';

type Selected<T extends object> = {
  selected: Tracked<T>[];
  inactive: T[];
};

export const useSelection = <T extends object>(
  initial: T[],
  toId: (i: T) => string | number
) => {
  const [{ selected, inactive }, set] = useState<Selected<T>>({
    selected: [],
    inactive: initial
  });

  const all: Mixed<T>[] = [...selected, ...inactive];

  const setPartition = (ts: T[], f: Predicate<T>) => {
    const [sel, ina] = partition(ts, f);
    set({
      selected: sel.map(addTracking),
      inactive: ina.map(dropTracking)
    });
  };

  const sync = (ts: T[]) => {
    if (ts.length !== all.length) {
      return reset(ts);
    }

    const selectedMap = Object.fromEntries(selected.map((t) => [toId(t), t]));

    setPartition(ts, (t) => Boolean(selectedMap[toId(t)]));
  };

  const reset = (ts: T[]) =>
    set({ selected: [], inactive: ts.map(dropTracking) });

  const clear = () => reset(all);
  const removeSelected = () => reset(inactive);
  const removeWith = (f: Predicate<T>) => reset(all.filter((t) => !f(t)));

  const selectWith = (f: Predicate<T>) => setPartition(all, f);

  const add = (...ts: T[]) =>
    set({
      selected: ts.map(addTracking),
      inactive: all.map(dropTracking)
    });

  const edit = (f: EditFunc<T>) =>
    set({ selected: mapTracked(selected, f), inactive });

  useOnDeleteKey(removeSelected, [selected, inactive]);

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
