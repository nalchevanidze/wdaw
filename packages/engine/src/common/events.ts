type Events = {
  isPlayingChanged: boolean;
  timeChanged: number;
  bpmChanged: number;
};

type Name = keyof Events;

type Event<N extends Name> = Events[N];

type Handler<N extends Name> = (e: Event<N>) => void;

type Targets = { [N in Name]: Handler<N>[] };

const empty = (): Targets => ({
  isPlayingChanged: [],
  timeChanged: [],
  bpmChanged: []
});

export class EngineEvents {
  private events = empty();

  public dispatch = <N extends Name>(name: N, value: Event<N>) =>
    this.events[name].forEach((f) => f(value));

  public addEventListener = <N extends Name>(name: N, f: Handler<N>) =>
    this.events[name].push(f);

  public clear() {
    this.events = empty();
  }
}
