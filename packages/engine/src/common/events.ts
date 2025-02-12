type EventTypes = {
  isPlayingChanged: boolean;
  timeChanged: number;
};

type Parsers = { [K in EventName]: (i: any) => EventTypes[K] | undefined };

const parsers: Parsers = {
  isPlayingChanged: (v) => (typeof v !== 'boolean' ? v : undefined),
  timeChanged: (v) => (typeof v !== 'number' ? v : undefined)
};

export type EventName = keyof EventTypes;

export type EventHandler<T extends EventName> = (e: EventTypes[T]) => void;

export const mkEvent = <T extends EventName>(name: T, value: EventTypes[T]) =>
  new CustomEvent(name, { detail: value });

export const makeHandler =
  <N extends EventName>(name: N, f: EventHandler<N>) =>
  (event: Event): void => {
    if (!(event instanceof CustomEvent)) return undefined;
    const value = parsers[name](event.detail);
    if (!value) return;

    f(value);
  };
