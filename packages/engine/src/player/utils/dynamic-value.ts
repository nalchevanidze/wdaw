import { ControlPoint, ValueController } from '../../state/state';

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

class DynamicValue {
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

export class ControlValue {
  private dynamic?: DynamicValue;

  constructor(private changed: (i: number) => void) {}

  public set = (input: ValueController, time: number) => {
    if (input.type === 'fixed') {
      this.dynamic = undefined;
      this.changed(input.value);
      return;
    }

    this.dynamic = new DynamicValue(input.value);
    this.changed(this.dynamic.get(time));
  };

  next(time: number) {
    if (this.dynamic) {
      this.changed(this.dynamic.get(time));
    }
  }
}
