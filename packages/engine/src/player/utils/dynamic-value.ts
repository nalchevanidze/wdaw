export type ControlPoint = { index: number; value: number };

const fill = (size: number, [head, ...list]: ControlPoint[]): number[] => {
  const points = Array(size).fill(0);

  list.reduce((a, b) => {
    const diff = b.index - a.index;

    if (diff === 0) {
      points[b.index] = b.value;
      return b;
    }

    const step = (b.value - a.value) / diff;

    let value = a.value;

    for (let i = a.index; i < b.index; i++) {
      value += step;
      points[i] = value;
    }

    return b;
  }, head);

  return points;
};

class Record {
  list: number[];
  start: ControlPoint;
  end: ControlPoint;

  constructor(ls: ControlPoint[]) {
    const sorted = ls.sort((a, b) => a.index - b.index);

    this.start = sorted[0];
    this.end = sorted[sorted.length - 1];
    this.list = fill(this.end.index, sorted);
  }

  get = (time: number) => {
    const { start, end, list } = this;
    const i = Math.floor(time);

    if (i <= start.index) {
      return start.value;
    }

    if (i >= end.index) {
      return end.value;
    }

    return list[i];
  };
}

export type DynamicValueInput =
  | { type: 'fixed'; value: number }
  | { type: 'dynamic'; value: ControlPoint[] };

export class DynamicValue {
  private record?: Record;

  private current: number = 0;

  constructor(private changed: (i: number) => void) {}

  private update = (input: number) => {
    const value = Math.round(input);

    if (this.current === value) return;

    this.current = value;
    this.changed(value);
  };

  public set = (input: DynamicValueInput): DynamicValue => {
    if (input.type === 'fixed') {
      this.update(input.value);
    }

    this.record = input.type === 'fixed' ? undefined : new Record(input.value);
    return this;
  };

  next(time: number) {
    if (this.record) {
      this.update(this.record.get(time));
    }
  }
}
