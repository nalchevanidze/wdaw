import * as React from 'react';
import { TextButton } from '../../components/text-button';
import { useEnvelope } from '../hooks/use-envelopes';
import { WaveGrid } from '../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { LineEditor } from '../../components/line-editor';
import { Module } from '../../components/module';
import { usePlayer } from '../hooks/use-player';
import { ValueController } from '@wdaw/engine';

const styles = {
  nav: {
    display: 'flex',
    gap: '10px'
  }
} as const;

type Props = {
  height: number;
  width: number;
};

export const BpmEditor: React.FC<Props> = ({ height, width }) => {
  const { bpm, setBPM } = usePlayer();

  const h = height * 2;
  const w = width;

  const points = (bpm.type === 'dynamic' ? bpm.value : []).map((p, i) => ({
    x: p.index / w,
    y: p.value / h,
    id: i.toString()
  }));

  const setPoint = (id: string, c: Point) =>
    setBPM({
      type: 'dynamic',
      value: points
        .map((p) => (p.id === id ? { ...p, ...c } : p))
        .sort((a, b) => a.x - b.x)
        .map((p) => ({ index: p.x * w, value: p.y * h }))
    });

  return (
    <Svg width={width} height={height}>
      <LineEditor
        height={height}
        width={width}
        onMove={(target, point) => setPoint(target, point)}
        controlers={points}
      >
        <WaveGrid width={width} height={height} />
      </LineEditor>
    </Svg>
  );
};
