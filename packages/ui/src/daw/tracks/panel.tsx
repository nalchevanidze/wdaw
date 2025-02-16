import * as React from 'react';
import { colors } from '../../styles';
import { Level } from '../../components/level';

type Props = {
  name: string;
  y: number;
  active: boolean;
  width: number;
  height: number;
  gain: number;
  setGain(i: number): void;
  setTrack(): void;
  levelSize?: number;
};

export const Panel: React.FC<Props> = ({
  name,
  active,
  y,
  width,
  height,
  gain,
  levelSize = 16,
  setGain,
  setTrack
}) => (
  <>
    <text
      x={-width * 0.9}
      y={y + height / 2}
      fill={active ? colors.notes : 'gray'}
      fontFamily="sanf-serif"
      textAnchor="center"
      dominantBaseline="middle"
      pointerEvents="none"
      style={{ userSelect: 'none' }}
    >
      {name}
    </text>
    <rect
      fill="black"
      opacity={active ? 0.03 : 0.1}
      y={y}
      x={-width}
      width={width}
      height={height}
      onClick={setTrack}
      style={{ border: 'none', cursor: 'pointer' }}
    />
    <Level
      onChange={setGain}
      value={gain}
      color={colors.black}
      size={16}
      steps={48}
      y={y + height / 6}
      x={-levelSize * 3}
      stepOpacity={0.2}
      bold={0.1}
    />
  </>
);
