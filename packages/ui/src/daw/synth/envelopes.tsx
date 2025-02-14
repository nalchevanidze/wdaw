import * as React from 'react';
import { Panel } from './panel';
import { TextButton } from '../../components/text-button';
import { useEnvelope } from '../hooks/use-envelopes';
import { WaveGrid } from '../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { EnvelopeConfig } from '@wdaw/engine';
import { positive } from '../utils/math';
import { LineEditor } from '../../components/line-editor';

const styles = {
  nav: {
    display: 'flex',
    gap: '10px'
  }
} as const;

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
  height?: number;
  width?: number;
  padding?: number;
};

export const Envelopes: React.FC<Props> = ({
  height = 100,
  width = 160,
  padding = 5
}) => {
  const [{ current, id, options, setEnvelope }, dispatch] = useEnvelope();
  const decay = current.attack + current.decay;
  const sustainX = decay + 0.25;

  const onMove = (target: string, point: Point) =>
    dispatch({
      type: 'SET_ENVELOPE',
      id,
      payload: genEnvelope(current.attack, sustainX, target, point)
    });

  return (
    <Panel label="envelopes" size={1}>
      <div style={styles.nav}>
        {options.map(({ name, active }) => (
          <TextButton
            key={name}
            name={name}
            active={active}
            onClick={() => setEnvelope(name)}
          />
        ))}
      </div>
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
            { id: 'attack', x: current.attack, y: 1 },
            { id: 'decay', x: decay, y: current.sustain },
            { x: sustainX, y: current.sustain },
            { id: 'release', x: sustainX + current.release, y: 0 }
          ]}
        >
          <WaveGrid width={width} height={height} />
        </LineEditor>
      </Svg>
    </Panel>
  );
};
