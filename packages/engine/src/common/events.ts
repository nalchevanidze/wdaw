export type EventTypes = {
  isPlayingChanged: boolean;
  timeChanged: number;
};

export type EventHandler<T extends EventName> = (e: EventTypes[T]) => void;
export type EventName = keyof EventTypes;

export const mkEvent = <T extends EventName>(name: T, value: EventTypes[T]) =>
  new CustomEvent(name, { detail: value });

export const mapHandler =
  <N extends EventName>(name: N, f: EventHandler<N>) =>
  (e: Event): void => {
    if (!(e instanceof CustomEvent)) return undefined;

    const { detail } = e;

    switch (name) {
      case 'isPlayingChanged':
        if (typeof detail !== 'boolean') {
          return;
        }
        return f(detail as EventTypes[N]);
      case 'timeChanged':
        if (typeof detail !== 'number') {
          return;
        }
        return f(detail as EventTypes[N]);
    }
  };
