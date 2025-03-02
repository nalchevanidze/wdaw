import { useEffect, useState } from 'react';
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
import { Area, IArea } from '@wdaw/svg';

type Selected<T extends object> = {
  selected: Tracked<T>[];
  inactive: T[];
};

const toAll = <T extends object>(s: Selected<T>): Mixed<T>[] => [
  ...s.selected,
  ...s.inactive
];

type ToId<T> = (i: T) => string | number;

export const useSelection = <T extends { id: string }>(
  list: T[],
  toId: ToId<T>,
  dispatch: (s: T[]) => void
) => {
  const [state, setState] = useState<Selected<T>>({
    selected: [],
    inactive: list
  });

  const setPartition = (f1: (s: Selected<T>) => T[], f2: Predicate<T>) => {
    setState((s) => {
      const [sel, ina] = partition(f1(s), f2);
      return {
        selected: sel.map(addTracking),
        inactive: ina.map(dropTracking)
      };
    });
  };

  const syncLocalState = (ts: T[]) =>
    setState((s) => {
      const all = toAll(s);
      if (ts.length !== all.length) {
        return { selected: [], inactive: ts.map(dropTracking) };
      }

      const selectedMap = Object.fromEntries(s.selected.map((t) => [t.id, t]));

      const [sel, ina] = partition(ts, (t) => Boolean(selectedMap[t.id]));

      return {
        selected: sel.map(addTracking),
        inactive: ina.map(dropTracking)
      };
    });

  const modify = (f: (s: Selected<T>) => Mixed<T>[]) =>
    setState((s) => ({ selected: [], inactive: f(s).map(dropTracking) }));

  const clear = () => modify(toAll);
  const removeSelected = () => modify(({ inactive }) => inactive);

  const remove = (i: T) => modify((s) => toAll(s).filter((t) => t !== i));

  const selectWith = (f: Predicate<T>) => setPartition(toAll, f);

  const add = (...ts: T[]) =>
    setState((s) => ({
      selected: ts.map(addTracking),
      inactive: toAll(s).map(dropTracking)
    }));

  const edit = (f: EditFunc<T>) =>
    setState(({ selected, inactive }) => ({
      selected: mapTracked(selected, f),
      inactive
    }));

  useOnDeleteKey(removeSelected, [state.selected, state.inactive]);

  const sync = () => {
    setState((s) => {
      requestAnimationFrame(() => dispatch([...s.selected, ...s.inactive]));
      return s;
    });
  };

  const select = (i: T) => selectWith((n) => n == i);

  const selectIn = (f: (i: T) => IArea) => (area?: Area) =>
    selectWith((t) => area?.isOverlaping(f(t)) ?? false);

  useEffect(() => syncLocalState(list), [list.map(toId).join('-')]);

  return {
    selectIn,
    select,
    add,
    edit,
    all: toAll(state),
    clear,
    remove,
    selected: state.selected,
    sync
  };
};
