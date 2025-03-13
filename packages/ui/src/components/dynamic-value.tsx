import * as React from 'react';
import { Point } from '@wdaw/svg';
import { LineEditor } from './line-editor';

type Value = {
  time: number;
  value: number;
};

type Props = {
  height: number;
  width: number;
  setValues(vs: Value[]): void;
  values: Value[];
  min: number;
  max: number;
};

export const DynamicValue: React.FC<Props> = ({
  height,
  width,
  setValues,
  values,
  max = 1,
  min = 0
}) => {
  const scaleY = max - min;
  const points = values.map((p, i) => ({
    x: p.time / width,
    y: (p.value - min) / scaleY,
    id: i.toString()
  }));

  const update = (ps: Point[]) =>
    setValues(
      ps
        .sort((a, b) => a.x - b.x)
        .map(({ x, y }) => ({ time: x * width, value: min + y * scaleY }))
    );

  return (
    <LineEditor
      insert={(p) => update([...points, p])}
      height={height}
      width={width}
      onMove={(id, point) =>
        update(points.map((p) => (p.id === id ? { ...p, ...point } : p)))
      }
      controlers={[
        { x: 0, y: 0 },
        { x: 0, y: points[0].y },
        ...points,
        { x: 1, y: points[points.length - 1].y },
        { x: 1, y: 0 }
      ]}
    />
  );
};
