import * as React from 'react';
import { WaveGrid } from '../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { LineEditor } from '../../components/line-editor';
import { usePlayer } from '../hooks/use-player';

type Props = {
  height: number;
  width: number;
};

export const BpmEditor: React.FC<Props> = ({ height, width }) => {
  const scaleY = height * 2;
  const { bpm, setBPM } = usePlayer();

  const points = (bpm.type === 'dynamic' ? bpm.value : []).map((p, i) => ({
    x: p.index / width,
    y: p.value / scaleY,
    id: i.toString()
  }));

  const setPoint = (id: string, c: Point) =>
    setBPM({
      type: 'dynamic',
      value: points
        .map((p) => (p.id === id ? { ...p, ...c } : p))
        .sort((a, b) => a.x - b.x)
        .map((p) => ({ index: p.x * width, value: p.y * scaleY }))
    });

  return (
    <Svg width={width} height={height}>
      <LineEditor
        height={height}
        width={width}
        onMove={setPoint}
        controlers={points}
      >
        <WaveGrid width={width} height={height} />
      </LineEditor>
    </Svg>
  );
};
