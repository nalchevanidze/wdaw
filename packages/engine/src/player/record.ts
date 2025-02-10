import { NoteAction } from '../common/types';

export class RecordLoop {
  samples: number = 4;

  buffer: NoteAction[];

  constructor(public size: number) {
    this.buffer = Array(size * this.samples).fill(undefined);
  }

  public get = (index: number) => this.buffer[index];

  public start = (i: number, key: number) => {
    const step = this.lookup(i);
    step.start = step.start ?? [];
    step.start.push(key);
  };

  public end = (i: number, key: number) => {
    const step = this.lookup(i);
    step.end = step.end ?? [];
    step.end.push(key);
  };

  private lookup = (i: number) => (this.buffer[i] = this.buffer[i] ?? {});
}
