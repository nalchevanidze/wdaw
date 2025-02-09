import * as React from 'react';
import { colors } from '../../styles';
import { Level } from '../../components/level';
import { DawApiContext } from '../../context/state';

type Props = {
  name: string;
  id: number;
  y: number;
  active: boolean;
  width: number;
  height: number;
};

const levelSize = 16;

export const Panel: React.FC<Props> = ({
  name,
  id,
  active,
  y,
  width,
  height
}) => {
  const [{ tracks }, dispatch] = React.useContext(DawApiContext);
  const setTrack = () => dispatch({ type: 'SET_CURRENT_TRACK', payload: id });

  const setGain = (payload: number) =>
    dispatch({ type: 'SET_GAIN', id, payload });

  const gain = tracks[id].gain;

  return (
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
};
