import * as React from 'react';
import { Synth } from './synth';
import { PianoRoll } from './piano-roll';
import { Keyboard } from './keyboard';
import { colors } from './styles';
import { Tracks } from './tracks';
import { flatStripes } from '@wdaw/svg';

const styles = {
  daw: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
    height: '435px'
  },
  synth: {
    position: 'relative',
    width: '660px',
    height: '600px',
    borderRadius: '2px',
    background: colors.background,
    border: '1px solid #CCC'
  },
  midi: {
    position: 'relative'
  },
  tracks: {
    marginTop: '100px',
    justifyContent: 'center',
    display: 'flex',
    position: 'relative'
  }
} as const;

const UI: React.FC = () => (
  <div>
    <div style={styles.daw}>
      <section style={styles.synth}>
        <Synth />
        <Keyboard />
      </section>
      <div style={styles.midi}>
        <PianoRoll />
      </div>
    </div>
    <div style={styles.tracks}>
      <Tracks />
    </div>
  </div>
);

export { UI };
