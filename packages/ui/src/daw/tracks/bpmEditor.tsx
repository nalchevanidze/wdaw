import * as React from 'react';
import { WaveGrid } from '../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { LineEditor } from '../../components/line-editor';
import { usePlayer } from '../hooks/use-player';

type Props = {
  height: number;
  width: number;
};

const max = 240;
const scaleY = max;
export const BpmEditor: React.FC<Props> = ({ height, width }) => {
  const { bpm, setBPM } = usePlayer();

  const points = (bpm.type === 'dynamic' ? bpm.value : []).map((p, i) => ({
    x: p.index / width,
    y: p.value / scaleY,
    id: i.toString()
  }));

  const setPoint = (id: string, point: Point) =>
    setBPM({
      type: 'dynamic',
      value: points
        .map((p) => (p.id === id ? { ...p, ...point } : p))
        .sort((a, b) => a.x - b.x)
        .map(({ x, y }) => ({ index: x * width, value: y * scaleY }))
    });

  return (
    <LineEditor
      height={height}
      width={width}
      onMove={setPoint}
      controlers={[{ x: 0, y: 0 }, ...points, { x: width, y: 0 }]}
    />
  );
};
