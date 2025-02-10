import { NoteAction } from "../common/types";

export class RecordLoop {
  buffer: NoteAction[];

  constructor(size: number) {
    this.buffer = Array(size).fill(undefined);
  }

  get = (index: number) => this.buffer[index];

  private lookup = (i: number) => (this.buffer[i] = this.buffer[i] ?? {});

  start = (i: number, key: number) => {
    const step = this.lookup(i);
    step.start = step.start ?? [];
    step.start.push(key);
  };

  end = (i: number, key: number) => {
    const step = this.lookup(i);
    step.end = step.end ?? [];
    step.end.push(key);
  };
}