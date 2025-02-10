import { NoteAction } from '../common/types';

export class RecordLoop {
  samples: number = 1
  buffer: NoteAction[];

  constructor(size: number) {
    this.buffer = Array(size).fill(undefined);
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
