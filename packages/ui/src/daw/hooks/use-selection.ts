import { useEffect, useRef, useState } from 'react';
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

const isSelected = <T extends { id: string }>(s: Selected<T>) => {
  const selection = new Set(s.selected.map((t) => t.id));

  return (t: T) => selection.has(t.id);
};

const makePartition = <T extends object>(ts: T[], f: Predicate<T>) =>
  makeSelection(...partition(ts, f));

const makeSelection = <T extends object>(sel: Mixed<T>[], ina: Mixed<T>[]): Selected<T> => ({
  selected: sel.map(addTracking),
  inactive: ina.map(dropTracking)
});

const init = <T>(list: T[]) => ({
  selected: [],
  inactive: list
});

export const useSelection = <T extends { id: string }>(
  list: T[],
  dispatch: (s: T[]) => void
) => {
  const [state, _setState] = useState<Selected<T>>(init(list));
  const ref = useRef<Selected<T>>(init(list));

  const setState = (f: (i: Selected<T>) => Selected<T>) => {
    const s = f(ref.current);
    ref.current = s;
    _setState(s);
  };

  const selectWith = (f: Predicate<T>) =>
    setState((s) => makePartition(toAll(s), f));

  const modify = (f: (s: Selected<T>) => Mixed<T>[]) =>
    setState((s) => makeSelection([], f(s)));

  const clear = () => modify(toAll);

  const removeSelected = () => modify((s) => s.inactive);

  const remove = (i: T) => modify((s) => toAll(s).filter((t) => t !== i));

  const add = (...ts: T[]) => setState((s) => makeSelection(ts, toAll(s)));

  const edit = (f: EditFunc<T>) =>
    setState(({ selected, inactive }) => ({
      selected: mapTracked(selected, f),
      inactive
    }));

  useOnDeleteKey(removeSelected, [state.selected, state.inactive]);

  const sync = () =>
    dispatch([...ref.current.selected, ...ref.current.inactive]);

  const select = (i: T) => selectWith((n) => n == i);

  const selectIn = (f: (i: T) => IArea) => (area?: Area) =>
    selectWith((t) => area?.isOverlaping(f(t)) ?? false);

  useEffect(() => setState((s) => makePartition(list, isSelected(s))), [list]);

  return {
    selectIn,
    select,
    add,
    edit,
    all: toAll(state),
    clear,
    remove,
    sync
  };
};
