import * as React from 'react';
import { usePreset } from '../hooks/use-preset';
import { TextButton } from '../../components/text-button';
import { Panel } from './panel';
import { WaveForm } from '../../components/waveform';

const styles = {
  items: {
    maxHeight: '100px',
    overflowY: 'scroll',
    width: '100%'
  }
} as const;

export const Presets: React.FC = () => {
  const { name, options } = usePreset();

  return (
    <Panel label="presets" size={1}>
      <WaveForm quality={200} />
      <div style={styles.items}>
        {options.map(({ id, onclick }) => (
          <TextButton
            name={id}
            key={id}
            active={id === name}
            onClick={onclick}
          />
        ))}
      </div>
    </Panel>
  );
};
