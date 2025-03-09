import { Maybe } from './types';

type Events = {
  isPlayingChanged: boolean;
  timeChanged: number;
  bpmChanged: number;
};

type EName = keyof Events;

type EType<K extends EName> = Events[K];

type Parsers = { [K in EName]: (i: any) => Maybe<EType<K>> };

const parse = {
  boolean: (v: any) => (typeof v === 'boolean' ? v : undefined),
  number: (v: any) => (typeof v === 'number' ? v : undefined)
};

const parsers: Parsers = {
  isPlayingChanged: parse.boolean,
  timeChanged: parse.number,
  bpmChanged: parse.number
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
