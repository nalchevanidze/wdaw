type EventTypes = {
  isPlayingChanged: boolean;
  timeChanged: number;
};

export type EventName = keyof EventTypes;

export type EventHandler<T extends EventName> = (e: EventTypes[T]) => void;

export const mkEvent = <T extends EventName>(name: T, value: EventTypes[T]) =>
  new CustomEvent(name, { detail: value });

type Parsers = { [K in EventName]: (i: any) => EventTypes[K] | undefined };

const events: Parsers = {
  isPlayingChanged: (v) => (typeof v !== 'boolean' ? v : undefined),
  timeChanged: (v) => (typeof v !== 'number' ? v : undefined)
};

export const makeHandler =
  <N extends EventName>(name: N, f: EventHandler<N>) =>
  (e: Event): void => {
    if (!(e instanceof CustomEvent)) return undefined;

    const value = events[name](e.detail);

    if (!value) return;

    f(value);
  };
