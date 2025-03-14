export class TypedEvents<E> {
  private handlers: { [N in keyof E]?: Set<(e: E[N]) => void> } = {};

  public dispatch = <N extends keyof E>(name: N, event: E[N]) =>
    this.handlers[name]?.forEach((f) => f(event));

  public addEventListener = <N extends keyof E>(
    name: N,
    handler: (e: E[N]) => void
  ) => {
    this.handlers[name] = this.handlers[name] ?? new Set();
    this.handlers[name].add(handler);
  };

  public removeEventListener = <N extends keyof E>(
    name: N,
    handler: (e: E[N]) => void
  ) => this.handlers[name]?.delete(handler);

  public clear() {
    this.handlers = {};
  }
}

export type ChangeEvents = {
  ['changed/isPlaying']: boolean;
  ['changed/time']: number;
  ['changed/bpm']: number;
};
