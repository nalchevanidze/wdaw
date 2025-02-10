import { NoteAction } from '../common/types';

export class RecordLoop {
  samples: number = 4;
  offset: number;

  buffer: NoteAction[];

  constructor(
    public start: number,
    public end: number,
    public size: number
  ) {
    this.offset = start % size;
    this.buffer = Array(size * this.samples).fill(undefined);
  }

  public get = (index: number) => {
    const i = (index - this.offset) % this.size;

    return this.buffer[this.samples * i];
  };

  public startKey = (i: number, key: number) => {
    const step = this.lookup(i);
    step.start = step.start ?? [];
    step.start.push(key);
  };

  public endKey = (i: number, key: number) => {
    const step = this.lookup(i);
    step.end = step.end ?? [];
    step.end.push(key);
  };

  private lookup = (index: number) => {
    const i = index * this.samples;
    return (this.buffer[i] = this.buffer[i] ?? {});
  };
}
