type Events = {
  isPlayingChanged: boolean;
  timeChanged: number;
  bpmChanged: number;
};

type Name = keyof Events;

type Event<N extends Name> = Events[N];

type Handler<N extends Name> = (e: Event<N>) => void;

export class EngineEvents {
  private handlers: { [N in Name]?: Handler<N>[] } = {};

  public dispatch = <N extends Name>(name: N, event: Event<N>) =>
    this.handlers[name]?.forEach((f) => f(event));

  public addEventListener = <N extends Name>(name: N, handler: Handler<N>) => {
    this.handlers[name] = this.handlers[name] ?? [];
    this.handlers[name].push(handler);
  };

  public clear() {
    this.handlers = {};
  }
}
