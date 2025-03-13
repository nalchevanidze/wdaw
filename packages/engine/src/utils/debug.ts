const debug = (name: string, param: any) => {
  if ('DEBUG' in globalThis) {
    console.log(name, param);
  }
};

export type Resource = {
  debug(name: string): void;
};

export class Resources {
  private count = 0;

  constructor(
    private name: string,
    private max: number
  ) {}

  public new = (): Resource => {
    this.count++;

    if (this.count >= this.max) {
      console.warn(`Resource(${this.name}) reached number ${this.count}!`);
    }

    const id = `${this.name.toUpperCase()}-${this.count}`;

    debug('new', id);

    return { debug: (method: string) => debug(method, id) };
  };
}
