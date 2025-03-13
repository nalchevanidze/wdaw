export const debug = (name: string, param: any) => {
  if ('DEBUG' in globalThis) {
    console.log(name, param);
  }
};

export class Resource {
  private count = 0;

  constructor(
    private name: string,
    private max: number
  ) {}

  public new = () => {
    this.count++;

    if (this.count >= this.max) {
      console.warn(`Resource(${this.name}) reached number ${this.count}!`);
    }

    const id = `${this.name.toUpperCase()}-${this.count}`;

    debug('new', id);
    return id;
  };
}
