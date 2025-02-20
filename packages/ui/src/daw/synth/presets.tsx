import * as React from 'react';
import { usePreset } from '../hooks/use-preset';
import { TextButton } from '../../components/text-button';
import { WaveForm } from '../../components/waveform';
import { Module } from '../../components/module';

const styles = {
  items: {
    maxHeight: '100px',
    overflowY: 'scroll',
    width: '100%'
  }
} as const;

export const Presets: React.FC = () => {
  const { options } = usePreset();

  return (
    <Module label="presets" size={1}>
      <WaveForm quality={200} />
      <div style={styles.items}>
        {options.map(({ id, onclick, active }) => (
          <TextButton key={id} name={id} active={active} onClick={onclick} />
        ))}
      </div>
    </Module>
  );
};
