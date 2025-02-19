import * as React from 'react';
import { Synth } from './synth';
import { MidiEditor } from './midi-editor';
import { Keyboard } from './keyboard';
import { colors } from '../styles';
import { Tracks } from './tracks';
import { Player } from './player';

const styles = {
  daw: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    fontFamily: 'sans-serif'
  },
  synth: {
    position: 'relative',
    width: '540px',
    height: '340px',
    borderRadius: '2px',
    background: colors.background,
    border: '1px solid #CCC'
  },
  midi: {
    position: 'relative'
  },
  tracks: {
    padding: '10px',
    justifyContent: 'center',
    display: 'flex',
    position: 'relative'
  },
  canvas: {
    position: 'relative',
    background: '#FFF',
    border: '1px solid #BBB',
    display: 'block',
    borderRadius: '5px'
  }
} as const;

export const Gui: React.FC = () => (
  <div style={styles.canvas}>
    <div style={styles.daw}>
      <section style={styles.synth}>
        <Synth />
        <Keyboard />
      </section>
      <section style={styles.midi}>
        <MidiEditor />
      </section>
    </div>
    <section style={styles.tracks}>
      <Tracks />
    </section>
    <Player />
  </div>
);
