import * as React from 'react';
import { Oscillators } from './oscillators';
import { Envelopes } from './envelopes';
import { Sequencer } from './sequencer';

const Synth: React.FC = () => (
  <div style={{ display: 'flex', padding: '5px' }}>
    <Oscillators />
    <Envelopes />
    <Sequencer />
  </div>
);

export { Synth };
