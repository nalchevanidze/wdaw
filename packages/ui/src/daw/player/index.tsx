import * as React from 'react';
import { IconButton } from '../../components/icon-button';
import { colors } from '../../styles';
import { usePlayer } from '../hooks/use-player';
import { DynamicValueInput } from '../../components/dynamic-value-input';

const styles = {
  container: {
    display: 'flex',
    background: colors.background,
    padding: '5px',
    border: '0.05em solid #BBB',
    alignItems: 'center',
    gap: '5px'
  },
  bpm: {
    display: 'flex',
    padding: '5px',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    fontSize: '14px'
  }
} as const;

export const Player: React.FC = () => {
  const { isPlaying, bpm, currentBPM, setBPM, toggle, stop, save, reset } =
    usePlayer();

  return (
    <section style={styles.container}>
      <IconButton id={isPlaying ? 'pause' : 'play'} onClick={toggle} />
      <IconButton id="stop" onClick={stop} />
      <div style={styles.bpm}>
        <label htmlFor="bpm-input">BPM</label>
        <DynamicValueInput
          max={200}
          min={0}
          input={bpm}
          value={currentBPM}
          onChange={setBPM}
        />
      </div>
      <button onClick={save}> save</button>
      <button onClick={reset}> reset </button>
    </section>
  );
};
