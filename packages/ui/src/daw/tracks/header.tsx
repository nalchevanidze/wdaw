import * as React from 'react';
import { HeaderButton } from '../../components/header-button';
import { colors } from '../../styles';
import { usePlayer } from '../hooks/use-player';

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
  },
  bpmInput: {
    userSelect: 'none',
    outline: 'none',
    border: '0',
    background: colors.secondary,
    fontSize: '14px',
    marginLeft: '4px',
    borderRadius: '3px'
  }
} as const;

const maxBPM = 200;
const minBPM = 0;

const Header: React.FC = () => {
  const { isPlaying, bpm, setBPM, toggle, stop } = usePlayer();

  return (
    <section style={styles.container}>
      <HeaderButton id={isPlaying ? 'pause' : 'play'} onClick={toggle} />
      <HeaderButton id="stop" onClick={stop} />
      <div style={styles.bpm}>
        <label htmlFor="bpm-input">BPM</label>
        <input
          id="bpm-input"
          type="number"
          value={bpm}
          onChange={(x) =>
            setBPM(Math.min(Math.max(minBPM, Number(x.target.value)), maxBPM))
          }
          min={minBPM}
          max={maxBPM}
          style={styles.bpmInput}
        />
      </div>
    </section>
  );
};

export { Header };
