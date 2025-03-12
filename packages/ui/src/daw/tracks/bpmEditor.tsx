import * as React from 'react';
import { usePlayer } from '../hooks/use-player';
import { DynamicValue } from '../../components/dynamic-value';

type Props = {
  height: number;
  width: number;
  panelWidth: number
};

export const BpmEditor: React.FC<Props> = ({panelWidth, height, width }) => {
  const { bpm, setBPM } = usePlayer();

  return (
    <>
      <text
        x={-panelWidth * 0.9}
        y={30}
        fill={'gray'}
        fontFamily="sanf-serif"
        textAnchor="center"
        dominantBaseline="middle"
        pointerEvents="none"
        style={{ userSelect: 'none' }}
      >
        BPM
      </text>
      <rect
        opacity={0.1}
        fill="black"
        x={-panelWidth}
        width={panelWidth}
        height={height}
        style={{ border: 'none', cursor: 'pointer' }}
      />{' '}
      <DynamicValue
        max={200}
        min={40}
        height={height}
        width={width}
        setValues={(value) => setBPM({ type: 'dynamic', value })}
        values={bpm.type === 'dynamic' ? bpm.value : []}
      />
    </>
  );
};
