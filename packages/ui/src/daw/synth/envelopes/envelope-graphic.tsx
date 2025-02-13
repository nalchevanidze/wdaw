import * as React from 'react';
import { WaveGrid } from '../../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { ENVELOPE_ID, EnvelopeConfig } from '@wdaw/engine';
import { usePreset } from '../../hooks/use-preset';
import { positive, unitInterval } from '../../utils/math';
import { LineEditor } from '../../../components/line-editor';

const height = 100;
const width = 120;

type Props = { id: ENVELOPE_ID };

const EnvelopeConsumer: React.FC<Props> = ({ id }) => {
  const [{ envelopes }, dispatch] = usePreset();
  const env = envelopes[id];
  const { attack, sustain } = env;
  const decay = attack + env.decay;
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
      width={width}
      onMove={onMove}
      controlers={[
        { point: [0, 0] },
        { point: [attack, 1], id: 'attack' },
        {
          point: [decay, sustain],
          id: 'decay',
          emphasize: true
        },
        { point: [sustainX, sustain], emphasize: true },
        {
          point: [sustainX + env.release, 0],
          id: 'release'
        }
      ]}
    >
      <WaveGrid />
    </LineEditor>
  );
};

const padding = 10;

const EnvelopeGraphic = (props: Props) => (
  <Svg
    paddingLeft={padding}
    paddingTop={padding}
    width={width * 1.5 + padding * 2}
    height={height + padding * 2}
    zoom={0.8}
  >
    <EnvelopeConsumer {...props} />
  </Svg>
);

export default EnvelopeGraphic;
