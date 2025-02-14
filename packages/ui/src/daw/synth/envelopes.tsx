import * as React from 'react';
import { Envelope } from './envelope';
import { Panel } from './panel';
import { ENVELOPE_ID } from '@wdaw/engine';
import { TextButton } from '../../components/text-button';

const styles = {
  nav: {
    margin: '6px',
    display: 'flex',
    gap: '10px'
  }
} as const;

const Envelopes: React.FC = () => {
  const [id, setId] = React.useState<ENVELOPE_ID>('gain');

  return (
    <Panel label="envelopes" size={3}>
      <div style={styles.nav}>
        <TextButton
          name="gain"
          active={id === 'gain'}
          onClick={() => setId('gain')}
        />
        <TextButton
          name="filter"
          active={id === 'filter'}
          onClick={() => setId('filter')}
        />
      </div>
      <Envelope id={id} />
    </Panel>
  );
};

export { Envelopes };
