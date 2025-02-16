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

type Selected<T extends object> = {
  selected: Tracked<T>[];
  inactive: T[];
};

const toAll = <T extends object>(s: Selected<T>): Mixed<T>[] => [
  ...s.selected,
  ...s.inactive
];

type ToId<T> = (i: T) => string | number;

export const useSelection = <T extends object>(list: T[], toId: ToId<T>) => {
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

  const sync = (ts: T[]) =>
    setState((s) => {
      const all = toAll(s);
      if (ts.length !== all.length) {
        return { selected: [], inactive: ts.map(dropTracking) };
      }

      const selectedMap = Object.fromEntries(
        s.selected.map((t) => [toId(t), t])
      );

      const [sel, ina] = partition(ts, (t) => Boolean(selectedMap[toId(t)]));

      return {
        selected: sel.map(addTracking),
        inactive: ina.map(dropTracking)
      };
    });

  const modify = (f: (s: Selected<T>) => Mixed<T>[]) =>
    setState((s) => ({ selected: [], inactive: f(s).map(dropTracking) }));

  const clear = () => modify(toAll);
  const removeSelected = () => modify(({ inactive }) => inactive);
  const removeWith = (f: Predicate<T>) =>
    modify((s) => toAll(s).filter((t) => !f(t)));

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

  const dispatcher = (f: (s: Selected<T>) => void) => () => {
    setState((s) => {
      requestAnimationFrame(() => f(s));
      return s;
    });
  };

  useEffect(() => sync(list), [list.map(toId).join("-")]);


  return {
    add,
    edit,
    all: toAll(state),
    clear,
    selectWith,
    removeWith,
    selected: state.selected,
    dispatcher
  };
};
