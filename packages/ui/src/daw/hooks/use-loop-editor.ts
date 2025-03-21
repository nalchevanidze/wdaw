import * as React from 'react';
import { Maybe } from '../types';
import { useMidiFragment } from './use-midi-fragment';
import { toAccuracy } from '../utils/area';

export type LoopTarget = 'start' | 'end';

export const useLoop = (loopAccuracy: number) => {
  const { loop, setFragment } = useMidiFragment();

  const [origin, setOrigin] = React.useState<Maybe<number>>(undefined);
  const [target, setTarget] = React.useState<Maybe<LoopTarget>>(undefined);
  const [state, setLoop] = React.useState(loop);

  React.useEffect(() => setLoop(loop), [loop]);

  const sync = () => setFragment({ loop: state });

  const [start, end] = state;

  const startMove = (t: LoopTarget) => {
    setOrigin(t === 'start' ? start : end);
    setTarget(t);
  };

  const endMove = () => {
    setOrigin(undefined);
    setTarget(undefined);
    sync();
  };

  const move = (moveX: number) => {
    const time = toAccuracy(loopAccuracy)(moveX);
    if (origin === undefined) return;

    const [start, end] = state;
    switch (target) {
      case 'start':
        return setLoop([origin + time, end]);
      case 'end':
        return setLoop([start, origin + time]);
    }
  };

  return {
    target,
    startMove,
    endMove,
    state,
    move
  };
};
