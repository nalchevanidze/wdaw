import * as React from 'react';
import { Point } from '@wdaw/svg';
import { LineEditor } from '../../components/line-editor';
import { usePlayer } from '../hooks/use-player';

type Props = {
  height: number;
  width: number;
};

const max = 200;
const min = 40;
const scaleY = max - min;

export const BpmEditor: React.FC<Props> = ({ height, width }) => {
  const { bpm, setBPM } = usePlayer();

  const points = (bpm.type === 'dynamic' ? bpm.value : []).map((p, i) => ({
    x: p.index / width,
    y: (p.value - min) / scaleY,
    id: i.toString()
  }));

  const update = (ps: Point[]) =>
    setBPM({
      type: 'dynamic',
      value: ps
        .sort((a, b) => a.x - b.x)
        .map(({ x, y }) => ({ index: x * width, value: min + y * scaleY }))
    });

  const setPoint = (id: string, point: Point) =>
    update(points.map((p) => (p.id === id ? { ...p, ...point } : p)));

  const insert = (p: Point) => update([...points, p]);

  return (
    <LineEditor
      insert={insert}
      height={height}
      width={width}
      onMove={setPoint}
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
