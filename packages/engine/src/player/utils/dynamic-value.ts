import { ControlPoint } from '../../state/state';

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

export class DynamicValue {
  list: number[];
  start: ControlPoint;
  end: ControlPoint;

  constructor(ls: ControlPoint[]) {
    const sorted = ls.sort((a, b) => a.index - b.index);

    this.start = sorted[0];
    this.end = sorted[sorted.length - 1];

    this.list = fill(this.end.index, sorted);

    console.log(this.list);
  }

  get = (time: number) => {
    const i = Math.floor(time);

    if (i <= this.start.index) {
      return this.start.value;
    }

    if (i >= this.end.index) {
      return this.end.value;
    }

    return this.list[i];
  };
}
