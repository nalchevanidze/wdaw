import * as React from 'react';
import { Envelope } from './envelope';
import { Panel } from './panel';
import { ENVELOPE_ID } from '@wdaw/engine';
import { TextButton } from '../../components/text-button';
import { usePreset } from '../hooks/use-preset';

const styles = {
  nav: {
    display: 'flex',
    gap: '10px'
  }
} as const;

export const Envelopes: React.FC = () => {
  const [{ envelopes }] = usePreset();
  const [id, setId] = React.useState<ENVELOPE_ID>('gain');
  const ids = Object.keys(envelopes) as ENVELOPE_ID[];

  return (
    <Panel label="envelopes" size={1}>
      <div style={styles.nav}>
        {ids.map((name) => (
          <TextButton
            key={name}
            name={name}
            active={id === name}
            onClick={() => setId(name)}
          />
        ))}
      </div>
      <Envelope id={id} />
    </Panel>
  );
};
