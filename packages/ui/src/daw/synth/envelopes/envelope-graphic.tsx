import * as React from 'react';
import { WaveGrid } from '../../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { ENVELOPE_ID, EnvelopeConfig } from '@wdaw/engine';
import { usePreset } from '../../hooks/use-preset';
import { positive, unitInterval } from '../../utils/math';
import { LineEditor } from '../../../common/line-editor';

const height = 100;
const width = 120;

type Props = { id: ENVELOPE_ID };

const EnvelopeConsumer: React.FC<Props> = ({ id }) => {
  const [{ envelopes }, dispatch] = usePreset();
  const env = envelopes[id];
  const attack = env.attack * width;
  const decay = attack + env.decay * width;
  const sustainX = decay + height / 4;
  const sustain = (1 - env.sustain) * height;
  const release = sustainX + env.release * width;

  const setEnvelope = (payload: Partial<EnvelopeConfig>) =>
    dispatch({ type: 'SET_ENVELOPE', id, payload });

  const onMove = (target: string, point: Point) => {
    const x = positive(point.x / width);
    const y = unitInterval(point.y / height);

    switch (target) {
      case 'attack':
        return setEnvelope({ attack: x });
      case 'decay':
        return setEnvelope({ decay: positive(x - attack), sustain: 1 - y });
      case 'release':
        return setEnvelope({ release: positive(x - sustainX / width) });
    }
  };

  return (
    <LineEditor
      onMove={onMove}
      height={height}
      controlers={[
        { point: [0, height] },
        { point: [attack, 0], id: 'attack' },
        {
          point: [decay, sustain],
          id: 'decay',
          emphasize: true
        },
        { point: [sustainX, sustain], emphasize: true },
        {
          point: [release, height],
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
