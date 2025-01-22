import * as React from 'react';
import { Synth } from './synth';
import { PianoRoll } from './piano-roll';
import { Keyboard } from './keyboard';
import { colors } from './styles';
import { Tracks } from './tracks';

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

const UI: React.FC = () => (
  <>
    <div style={styles.daw}>
      <section style={styles.synth}>
        <Synth />
        <Keyboard />
      </section>
      <div style={{ position: 'relative' }}>
        <Tracks />
        <PianoRoll />
      </div>
    </div>
  </>
);

export { UI };
