import * as React from 'react';
import { TextButton } from '../../components/text-button';
import { useEnvelope } from '../hooks/use-envelopes';
import { WaveGrid } from '../../components/wave-grid';
import { Svg, Point } from '@wdaw/svg';
import { EnvelopeConfig } from '@wdaw/engine';
import { positive } from '../utils/math';
import { LineEditor } from '../../components/line-editor';
import { Module } from '../../components/module';

const styles = {
  nav: {
    display: 'flex',
    gap: '10px'
  }
} as const;

const envelope = (
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
  const { current, options, setFields } = useEnvelope();
  const decay = current.attack + current.decay;
  const sustainX = decay + 0.25;

  return (
    <Module label="Envelopes">
      <div style={styles.nav}>
        {options.map(({ name, active, onclick }) => (
          <TextButton
            key={name}
            name={name}
            active={active}
            onClick={onclick}
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
          onMove={(target, point) =>
            setFields(envelope(current.attack, sustainX, target, point))
          }
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
    </Module>
  );
};
