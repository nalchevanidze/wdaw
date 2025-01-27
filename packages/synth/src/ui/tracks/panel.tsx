import * as React from 'react';
import { colors } from '../styles';
import { ConfiguratorContext } from '../configurator';
import { Level } from '../common/level';

type Props = {
  name: string;
  id: number;
  y: number;
  active: boolean;
  width: number;
  height: number;
};

export const Panel: React.FC<Props> = ({
  name,
  id,
  active,
  y,
  width,
  height
}) => {
  const [_, dispatch] = React.useContext(ConfiguratorContext);
  const setTrack = () => dispatch({ type: 'SET_TRACK', payload: id });

  return (
    <>
      <text
        x={-width * 0.9}
        y={y + 32}
        fill={active ? colors.notes : 'gray'}
        fontFamily="sanf-serif"
        textAnchor="center"
        dominantBaseline="middle"
        pointerEvents="none"
      >
        {name}
      </text>
      <Level
        range={[0, 1]}
        onChange={console.log}
        value={0.5}
        color={colors.black}
        size={20}
        y={y + height/6}
        x={-width/2.5}
      />
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
    </>
  );
};
