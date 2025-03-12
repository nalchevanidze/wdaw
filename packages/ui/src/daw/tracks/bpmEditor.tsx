import * as React from 'react';
import { usePlayer } from '../hooks/use-player';
import { DynamicValue } from '../../components/dynamic-value';
import { Svg } from '@wdaw/svg';

type Props = {
  height: number;
  width: number;
  panelWidth: number;
};

export const BpmEditor: React.FC<Props> = ({ panelWidth, height, width }) => {
  const { bpm, setBPM } = usePlayer();

  if (bpm.type === 'fixed') {
    return null;
  }

  return (
    <Svg
      width={width}
      height={height}
      paddingLeft={panelWidth}
      style={{ borderTop: '1px solid #BBB' }}
    >
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
      />
      <DynamicValue
        max={200}
        min={40}
        height={height}
        width={width}
        setValues={(value) => setBPM({ type: 'dynamic', value })}
        values={bpm.value}
      />
    </Svg>
  );
};
