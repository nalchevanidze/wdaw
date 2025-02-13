import * as React from 'react';
import { WaveGrid } from '../../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { ENVELOPE_ID, EnvelopeConfig } from '@wdaw/engine';
import { usePreset } from '../../hooks/use-preset';
import { positive } from '../../utils/math';
import { LineEditor } from '../../../components/line-editor';

const height = 100;
const width = 150;
const padding = 10;

type Props = { id: ENVELOPE_ID };

const EnvelopeConsumer: React.FC<Props> = ({ id }) => {
  const [{ envelopes }, dispatch] = usePreset();
  const env = envelopes[id];
  const decay = env.attack + env.decay;
  const sustainX = decay + 0.25;

  const setEnvelope = (payload: Partial<EnvelopeConfig>) =>
    dispatch({ type: 'SET_ENVELOPE', id, payload });

  const onMove = (target: string, { x, y }: Point) => {
    switch (target) {
      case 'attack':
        return setEnvelope({ attack: x });
      case 'decay':
        return setEnvelope({ decay: positive(x - env.attack), sustain: y });
      case 'release':
        return setEnvelope({ release: positive(x - sustainX) });
    }
  };

  return (
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
      <rect
        x={-padding}
        y={-padding}
        width={width + padding * 2}
        height={height + padding * 2}
        opacity={0}
      />
      <WaveGrid 
        width={width}
        height={height}
      />
    </LineEditor>
  );
};

export const Envelope = (props: Props) => (
  <Svg
    paddingLeft={padding}
    paddingTop={padding}
    width={width + padding * 2}
    height={height + padding * 2}
    zoom={0.8}
  >
    <EnvelopeConsumer {...props} />
  </Svg>
);
