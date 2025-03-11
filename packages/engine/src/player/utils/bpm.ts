import { ControlPoint } from '../../state/state';

const genBPMMap = (size: number, ls: ControlPoint[]): number[] => {
  const list = ls.sort((a, b) => a.index - b.index);

  const extended: ControlPoint[] = [
    { index: 0, value: list[0].value },
    ...list,
    { index: size, value: list[list.length - 1].value }
  ];

  const points = Array(size).fill(0);

  extended.reduce(
    (a, b) => {
      const diff = b.index - a.index;

      if (diff === 0) {
        points[b.index] = b.value;
        return b;
      }

      const step = (b.value - a.value) / diff;
      let value = a.value;

      console.log(value, a, b, step);

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

export class BPMRecord {
  list: number[];

  constructor(size: number, ls: ControlPoint[]) {
    this.list = genBPMMap(size, ls);
  }

  get = (time: number) => this.list[Math.floor(time)];
}
