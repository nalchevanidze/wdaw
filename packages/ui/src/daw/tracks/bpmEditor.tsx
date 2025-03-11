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

const toPoints = (bpm: ValueController) =>
  (bpm.type === 'dynamic' ? bpm.value : []).map((p, i) => ({
    x: p.index / 1088,
    y: p.value / 200,
    id: i.toString()
  }));

export const BpmEditor: React.FC<Props> = ({ height = 100, width = 160 }) => {
  const { bpm, setBPM } = usePlayer();

  const [points, setPoints] = React.useState(toPoints(bpm));

  const setPoint = (id: string, c: Point) =>
    setPoints(points.map((p) => (p.id === id ? { ...p, ...c } : p)));

  React.useEffect(()=> {
    setBPM({})
  },[points])

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
