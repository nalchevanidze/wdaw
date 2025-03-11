import * as React from 'react';
import { usePlayer } from '../hooks/use-player';
import { DynamicValue } from '../../components/dynamic-value';

type Props = {
  height: number;
  width: number;
};

export const BpmEditor: React.FC<Props> = ({ height, width }) => {
  const { bpm, setBPM } = usePlayer();

  return (
    <DynamicValue
      max={200}
      min={40}
      height={height}
      width={width}
      setValues={(value) => setBPM({ type: 'dynamic', value })}
      values={bpm.type === 'dynamic' ? bpm.value : []}
    />
  );
};
