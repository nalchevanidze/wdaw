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

const makeEvent = <T extends EventName>(name: T, value: EventTypes[T]) =>
  new CustomEvent(name, { detail: value });

const makeHandler =
  <N extends EventName>(name: N, f: EventHandler<N>) =>
  (event: Event): void => {
    if (!(event instanceof CustomEvent)) return undefined;
    const value = parsers[name](event.detail);
    if (!value) return;

    f(value);
  };

export class EngineEvents {
  private target = new EventTarget();

  constructor() {}

  dispatch<T extends EventName>(name: T, value: EventTypes[T]) {
    this.target.dispatchEvent(makeEvent(name, value));
  }

  public addEventListener = <N extends EventName>(
    name: N,
    f: EventHandler<N>
  ) => this.target.addEventListener(name, makeHandler(name, f));
}
