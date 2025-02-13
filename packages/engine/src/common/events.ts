import { Maybe } from './types';

type Events = {
  isPlayingChanged: boolean;
  timeChanged: number;
};

type EName = keyof Events;

type EType<K extends EName> = Events[K];

type Parsers = { [K in EName]: (i: any) => Maybe<EType<K>> };

const parsers: Parsers = {
  isPlayingChanged: (v) => (typeof v === 'boolean' ? v : undefined),
  timeChanged: (v) => (typeof v === 'number' ? v : undefined)
};

type Handler<N extends EName> = (e: EType<N>) => void;

export class EngineEvents {
  private target = new EventTarget();

  public dispatch = <T extends EName>(name: T, value: Events[T]) =>
    this.target.dispatchEvent(new CustomEvent(name, { detail: value }));

  public addEventListener = <N extends EName>(name: N, f: Handler<N>) =>
    this.target.addEventListener(name, (event) => {
      if (!(event instanceof CustomEvent)) return undefined;
      const value = parsers[name](event.detail);
      return value === undefined ? undefined : f(value);
    });
}
