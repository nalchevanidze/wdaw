export namespace Scalar {
  export type Value = { time: number; value: number };

  export type Values = Value[];

  export type Input =
    | { type: 'fixed'; value: number }
    | { type: 'dynamic'; value: Values };

  export const fixed = (value: number): Input => ({
    type: 'fixed',
    value
  });
  export const dynamic = (...value: Values): Input => ({
    type: 'dynamic',
    value
  });

  export const initDynamic = (value: number): Input => ({
    type: 'dynamic',
    value: [{ time: 0, value }]
  });
}

const fill = (size: number, [head, ...list]: Scalar.Values): number[] => {
  console.log(size)
  const points = Array(size).fill(0);

  list.reduce((a, b) => {
    const diff = b.time - a.time;

    if (diff === 0) {
      points[b.time] = b.value;
      return b;
    }

    const step = (b.value - a.value) / diff;

    let value = a.value;

    for (let i = a.time; i < b.time; i++) {
      value += step;
      points[i] = value;
    }

    return b;
  }, head);

  return points;
};

class Record {
  list: number[];
  start: Scalar.Value;
  end: Scalar.Value;

  constructor(ls: Scalar.Value[]) {
    if (ls.length === 0) {
      throw new TypeError('expected non-empty Scalar.Value!');
    }

    const sorted = ls.sort((a, b) => a.time - b.time);

    this.start = sorted[0];
    this.end = sorted[sorted.length - 1];
    console.log(this.end.time)
    this.list = fill(Math.max(this.end.time ?? 1, 1), sorted);
  }

  get = (time: number) => {
    const { start, end, list } = this;
    const i = Math.floor(time);

    if (i <= start.time) {
      return start.value;
    }

    if (i >= end.time) {
      return end.value;
    }

    return list[i];
  };
}

export class DynamicValue {
  private record?: Record;

  private current: number = 0;

  constructor(private changed: (i: number) => void) {}

  private update = (value: number): void => {
    if (this.current === value) return;

    this.current = value;
    this.changed(value);
  };

  public set = (input: Scalar.Input): DynamicValue => {
    if (input.type === 'fixed') {
      this.update(input.value);
    }

    this.record = input.type === 'fixed' ? undefined : new Record(input.value);
    return this;
  };

  next(time: number): void {
    if (this.record) {
      this.update(this.record.get(time));
    }
  }
}
