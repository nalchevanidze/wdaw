import * as React from 'react';
import { Oscillators } from './oscillators';
import { Envelopes } from './envelopes';
import { Sequencer } from './sequencer';
import { Presets } from './presets';

const styles = {
  main: {
    display: 'flex',
    fontSize: '10px',
    alignItems: 'flex-start',
    padding: '5px'
  }
};

const Synth: React.FC = () => (
  <div style={styles.main}>
    <Presets />
    <Oscillators />
    <div>
      <Envelopes />
      <Sequencer />
    </div>
  </div>
);

export { Synth };
