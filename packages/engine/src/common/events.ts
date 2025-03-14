export class EngineEvents<E> {
  private handlers: { [N in keyof E]?: ((e: E[N]) => void)[] } = {};

  public dispatch = <N extends keyof E>(name: N, event: E[N]) =>
    this.handlers[name]?.forEach((f) => f(event));

  public addEventListener = <N extends keyof E>(
    name: N,
    handler: (e: E[N]) => void
  ) => {
    this.handlers[name] = this.handlers[name] ?? [];
    this.handlers[name].push(handler);
  };

  public clear() {
    this.handlers = {};
  }
}

export type ChangeEvents = {
  ['changed/isPlaying']: boolean;
  ['changed/time']: number;
  ['changed/bpm']: number;
};
