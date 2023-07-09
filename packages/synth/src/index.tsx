import * as React from 'react';
import { Synth } from './ui/synth';
import { PianoRoll } from './ui/piano-roll';
import { Keyboard } from './ui/keyboard';
import { Configurator } from './ui/configurator';
import { colors } from './ui/styles';

const styles = {
  daw: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    fontFamily: 'sans-serif'
  },
  synth: {
    width: '660px',
    height: '435px',
    borderRadius: '2px',
    background: colors.background,
    border: '1px solid #CCC'
  }
} as const;

const DAW: React.FC = () => (
  <Configurator>
    <div style={styles.daw}>
      <section style={styles.synth}>
        <Synth />
        <Keyboard />
      </section>
      <div style={{ position: 'relative' }}>
        <PianoRoll />
      </div>
    </div>
  </Configurator>
);

export default DAW;
