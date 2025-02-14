import * as React from 'react';
import { WaveGrid } from '../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { ENVELOPE_ID, EnvelopeConfig } from '@wdaw/engine';
import { usePreset } from '../hooks/use-preset';
import { positive } from '../utils/math';
import { LineEditor } from '../../components/line-editor';

const genEnvelope = (
  attack: number,
  sustain: number,
  target: string,
  { x, y }: Point
): Partial<EnvelopeConfig> => {
  switch (target) {
    case 'attack':
      return { attack: x };
    case 'decay':
      return { decay: positive(x - attack), sustain: y };
    case 'release':
      return { release: positive(x - sustain) };
    default:
      return {};
  }
};

type Props = {
  id: ENVELOPE_ID;
  height?: number;
  width?: number;
  padding?: number;
};

export const Envelope: React.FC<Props> = ({
  id,
  height = 100,
  width = 160,
  padding = 5
}) => {
  const [{ envelopes }, dispatch] = usePreset();
  const env = envelopes[id];

  const decay = env.attack + env.decay;
  const sustainX = decay + 0.25;

  const onMove = (target: string, point: Point) =>
    dispatch({
      type: 'SET_ENVELOPE',
      id,
      payload: genEnvelope(env.attack, sustainX, target, point)
    });

  return (
    <Svg
      paddingLeft={padding}
      paddingTop={padding}
      width={width + padding * 2}
      height={height + padding * 2}
      zoom={0.8}
    >
      <LineEditor
        height={height}
        width={width * 0.8}
        onMove={onMove}
        controlers={[
          { x: 0, y: 0 },
          { id: 'attack', x: env.attack, y: 1 },
          { id: 'decay', x: decay, y: env.sustain },
          { x: sustainX, y: env.sustain },
          { id: 'release', x: sustainX + env.release, y: 0 }
        ]}
      >
        <WaveGrid width={width} height={height} />
      </LineEditor>
    </Svg>
  );
};
