import * as React from 'react';
import { colors } from '../styles';
import { PANEL, TRACK_HEIGHT } from './defs';
import { ConfiguratorContext } from '../configurator';

type Props = {
  name: string;
  id: number;
  width: number;
  active: boolean;
  y: number;
};

export const Panel: React.FC<Props> = ({ name, id, active, y }) => {
  const [_, dispatch] = React.useContext(ConfiguratorContext);
  const setTrack = () => dispatch({ type: 'SET_TRACK', payload: id });

  return (
    <>
      <text
        x={8 - PANEL}
        y={y + 32}
        fill={active ? colors.notes : 'gray'}
        fontFamily="sanf-serif"
        textAnchor="center"
        dominantBaseline="middle"
        pointerEvents="none"
      >
        {name}
      </text>
      <rect
        fill="black"
        opacity={active ? 0.03 : 0.1}
        y={y}
        x={-PANEL}
        width={PANEL}
        height={TRACK_HEIGHT}
        onClick={setTrack}
        style={{ border: 'none', cursor: 'pointer' }}
      />
    </>
  );
};
