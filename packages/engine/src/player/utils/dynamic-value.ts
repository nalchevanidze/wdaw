import { ControlPoint } from '../../state/state';

const fill = (size: number, list: ControlPoint[]): number[] => {
  const points = Array(size).fill(0);

  list.reduce(
    (a, b) => {
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
    },
    { index: 0, value: 100 }
  );

  return points;
};

export class DynamicValue {
  list: number[];
  start: ControlPoint;
  end: ControlPoint;

  constructor(size: number, ls: ControlPoint[]) {
    const sorted = ls.sort((a, b) => a.index - b.index);

    this.start = sorted[0];
    this.end = sorted[sorted.length - 1];

    this.list = fill(size, [
      { index: 0, value: this.start.value },
      ...sorted,
      { index: size, value: this.end.value }
    ]);
  }

  get = (time: number) => this.list[Math.floor(time)];
}
